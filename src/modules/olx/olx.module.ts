import { Module } from '@nestjs/common';
import { OlxService } from './olx.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Olx } from './olx.entity';
import { OlxController } from './olx.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Olx])],
  providers: [OlxService],
  controllers: [OlxController],
})
export class OlxModule {}
