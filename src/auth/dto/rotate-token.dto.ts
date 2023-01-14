import { IsString } from 'class-validator';

export class RotateTokenDto {
  @IsString()
  refresh_token: string;
}
