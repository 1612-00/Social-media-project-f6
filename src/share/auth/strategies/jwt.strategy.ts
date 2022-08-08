import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/api/user/schema/UserSchema';
import { UserService } from 'src/api/user/user.service';
import { JWT_CONFIG } from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.secret,
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userService.getUserById(payload.id);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
