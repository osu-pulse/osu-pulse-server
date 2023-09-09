import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE, BaseExceptionFilter } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env, getEnvPath, validateEnv } from './helpers/env';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { validationOptions } from '../shared/constants/validation-options';
import { LoggingExceptionFilter } from './filters/logging-exception.filter';
import { lowercaseKeys } from '../shared/helpers/case';
import mongooseLeanGetters from 'mongoose-lean-getters';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import mongoose from 'mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SystemController } from './controllers/system.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { days } from 'milliseconds';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath(),
      validate: validateEnv,
      cache: true,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        ttl: days(1),
        store: redisStore,
        socket: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        uri: `mongodb://${configService.get('MONGO_HOST')}:${configService.get(
          'MONGO_PORT',
        )}`,
        dbName: configService.get('MONGO_NAME'),
        autoCreate: true,
        auth: {
          username: configService.get('MONGO_USERNAME'),
          password: configService.get('MONGO_PASSWORD'),
        },
        connectionFactory: (connection: mongoose.Connection) => {
          connection.plugin(mongooseLeanGetters);
          connection.plugin(mongooseLeanVirtuals);
          return connection;
        },
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: (configService: ConfigService<Env, true>) => ({
        cors: configService.get('CORS') && { origin: true, credentials: true },
        debug: configService.get('DEBUG'),
        playground: configService.get('DEBUG'),
        introspection: configService.get('DEBUG'),
        autoSchemaFile: configService.get('DEBUG') && 'schema.gql',
        cache: 'bounded',
        csrfPrevention: true,
        fieldResolverEnhancers: ['guards'],
        installSubscriptionHandlers: true,
        context: (context) => ({ ...context, loaders: {} }),
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
  controllers: [SystemController],
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
  exports: [MongooseModule, GraphQLModule],
})
export class CoreModule {}
