import puppeteer from 'puppeteer';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Olx } from './olx.entity';
import { resourceUsage } from 'process';

@Injectable()
export class OlxService {
  constructor(
    @InjectRepository(Olx)
    private readonly olxRepository: MongoRepository<Olx>,
  ) {}
  private readonly logger = new Logger(OlxService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.log('OLX Cron started...');
    const extractData = async (url) => {
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.goto(url);

      const ads = await page.evaluate(() => {
        const tr = document.querySelectorAll('.wrap');

        return Array.from(tr)?.map((element) => {
          const tbody = element
            .querySelector('.offer-wrapper')
            ?.querySelector('tbody');

          const href = tbody.querySelector('a').href.split('/');
          const id = href[href.length - 1].slice(
            0,
            href[href.length - 1].indexOf('.'),
          );

          const imgUrl = tbody?.querySelector('img')?.src;
          const [title, price] = Array.from(
            tbody.querySelectorAll('strong'),
          )?.map(({ textContent }) => textContent);

          const arr = Array.from(element.querySelectorAll('i') as any);
          const [location, createdAt] = arr
            ?.slice(arr.length - 2)
            .map(({ nextSibling: { data } }) => data);

          return [
            {
              _id: id,
              title,
              price,
              imgUrl,
              location,
              adCreatedAt: createdAt,
              createdAt: Date.now(),
            },
          ];
        });
      });
      await page.close();

      const pageNumber = Number(new URL(url).searchParams.get('page'));
      if (pageNumber < 25) {
        const nextUrl = `https://www.olx.ua/list/?page=${pageNumber + 1}`;
        return ads.concat(await extractData(nextUrl)).flat();
      } else {
        return ads;
      }
    };

    const browser = await puppeteer.launch();

    const firstUrl = 'https://www.olx.ua/list/?page=1';

    const ads = await extractData(firstUrl);
    const operations = ads.map((ad) => ({ insertOne: { document: ad } }));
    try {
      await this.olxRepository.bulkWrite(operations, { ordered: false });
    } catch (error) {}

    // console.log(ads);
    await browser.close();
  }

  async getAd(id: string) {
    const ad = await this.olxRepository.findOne({ _id: id });
    return ad || new NotFoundException('Could not find ad.');
  }

  async getAllAds(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const ads = await this.olxRepository.find({ skip, take });
    return ads;
  }
}
