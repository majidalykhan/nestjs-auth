import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/admin-route')
  @UseGuards(AdminGuard)
  adminRoute(@CurrentUser() user: User) {
    if (user) {
      return 'You are allowed';
    }
    return 'Not allowed';
  }

  @Get('/whoami')
  //AuthGuard will check if user signed in or not
  //only signed in user can access this route
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async loginUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  //A downside of this approach
  //admin route should see extra properties for example: {id, email, age, name}
  //where a particular user should see far less like {id, email}
  //noth of these requests will reach to same findOne and get same results
  //* approach: need to supply data based on route
  //* fix: custom interceptor to handle response data, used above controller wide
  @Get('/:id')
  //* Used id as type string because every part of incoming request is a string
  //* Even if it looks like /auth/241524
  findUser(@Param('id') id: string) {
    //* We need to parse id into Int because Nest does not
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
