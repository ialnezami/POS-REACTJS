import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { UserRole } from '@modules/users/schemas/user.schema';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'My Business Name' })
  @IsString()
  businessName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.TENANT_ADMIN, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', required: false })
  @IsOptional()
  @IsMongoId()
  storeId?: string;
}


