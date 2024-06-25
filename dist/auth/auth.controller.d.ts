import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { RegistrateDto } from './dto/registrate.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    Authenticate(data: AuthenticateDto): Promise<{
        access_token: string;
    }>;
    Register(data: RegistrateDto): Promise<{
        id: string;
        username: string;
    }>;
}
