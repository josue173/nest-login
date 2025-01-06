import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDdo } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDdo) {}
