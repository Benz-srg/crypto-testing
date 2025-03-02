import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { CoinDetailsDto } from '../dto/coin-details.dto';

@Injectable()
export class CoinGeckoService {
  private readonly BASE_URL = 'https://api.coingecko.com/api/v3';

  async getCoinDetails(asset: string): Promise<CoinDetailsDto> {
    try {
      const response = await axios.get(`${this.BASE_URL}/coins/${asset}`);
      const data = response.data;

      return {
        fullName: data.name,
        asset: data.symbol.toUpperCase(),
        price: data.market_data.current_price.usd,
        image: data.image.large,
      };
    } catch (error) {
      throw new HttpException('Coin not found', HttpStatus.NOT_FOUND);
    }
  }
}
