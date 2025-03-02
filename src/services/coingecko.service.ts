import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CoinGeckoService {
  private readonly BASE_URL = 'https://api.coingecko.com/api/v3';

  async getCoinDetails(coinId: string): Promise<any> {
    try {
      const url = `${this.BASE_URL}/coins/${coinId}`;
      const response = await axios.get(url);
      return {
        price: response.data.market_data?.current_price?.usd || null,
        image: response.data.image?.thumb || null,
      };
    } catch (error) {
      console.error(`⚠️ CoinGecko API error for ${coinId}:`, error.message);
      return { price: null, image: null };
    }
  }
}
