import { PickType } from '@nestjs/swagger';
import { GlobalDto } from '../../common';

export class AuthLocalDto extends PickType(GlobalDto, ['email', 'password']) {}
