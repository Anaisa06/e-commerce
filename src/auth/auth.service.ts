import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Leave } from 'src/leaves/entities/leave.entity';
import { throwError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    @InjectRepository(Leave) private leavesRepository: Repository<Leave>,
    private jwtService: JwtService
  ) { }

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      if (!registerDto.password || !registerDto.email) throw new BadRequestException('All fields are required');

      const hashedPassword: string = await this.hashPassword(registerDto.password);

      const clientRole: Role = await this.rolesRepository.findOne({ where: { name: 'client' } });

      if (!clientRole) throw new NotFoundException('Client role was not found');

      const newClient: User = this.usersRepository.create({ ...registerDto, password: hashedPassword, role: clientRole });

      const saveClient: User = await this.usersRepository.save(newClient);

      return saveClient;

    } catch (error) {
      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500)
    }
  }

  async login(loginDto: LoginDto) {
    try {

      if (!loginDto.password || !loginDto.email) throw new BadRequestException('All fields are required');

      const user: User = await this.findUserByEmail(loginDto.email);

      if (!bcrypt.compare(loginDto.password, user.password)) throw new BadRequestException('Bad credentials');

      const leaves: Leave = await this.getUserLeaves(user);

      return this.generateToken(user, leaves);

    } catch (error) {

      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500)
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async findUserByEmail(email: string): Promise<User> {
    try {
      const user: User = await this.usersRepository.findOne({ where: { email }, relations: ['role'] });

      if (!user) throw new NotFoundException('Bad credentials');

      return user;

    } catch (error) {
      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500)
    }
  }

  private async getUserLeaves(user: User): Promise<Leave> {
    try {
      const leaves: Leave = await this.leavesRepository.findOne({ where: { role: user.role } });
      console.log(leaves, user)

      if (!leaves) throw new NotFoundException('Leaves not found');

      return leaves;

    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', error.status || 500)
    }
  }
  private generateToken(user: User, leaves: Leave): string {
    const payload = { id: user.id, email: user.email, leaves };
    return this.jwtService.sign(payload);
  }
}
