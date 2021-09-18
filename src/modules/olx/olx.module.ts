import { Module } from '@nestjs/common';
import { OlxService } from './olx.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Olx } from './olx.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Olx])],
  providers: [OlxService],
})
export class OlxModule {}
