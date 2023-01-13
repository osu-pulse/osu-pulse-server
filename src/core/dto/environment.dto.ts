import { NodeEnv } from '../constants/node-env';
import { IsBoolean, IsIn, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class EnvironmentDto {
  /*
   * Server
   */
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(Object.values(NodeEnv))
  NODE_ENV: NodeEnv = NodeEnv.DEVELOPMENT;

  @Type(() => Boolean)
  @IsBoolean()
  CORS: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  DEBUG: boolean;

  @IsString()
  HOST: string;

  @IsString()
  SECRET_COOKIE: string;

  /*
   * Database
   */
  @IsString()
  DB_ENDPOINT: string;

  @IsString()
  DB_PORT: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  /*
   * MinIo
   */
  @IsString()
  MI_ENDPOINT: string;

  @IsString()
  MI_PORT: number;

  @IsString()
  MI_USERNAME: string;

  @IsString()
  MI_PASSWORD: string;

  @IsString()
  MI_HOST: string;

  /*
   * Osu
   */
  @IsString()
  OSU_CLIENT_ID: string;

  @IsString()
  OSU_CLIENT_SECRET: string;
}
