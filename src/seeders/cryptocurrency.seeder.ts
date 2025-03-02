import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cryptocurrency } from '../entities/cryptocurrency.entity';

@Injectable()
export class CryptocurrencySeeder implements OnModuleInit {
  private readonly logger = new Logger(CryptocurrencySeeder.name);

  constructor(
    @InjectModel(Cryptocurrency)
    private readonly cryptocurrencyModel: typeof Cryptocurrency,
  ) {}

  async onModuleInit() {
    this.logger.log('Seeder: Starting database seed...');
    await this.seed();
  }

  async seed() {
    const existingData = await this.cryptocurrencyModel.count();
    if (existingData === 0) {
      this.logger.log('Seeder: Inserting initial cryptocurrency data...');
      await this.cryptocurrencyModel.bulkCreate([
        { name: 'Bitcoin', symbol: 'BTC', price: 60000.0 },
        { name: 'Ethereum', symbol: 'ETH', price: 3000.0 },
        { name: 'Binance Coin', symbol: 'BNB', price: 400.0 },
      ]);
      this.logger.log('Seeder: Data inserted successfully.');
    } else {
      this.logger.log('Seeder: Data already exists, skipping seed.');
    }
  }
}
