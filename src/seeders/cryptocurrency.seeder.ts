import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cryptocurrency } from '../entities/cryptocurrency.entity';

@Injectable()
export class CryptocurrencySeeder {
  constructor(
    @InjectModel(Cryptocurrency)
    private readonly cryptocurrencyModel: typeof Cryptocurrency,
  ) {}

  async seed() {
    console.log('🌱 Seeding cryptocurrency data...');

    const cryptoData: { name: string; symbol: string; price: number }[] = [
      { name: 'Bitcoin', symbol: 'BTC', price: 60000.0 },
      { name: 'Ethereum', symbol: 'ETH', price: 3000.0 },
      { name: 'Binance Coin', symbol: 'BNB', price: 400.0 },
    ];

    for (const data of cryptoData) {
      await this.cryptocurrencyModel.create({ ...data } as Omit<
        Cryptocurrency,
        'id'
      >);
    }

    console.log('✅ Seeding completed.');
  }
}
