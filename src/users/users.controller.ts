import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

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

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  //A downside of this approach
  //admin route should see extra properties for example: {id, email, age, name}
  //where a particular user should see far less like {id, email}
  //noth of these requests will reach to same findOne and get same results
  //* approach: need to supply data based on route
  //* fix: custom interceptor to handle response data
  @Get('/:id')
  //* Used id as type string because every part of incoming request is a string
  //* Even if it looks like /auth/241524
  findUser(@Param('id') id: string) {
    //* We need to parse id into Int because Nest does not
    return this.usersService.findOne(parseInt(id));
  }

  @Post('/signin')
  loginUser(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
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
