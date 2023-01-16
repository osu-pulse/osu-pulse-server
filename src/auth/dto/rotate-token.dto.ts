import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RotateTokenDto {
  @ApiProperty()
  @IsString()
  refresh_token: string;
}
