import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.interface';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';
import { ENV_KEY } from 'src/constants/env-keys';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<SignInResponseDto> {
    const { phone, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { phone } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Wrong phone or password');
    }

    await this.userRepository.save(user);
    const payload: JwtPayload = {
      id: user.id,
      phone,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const accessToken: string = this.jwtService.sign(payload);
    const refreshToken: string = this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh token expires in 7 days
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(signUpDto: SignUpRequestDto): Promise<string> {
    const { phone, firstName, lastName, password } = signUpDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      user = this.userRepository.create({
        password: hashedPassword,
        phone,
        firstName,
        lastName,
      });
    } else {
      throw new ConflictException('Email already existed');
    }

    await this.userRepository.save(user);
    return 'SUCCESS_REGISTER';
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<SignInResponseDto> {
    try {
      const decoded = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get(ENV_KEY.JWT_SECRET),
      });

      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new BadRequestException('Invalid refresh token');
      }

      const payload: JwtPayload = {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const newAccessToken = this.jwtService.sign(payload);

      return {
        accessToken: newAccessToken,
        refreshToken: refreshTokenDto.refreshToken, // Return the same refresh token
      };
    } catch {
      throw new BadRequestException('Invalid or expired refresh token');
    }
  }
}
