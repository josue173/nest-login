import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

import { CreateUserDdo } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/auth.entity';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDdo): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcrypt.hashSync(password, 10),
        ...userData,
      }); // Creando instancia de un usuario con la contraseña encriptada
      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();
      return newUser;
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException(`${createUserDto.email} already exists`);
      throw new InternalServerErrorException('Something wrong happened');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException(`Not valid credentials`);
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Not valid password`);
    const { password: _, ...resto } = user.toJSON();
    return {
      ok: true,
      ...resto,
    };
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
