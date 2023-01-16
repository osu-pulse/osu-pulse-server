import { IsJWT, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenSetDto {
  @ApiProperty()
  @IsJWT()
  access_token: string;

  @ApiProperty()
  @IsString()
  refresh_token: string;
}
