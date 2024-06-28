import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async Login(username: string, pass: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!bcrypt.compareSync(pass, user?.password)) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload, { algorithm: 'RS256' }),
    };
  }

  async Registrate(username: string, password: string) {
    return this.userRepository
      .save(
        this.userRepository.create({
          username,
          password: bcrypt.hashSync(password, 10),
        }),
      )
      .then((data) => {
        const { password, ...user } = data;
        return user;
      });
  }
}
