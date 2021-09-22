import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { OlxModule } from './modules/olx/olx.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'mongodb',
          url: config.get('mongo.uri'),
          entities: [join(__dirname, '**/**.entity{.ts,.js}')],
          useNewUrlParser: true,
          logging: true,
        };
      },
    }),
    OlxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
