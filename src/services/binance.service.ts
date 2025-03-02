import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Cryptocurrency } from '../entities/cryptocurrency.entity';
import axios from 'axios';
import { BinanceMarketData } from 'src/types/binance';

@Injectable()
export class BinanceService {
  private readonly BINANCE_API_URL =
    'https://api.binance.com/api/v3/ticker/price';
  private readonly logger = new Logger(BinanceService.name);

  constructor(
    @InjectModel(Cryptocurrency)
    private readonly cryptocurrencyModel: typeof Cryptocurrency,
  ) {}

  async updateCryptoPrices(): Promise<void> {
    this.logger.log('Fetching latest Binance prices...');
    try {
      const response = await axios.get<BinanceMarketData[]>(
        this.BINANCE_API_URL,
      );
      if (!response.data || response.data.length === 0) {
        throw new InternalServerErrorException(
          'No cryptocurrencies found on Binance.',
        );
      }

      const filteredCoins = response.data.filter((coin) =>
        coin.symbol.endsWith('USDT'),
      );

      for (const coin of filteredCoins) {
        const price = parseFloat(coin.price);
        const [affectedRows] = await this.cryptocurrencyModel.update(
          { price },
          { where: { symbol: coin.symbol } },
        );
        if (affectedRows > 0) {
          this.logger.log(`Updated ${coin.symbol} price to $${price}`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to update prices from Binance', error);
      throw new InternalServerErrorException(
        'Failed to update cryptocurrency prices from Binance.',
      );
    }
  }

  @Cron('0 */5 * * * *')
  async updatePricesCron() {
    this.logger.log('Running Binance prices update cron job...');
    await this.updateCryptoPrices();
  }
}
