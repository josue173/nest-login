import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDdo } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDdo): Promise<User> {
    try {
      const newUser = new this.userModel(createUserDto); // Creando instancia de un usuario
      return await newUser.save();
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException(`${createUserDto.email} already exists`);
      throw new InternalServerErrorException('Something wrong happened');
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
