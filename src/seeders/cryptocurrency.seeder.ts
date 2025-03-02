import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cryptocurrency } from '../entities/cryptocurrency.entity';

@Injectable()
export class CryptocurrencySeeder implements OnModuleInit {
  constructor(
    @InjectModel(Cryptocurrency)
    private readonly cryptocurrencyModel: typeof Cryptocurrency,
  ) {}

  async onModuleInit() {
    console.log('🌱 Running Cryptocurrency Seeder...');
    await this.seed();
  }

  async seed() {
    const count = await this.cryptocurrencyModel.count();
    if (count > 0) {
      console.log('✅ Cryptocurrencies already seeded, skipping...');
      return;
    }

    console.log('🌱 Seeding cryptocurrency data...');
    const cryptoData = [
      { name: 'Bitcoin', symbol: 'BTC', price: 60000.0 },
      { name: 'Ethereum', symbol: 'ETH', price: 3000.0 },
      { name: 'Binance Coin', symbol: 'BNB', price: 400.0 },
    ];

    await this.cryptocurrencyModel.bulkCreate(cryptoData);
    console.log('✅ Seeding completed.');
  }
}
