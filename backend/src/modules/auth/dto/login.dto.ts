import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsMongoId, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  password: string;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    required: false,
    description: 'Optional tenant ID. If not provided, will use the user\'s tenant.'
  })
  @IsOptional()
  @IsMongoId()
  tenantId?: string;
}


