import { NodeEnv } from '../constants/node-env';
import { IsBoolean, IsIn, IsNumber, IsString } from 'class-validator';
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

  /*
   * Database
   */
  @IsString()
  DB_HOST: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  /*
   * MinIo
   */
  @IsString()
  MI_ENDPOINT: string;

  @Type(() => Number)
  @IsNumber()
  MI_PORT: number;

  @IsString()
  MI_BUCKET: string;

  @IsString()
  MI_ACCESS_KEY: string;

  @IsString()
  MI_SECRET_KEY: string;

  @IsString()
  MI_HOST: string;
}
