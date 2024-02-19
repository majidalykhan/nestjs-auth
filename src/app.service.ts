import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const db = process.env.DB_NAME;
    console.log({ db });
    return 'Hello World!';
  }
}
