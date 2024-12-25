import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';
import { UserDto } from './dto/user.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() credentials: AuthCredentialsDto): Promise<SignInResponseDto> {
    return this.authService.signIn(credentials);
  }

  @Get('user-information')
  @UseGuards(JwtAuthGuard)
  getUserInformation(@GetUser() user: UserDto): UserDto {
    return user;
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpRequestDto): Promise<string> {
    return this.authService.signUp(signUpDto);
  }

  @Put('refresh-token')
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<SignInResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
