import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PlaylistsService } from '../services/playlists.service';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { Auth } from '../../auth/decorators/auth.decorator';
import { PlaylistNotFoundException } from '../exceptions/playlist-not-found.exception';
import { FileUploadDto } from '../../shared/dto/file-upload.dto';

@ApiTags('Playlists')
@Controller()
export class PlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}

  @ApiOperation({
    summary: 'Set playlist cover',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @ApiNoContentResponse({
    description: 'Cover has been successfully set',
  })
  @ApiBearerAuth()
  @UseGuards(OauthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Put('/playlists/:playlistId/cover')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setCover(
    @Param('playlistId') playlistId: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Auth() userId: string,
  ) {
    const playlistExists = await this.playlistsService.existsByUserIdAndId(
      userId,
      playlistId,
    );
    if (!playlistExists) {
      throw new PlaylistNotFoundException();
    }

    await this.playlistsService.setCover(playlistId, file.buffer);
  }
}
