import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
// import { OlxService } from './modules/olx/olx.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { OlxModule } from './modules/olx/olx.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'olx',
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    }),
    OlxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
