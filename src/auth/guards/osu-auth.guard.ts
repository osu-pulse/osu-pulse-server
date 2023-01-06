import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { unknownContextConvertor } from '../../shared/convertors/unknown-context.convertor';
import { GuardWithUnknownContext } from '../types/guard-with-unknown-context';

@Injectable()
export class OsuAuthGuard extends AuthGuard('osu') {}
