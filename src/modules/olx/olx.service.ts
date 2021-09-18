import puppeteer from 'puppeteer';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Repository } from 'typeorm';
import { Olx } from './olx.entity';

@Injectable()
export class OlxService {
  constructor(
    @InjectRepository(Olx)
    private readonly olxRepository: Repository<Olx>,
  ) {}
  private readonly logger = new Logger(OlxService.name);

  @Cron(CronExpression.EVERY_MINUTE)
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
              id,
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

      // const pageNumber = Number(url.match(/page=(\d+)/)[1]);

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

    // await this.olxRepository.bulkWrite(operations, { ordered: false });

    await this.olxRepository.query(
      `INSERT IGNORE INTO olx (id, title, price, imgUrl, location, adCreatedAt, createdAt) ?`,
      [ads],
    );
    console.log(ads);
    await browser.close();
  }
}