import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer from 'puppeteer';
console.log(puppeteer);

@Injectable()
export class OlxTaskService {
  private readonly logger = new Logger(OlxTaskService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
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
              createdAt,
            },
          ];
        });
      });
      await page.close();

      const pageNumber = Number(url.match(/page=(\d+)/)[1]);

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

    console.log(ads);
    await browser.close();
  }
}
