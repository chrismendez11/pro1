import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller({
  path: 'auth',
  version: VERSION_NEUTRAL,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  signIn(@Body() _signInDto: SignInDto, @Request() req: Request) {
    return this.authService.signIn(req['user']);
  }
}
