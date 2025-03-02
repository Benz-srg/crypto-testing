import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cryptocurrency } from '../entities/cryptocurrency.entity';
import { CryptocurrencyService } from '../services/cryptocurrency.service';
import { CryptocurrencyController } from '../controllers/cryptocurrency.controller';
import { CoinGeckoService } from '../services/coingecko.service';
import { CryptoGateway } from '../gateways/crypto.gateway';
import { CryptoSchedulerService } from '../services/crypto-scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CryptocurrencySeeder } from 'src/seeders/cryptocurrency.seeder';

@Module({
  imports: [
    SequelizeModule.forFeature([Cryptocurrency]),
    ScheduleModule.forRoot(),
  ],
  controllers: [CryptocurrencyController],
  providers: [
    CryptocurrencyService,
    CoinGeckoService,
    CryptoGateway,
    CryptoSchedulerService,
    CryptocurrencySeeder,
  ],
  exports: [CryptocurrencyService],
})
export class CryptocurrencyModule {}
