import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenSetDto } from '../../auth/dto/token-set.dto';

@ApiTags('System')
@Controller()
export class SystemController {
  @ApiOperation({
    summary: 'Check status',
  })
  @ApiOkResponse({
    description: 'The server is ok',
  })
  @Get('/health')
  @HttpCode(200)
  health() {}
}
