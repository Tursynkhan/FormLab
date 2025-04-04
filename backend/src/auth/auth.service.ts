// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { jwtConstants } from './constants';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findByEmail(email);
    console.log('Found user:', user);
    if (user) {
      console.log('Password hash:', user.passwordHash);
    }
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      console.log('password is matched');
      const { passwordHash, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result;
    }
    return null;
  }

  async login(
    user: Partial<User>,
    res: Response,
  ): Promise<{ accessToken: string, username: string }> {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.accessSecret,
      expiresIn: jwtConstants.accessExpiration,
    });
    const refreshToken = this.jwtService.sign(
      { sub: user.id },

      {
        secret: jwtConstants.refreshSecret,
        expiresIn: jwtConstants.refreshExpiration,
      },
    );

    const refreshTokenSignature = refreshToken.split('.')[2];  
    await this.usersService.updateRefreshToken(user.id!.toString(), refreshTokenSignature);
    console.log('service1')
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log('service2')
    return { accessToken ,
      username: user.username ?? 'Guest'
    };
  }
  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
  
      const user = await this.usersService.findById(decoded.sub);
  
      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Invalid user or refresh token');
      }
  
      const refreshTokenSignature = refreshToken.split('.')[2];
      const isValid = await bcrypt.compare(refreshTokenSignature, user.refreshTokenHash);
  
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }
  
      const newAccessToken = this.jwtService.sign({
        username: user.username,
        sub: user.id,
        role: user.role,
      }, {
        secret: jwtConstants.accessSecret,
        expiresIn: jwtConstants.accessExpiration,
      });
  
      const newRefreshToken = this.jwtService.sign(
        { sub: user.id },
        {
          secret: jwtConstants.refreshSecret,
          expiresIn: jwtConstants.refreshExpiration,
        }
      );
  
      const newSignature = newRefreshToken.split('.')[2];
  
      await this.usersService.updateRefreshToken(user.id, newSignature);
  
      return {
        accessToken: newAccessToken,
        newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Could not refresh token', error);
    }
  }
  

  async register(userData: RegisterDto): Promise<User> {
    if (!userData.password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    return this.usersService.create({
      ...userData,
      passwordHash: hashedPassword,
    });
  }
  async logout(userId: string): Promise<void> {
    return this.usersService.removeRefreshToken(userId);
  }
}
