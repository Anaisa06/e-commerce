import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>
  ) { }

  async findAll(): Promise<User[]> {
    try {
      const users: User[] = await this.usersRepository.find();
      return users;

    } catch (error) {
      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500)
    }
  }

  async findOne(id: number): Promise<User> {
 
    try {

      const user: User = await this.usersRepository.findOne({where: { id }});

      if(!user) throw new NotFoundException(`User with id ${id} not found`);

      return user;
 
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user: User = await this.findOne(id);
      let hashedPassword: string;

      if(updateUserDto.password) {
        hashedPassword = await this.hashPassword(updateUserDto.password);
      }

      user.email = updateUserDto.email;
      user.password = hashedPassword;

     return await this.usersRepository.save(user);

    } catch (error) {
      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500)
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const user: User = await this.findOne(id);
      return await this.usersRepository.remove(user);
      
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500)
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
