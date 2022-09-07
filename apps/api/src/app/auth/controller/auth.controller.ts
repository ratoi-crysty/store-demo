import {
  BadRequestException,
  Body,
  Controller,
  Delete, ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginCredentialsDto } from '../dto/login-credentials.dto';
import { RegisterDetailsDto } from '../dto/register-details.dto';
import { UserEntity } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { AdminGuard } from '../guards/admin.guard';
import { PatchRoleDto } from '../dto/patch-role.dto';
import { PatchPasswordDto } from '../dto/patch-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AppRequest } from '../types/app-request';
import { getSessionUser } from '../utils/session.utils';
import { UserModel, UserRole } from '@store-demo/api-interfaces';
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";

class TokenResponse {
  @ApiProperty({ readOnly: true })
  token!: string;
}

@ApiTags('Auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {

  constructor(protected authService: AuthService, protected userService: UserService) {
  }

  @Get()
  @ApiResponse({
    type: () => UserEntity,
  })
  index(@Req() req: AppRequest): UserModel {
    return getSessionUser(req);
  }

  @Post('login')
  @ApiResponse({ type: () => TokenResponse })
  @JwtAuthGuard.disable()
  async login(@Body() credentials: LoginCredentialsDto): Promise<{ token: string }> {
    const user: UserEntity | undefined = await this.userService.repo.findOne({ email: credentials.email });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await this.authService.validateUser(user, credentials.password))) {
      throw new UnauthorizedException();
    }

    return {
      token: this.authService.signIn(user),
    };
  }

  @Post('register')
  @ApiResponse({ type: () => TokenResponse })
  @JwtAuthGuard.disable()
  async register(@Body() details: RegisterDetailsDto): Promise<{ token: string }> {
    let user: UserEntity | undefined = await this.userService.repo.findOne({ email: details.email });

    if (user) {
      throw new BadRequestException('Email already exists!');
    }

    const adminsCount: number = await this.userService.countByRole(UserRole.Admin);

    user = await this.authService.register(
      details.email,
      details.name,
      details.password,
      adminsCount ? UserRole.User : UserRole.Admin,
    );

    return {
      token: this.authService.signIn(user),
    };
  }


  @Patch('role/:id')
  @UseGuards(AdminGuard)
  async patchUserRole(@Param('id') id: string, @Body() { role }: PatchRoleDto): Promise<void> {
    await this.userService.repo.update({ id: +id }, { role });
  }

  @Patch('password/:id')
  @UseGuards(AdminGuard)
  async patchUserPassword(
    @Req() req: AppRequest,
    @Param('id') id: string,
    @Body() { currentPassword, newPassword }: PatchPasswordDto,
  ): Promise<void> {
    const user: UserEntity = getSessionUser(req);

    if (!(await this.authService.validateUser(user, currentPassword))) {
      throw new UnauthorizedException();
    }

    await this.authService.updatePassword(+id, newPassword);
  }

  @Delete(':id')
  async deleteUser(@Req() req: AppRequest, @Param('id') id: string): Promise<void> {
    const user: UserEntity = getSessionUser(req);

    if (user.id !== +id && user.role !== UserRole.Admin) {
      throw new ForbiddenException();
    }

    await this.userService.repo.delete({ id: +id });
  }
}
