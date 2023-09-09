import { plainToInstance, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsString, validateSync } from 'class-validator';
import fs from 'fs';
import { validationOptions } from '../../shared/constants/validation-options';
import { NodeEnv } from '../constants/node-env';

export function getEnvPath(): string | undefined {
  const nodeEnv = process.env.NODE_ENV;
  const queue = [
    `.env.${nodeEnv}`,
    `.env.${nodeEnv}.local`,
    '.env.local',
    '.env',
  ];
  return queue.find((path) => fs.existsSync(path));
}

export function validateEnv(config: Record<string, unknown>) {
  const env = plainToInstance(Env, config);

  const errors = validateSync(env, validationOptions);
  if (errors.length) {
    throw errors;
  }

  return env;
}

export class Env {
  /*
   * Server
   */
  @IsIn(Object.values(NodeEnv))
  NODE_ENV: NodeEnv = NodeEnv.DEVELOPMENT;

  @Type(() => Boolean)
  @IsBoolean()
  CORS: boolean = false;

  @Type(() => Boolean)
  @IsBoolean()
  DEBUG: boolean = true;

  /*
   * URLs
   */
  @IsString()
  URL_API: string;

  @IsString()
  URL_AUTH: string;

  @IsString()
  URL_MINIO: string;

  @IsString()
  URL_PROXY: string;

  /*
   * Redis
   */
  @IsString()
  REDIS_HOST: string;

  @IsString()
  REDIS_PORT: string;

  /*
   * Mongo
   */
  @IsString()
  MONGO_HOST: string;

  @IsString()
  MONGO_PORT: string;

  @IsString()
  MONGO_NAME: string;

  @IsString()
  MONGO_USERNAME: string;

  @IsString()
  MONGO_PASSWORD: string;

  /*
   * MinIo
   */
  @IsString()
  MINIO_HOST: string;

  @IsString()
  MINIO_PORT: string;

  @IsString()
  MINIO_USERNAME: string;

  @IsString()
  MINIO_PASSWORD: string;

  /*
   * Osu
   */
  @IsString()
  OSU_CLIENT_ID: string;

  @IsString()
  OSU_CLIENT_SECRET: string;
}
