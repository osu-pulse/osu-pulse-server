import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';

export class DeviceStatusDto {
  @IsBoolean()
  playing: boolean;

  @IsNumber()
  @Min(0)
  @Max(1)
  volume: number;

  @IsNumber()
  progress: number;

  @IsString()
  trackId: string;
}
