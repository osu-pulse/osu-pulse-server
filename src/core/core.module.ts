import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE, BaseExceptionFilter } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath, validateEnv } from './helpers/config-env.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { EnvironmentDto } from './dto/environment.dto';
import { validationOptions } from '../shared/constants/validation-options';
import { LoggingExceptionFilter } from './filters/logging-exception.filter';
import { lowercaseKeys } from '../shared/helpers/case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath(),
      validate: validateEnv,
      cache: true,
    }),
    MulterModule.register({
      limits: {
        parts: 10,
        fields: 1,
        files: 2,
        fileSize: 10 * 1024 ** 2,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentDto, true>) => ({
        uri: `mongodb://${configService.get('DB_ENDPOINT')}:${configService.get(
          'DB_PORT',
        )}`,
        dbName: configService.get('DB_NAME'),
        autoCreate: true,
        auth: {
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
        },
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: (configService: ConfigService<EnvironmentDto, true>) => ({
        cors: configService.get('CORS'),
        debug: configService.get('DEBUG'),
        playground: configService.get('DEBUG'),
        introspection: configService.get('DEBUG'),
        autoSchemaFile: configService.get('DEBUG') && 'schema.gql',
        cache: 'bounded',
        csrfPrevention: true,
        fieldResolverEnhancers: ['guards'],
        installSubscriptionHandlers: true,
        subscriptions: {
          'subscriptions-transport-ws': {
            onConnect: (connectionParams) => lowercaseKeys(connectionParams),
            context: ({ connection }) => ({
              req: { headers: connection.context },
            }),
          },
          'graphql-ws': {
            onConnect: ({ connectionParams, extra }) =>
              Object.assign(extra, {
                context: lowercaseKeys(connectionParams),
              }),
            context: ({ extra }) => ({ req: { headers: extra.context } }),
          },
        },
      }),
    }),
  ],
  providers: [
    BaseExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: LoggingExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(validationOptions),
    },
  ],
  exports: [ConfigModule, MulterModule, MongooseModule, GraphQLModule],
})
export class CoreModule {}
