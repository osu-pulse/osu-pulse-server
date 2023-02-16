import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsString } from 'class-validator';
import { NodeEnv } from '../constants/node-env';

export class EnvModel {
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

  /*
   * URLs
   */
  @IsString()
  URL_API: string;

  @IsString()
  URL_AUTH: string;

  @IsString()
  URL_WEB_CLIENT: string;

  @IsString()
  URL_MINIO: string;

  @IsString()
  URL_OSU: string;

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

  /*
   * Osu
   */
  @IsString()
  OSU_CLIENT_ID: string;

  @IsString()
  OSU_CLIENT_SECRET: string;
}
