// src/auth/auth.controller.ts
import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import {User} from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenDto, RefreshResponseDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'User logged in successfully', type: LoginResponseDto })
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: User })
  async register(@Body() body:RegisterDto) {
    return this.authService.register(body);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Access token refreshed successfully', 
    type: RefreshResponseDto 
  })
  async refreshToken(@Body() body: RefreshTokenDto) {
    const { refreshToken } = body;
    
    const decoded = this.authService.verifyRefreshToken(refreshToken);
    
    return this.authService.refreshTokens(decoded.sub, refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout(@Request() req: { user: { sub: string } }) {
    await this.authService.logout(req.user.sub);
    return { message: 'Logout successful' };
  }
}
