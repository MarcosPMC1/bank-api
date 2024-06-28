import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { RegistrateDto } from './dto/registrate.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  Authenticate(@Body() data: AuthenticateDto) {
    return this.authService.Login(data.username, data.password);
  }

  @Post('register')
  Register(@Body() data: RegistrateDto) {
    return this.authService.Registrate(data.username, data.password);
  }
}
