import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { UsersService } from '@modules/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@modules/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // For simplicity, create a new tenant for each registration
    // In production, you might want to handle tenant creation separately
    const tenantId = new Types.ObjectId();

    const user = await this.usersService.create({
      ...registerDto,
      role: registerDto.role || UserRole.TENANT_ADMIN,
      tenantId: tenantId.toString(),
    });

    const tokens = await this.generateTokens(user);

    // Store refresh token
    const userId = (user._id as Types.ObjectId).toString();
    await this.usersService.addRefreshToken(userId, tokens.refreshToken);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        storeId: user.storeId,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password, loginDto.tenantId);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    // Store refresh token
    await this.usersService.addRefreshToken(user._id.toString(), tokens.refreshToken);

    // Update last login
    await this.usersService.updateLastLogin(user._id.toString());

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        storeId: user.storeId,
      },
      ...tokens,
    };
  }

  async logout(userId: string, refreshToken: string) {
    await this.usersService.removeRefreshToken(userId, refreshToken);
    return { message: 'Logged out successfully' };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.usersService.findOne(payload.sub, payload.tenantId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Remove old refresh token and generate new ones
      const userId = (user._id as Types.ObjectId).toString();
      await this.usersService.removeRefreshToken(userId, refreshToken);

      const tokens = await this.generateTokens(user);

      // Store new refresh token
      await this.usersService.addRefreshToken(userId, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(email: string, password: string, tenantId: string): Promise<any> {
    const user = await this.usersService.findByEmail(email, tenantId);

    if (!user) {
      return null;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    return user;
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      tenantId: user.tenantId.toString(),
      storeId: user.storeId?.toString(),
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  async getMe(userId: string, tenantId: string) {
    return await this.usersService.findOne(userId, tenantId);
  }
}

