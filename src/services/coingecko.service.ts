import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CoinGeckoService {
  private readonly BASE_URL = 'https://api.coingecko.com/api/v3';

  async getCoinDetails(
    symbol: string,
  ): Promise<{ price: number | null; image: string | null }> {
    try {
      const response = await axios.get(`${this.BASE_URL}/coins/${symbol}`);

      return {
        price: response.data?.market_data?.current_price?.usd ?? null,
        image: response.data?.image?.thumb ?? null,
      };
    } catch (error) {
      console.error(`⚠️ CoinGecko API error for ${symbol}:`, error);
      return { price: null, image: null };
    }
  }
}
