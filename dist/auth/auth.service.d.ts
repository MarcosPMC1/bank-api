import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    Login(username: string, pass: string): Promise<{
        access_token: string;
    }>;
    Registrate(username: string, password: string): Promise<{
        id: string;
        username: string;
    }>;
}
