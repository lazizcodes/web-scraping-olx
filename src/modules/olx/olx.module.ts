import { Module } from '@nestjs/common';
import { OlxService } from './olx.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Olx } from './olx.entity';
import { OlxController } from './olx.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Olx]), ConfigService],
  providers: [OlxService],
  controllers: [OlxController],
})
export class OlxModule {}
