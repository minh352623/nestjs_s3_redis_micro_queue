import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';

@Controller('user')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard())
  @UseGuards(AuthGuard('jwt-two-factor'))
  @Get('profile')
  async getProfile(@Req() req: any) {
    return req.user;
  }

  @Post('refresh')
  async refresh(@Body() body) {
    return await this.authService.refresh(body.refresh_token);
  }

  @UseGuards(AuthGuard())
  @Post('logout')
  async logout(@Req() req: any) {
    await this.authService.logout(req.user);
    return {
      statusCode: 200,
    };
  }
}
