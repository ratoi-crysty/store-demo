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
import { UserModel } from '../../user/model/user.model';
import { RegisterDetailsDto } from '../dto/register-details.dto';
import { UserEntity, UserEntityRole } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { AdminGuard } from '../guards/admin.guard';
import { PatchRoleDto } from '../dto/patch-role.dto';
import { PatchPasswordDto } from '../dto/patch-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AppRequest } from '../types/app-request';
import { getSessionUser } from '../utils/session.utils';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {

  constructor(protected authService: AuthService, protected userService: UserService) {
  }

  @Get()
  index(@Req() req: AppRequest): UserModel {
    return getSessionUser(req);
  }

  @JwtAuthGuard.Disable()
  @Post('login')
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

  @JwtAuthGuard.Disable()
  @Post('register')
  async register(@Body() details: RegisterDetailsDto): Promise<{ token: string }> {
    let user: UserEntity | undefined = await this.userService.repo.findOne({ email: details.email });

    if (user) {
      throw new BadRequestException('Email already exists!');
    }

    const adminsCount: number = await this.userService.countByRole(UserEntityRole.Admin);

    user = await this.authService.register(
      details.email,
      details.name,
      details.password,
      adminsCount ? UserEntityRole.User : UserEntityRole.Admin,
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
    @Body() { password }: PatchPasswordDto,
  ): Promise<void> {
    const user: UserEntity = getSessionUser(req);

    if (!(await this.authService.validateUser(user, password))) {
      throw new UnauthorizedException();
    }

    await this.authService.updatePassword(+id, password);
  }

  @Delete(':id')
  async deleteUser(@Req() req: AppRequest, @Param('id') id: string): Promise<void> {
    const user: UserEntity = getSessionUser(req);

    if (user.id !== +id && user.role !== UserEntityRole.Admin) {
      throw new ForbiddenException();
    }

    await this.userService.repo.delete({ id: +id });
  }
}
