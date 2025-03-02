import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Cryptocurrency } from '../entities/cryptocurrency.entity';
import axios from 'axios';

@Injectable()
export class CryptoSchedulerService {
  private readonly logger = new Logger(CryptoSchedulerService.name);

  constructor(
    @InjectModel(Cryptocurrency)
    private readonly cryptocurrencyModel: typeof Cryptocurrency,
  ) {}

  @Cron('*/20 * * * * *')
  async updateCryptoPrices() {
    this.logger.log('Fetching latest crypto prices...');

    try {
      const allCryptos = await this.cryptocurrencyModel.findAll({ raw: true });

      if (allCryptos.length === 0) {
        this.logger.warn('No cryptocurrencies found in the database.');
        return;
      }

      const symbols = allCryptos.map((crypto) => crypto.symbol.toLowerCase());

      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: symbols.join(','),
            vs_currencies: 'usd',
          },
        },
      );

      for (const crypto of allCryptos) {
        const price = response.data[crypto.symbol.toLowerCase()]?.usd;
        if (price) {
          await this.cryptocurrencyModel.update(
            { price },
            { where: { symbol: crypto.symbol } },
          );
          this.logger.log(`Updated ${crypto.symbol} price: $${price}`);
        } else {
          this.logger.warn(`No price data found for ${crypto.symbol}`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to fetch crypto prices', error);
    }
  }
}
