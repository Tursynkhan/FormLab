// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findByEmail(email);
    console.log('Found user:', user);
    if (user) {
      console.log('Password hash:', user.passwordHash);
    }
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      console.log('password is matched');
      const { passwordHash, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result;
    }
    return null;
  }

  async login(user: Partial<User>): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role 
    };   
    
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: jwtConstants.refreshSecret,
        expiresIn: jwtConstants.refreshExpiration,
      }
    );

    await this.usersService.updateRefreshToken(user.id!.toString(), refreshToken);

    return { accessToken, refreshToken };

  }
  async refreshTokens(userId: string, refreshToken: string): Promise<{ accessToken: string }> {

    const user = await this.usersService.findById(userId);
    
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid user or refresh token');
    }

    try {
      this.jwtService.verify(refreshToken, { secret: jwtConstants.refreshSecret });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isTokenValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload)
    };
  }
  verifyRefreshToken(refreshToken: string): { sub: string } {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
    } catch{
      throw new UnauthorizedException('Invalid or expired refresh token');
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
      passwordHash: hashedPassword
    });
  }
  async logout(userId: string): Promise<void> {
    return this.usersService.removeRefreshToken(userId);
  }
}
