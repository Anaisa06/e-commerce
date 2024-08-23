import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>
) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      if(!createUserDto.password || !createUserDto.email) throw new BadRequestException('All fields are required');

      const salt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(createUserDto.password, salt);

      const clientRole: Role = await this.rolesRepository.findOne({ where: { name: 'client' }});

      if(!clientRole) throw new NotFoundException('Client role was not found');

      const newClient: User = this.usersRepository.create({ ...createUserDto, password: hashedPassword, role: clientRole });

      const saveClient: User = await this.usersRepository.save(newClient);

      return saveClient;

    } catch (error) {
      
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
