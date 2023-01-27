import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DeviceStatusDto } from './device-status.dto';

export class SetDeviceStatusDto {
  @IsString()
  deviceId: string;

  @Type(() => DeviceStatusDto)
  @ValidateNested()
  status: DeviceStatusDto;
}
