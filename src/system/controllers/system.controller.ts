import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class SystemController {
  @Get('/health')
  @HttpCode(200)
  health() {}
}
