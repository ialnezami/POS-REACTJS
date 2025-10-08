import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      tenantId: createUserDto.tenantId,
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists in this tenant');
    }

    const user = new this.userModel(createUserDto);
    return await user.save();
  }

  async findAll(tenantId: string): Promise<User[]> {
    return await this.userModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .select('-password -refreshTokens')
      .exec();
  }

  async findOne(id: string, tenantId: string): Promise<User> {
    const user = await this.userModel
      .findOne({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .select('-password -refreshTokens')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string, tenantId: string): Promise<User | null> {
    return await this.userModel.findOne({
      email,
      tenantId: new Types.ObjectId(tenantId),
    });
  }

  async update(id: string, tenantId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          tenantId: new Types.ObjectId(tenantId),
        },
        { $set: updateUserDto },
        { new: true },
      )
      .select('-password -refreshTokens')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const result = await this.userModel
      .deleteOne({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.updateOne({ _id: new Types.ObjectId(id) }, { lastLogin: new Date() });
  }

  async addRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(userId) },
      { $push: { refreshTokens: refreshToken } },
    );
  }

  async removeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(userId) },
      { $pull: { refreshTokens: refreshToken } },
    );
  }

  async clearRefreshTokens(userId: string): Promise<void> {
    await this.userModel.updateOne({ _id: new Types.ObjectId(userId) }, { refreshTokens: [] });
  }
}


