import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from './dto/pagination-query.dto';
import { Olx } from './olx.entity';
import { OlxService } from './olx.service';

@ApiTags('olx')
@Controller('olx')
export class OlxController {
  constructor(private readonly olxService: OlxService) {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get single ad by id',
    type: Olx,
  })
  getById(@Param('id') id: string): Promise<Olx | HttpException> {
    return this.olxService.getAd(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get many ads',
    type: Olx,
    isArray: true,
  })
  getAllAds(@Query() query: PaginationQuery) {
    const { page, pageSize } = query;
    return this.olxService.getAllAds(Number(page), Number(pageSize));
  }
}
