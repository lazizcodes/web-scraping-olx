import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';
import { Olx } from './olx.entity';
import { OlxService } from './olx.service';

@Controller('olx')
export class OlxController {
  constructor(private readonly olxService: OlxService) {}

  @Get(':id')
  getById(@Param('id') id: string): Promise<Olx | HttpException> {
    return this.olxService.getAd(id);
  }

  @Get()
  getAllAds(@Query() query) {
    const { page, pageSize } = query;
    return this.olxService.getAllAds(Number(page), Number(pageSize));
  }
}
