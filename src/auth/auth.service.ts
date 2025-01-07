import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt.payload';
import { LoginDto } from './dto/login-dto';
import { LoginResponse } from './interfaces/login-response';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/auth.entity';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private _jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
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

  async register(registerUserDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerUserDto);
    // const user = await this.userModel.findOne({ email: (await newUser).email });
    // console.log(user.id);
    const token = this.getJwt({ id: user._id });
    return {
      user,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException(`Not valid credentials`);
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Not valid password`);
    const { password: _, ...resto } = user.toJSON();
    return {
      user: resto,
      token: this.getJwt({ id: user.id }),
    };
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    const { password, ...resto } = user.toJSON();
    return resto;
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

  getJwt(payload: JwtPayload) {
    const token = this._jwtService.sign(payload);
    return token;
  }
}
