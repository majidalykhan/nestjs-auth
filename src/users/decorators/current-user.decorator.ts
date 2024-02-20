import { ExecutionContext, createParamDecorator } from '@nestjs/common';

//* Decorator do not work with dependency injection so it cannot use usersService directly
//* fix: we have to make an interceptor that will use usersService to fetch user for us
//* then we can communicate between interceptor and decorator using request

export const CurrentUser = createParamDecorator(
  //whatever we provide as argument for example CurrentUser('asdf') in controller
  //will show in data below
  //but we do not need to pass anything in our decorator
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
