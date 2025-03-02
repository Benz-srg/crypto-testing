import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cryptocurrency } from '../entities/cryptocurrency.entity';
import { CryptocurrencyService } from '../services/cryptocurrency.service';
import { CryptocurrencyController } from '../controllers/cryptocurrency.controller';
import { CoinGeckoService } from '../services/coingecko.service';
import { CryptoSchedulerService } from '../services/crypto-scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CryptocurrencySeeder } from 'src/seeders/cryptocurrency.seeder';
import { CryptoGatewayModule } from './crypto-gateway.module';
import { BinanceModule } from './binance.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Cryptocurrency]),
    ScheduleModule.forRoot(),
    forwardRef(() => CryptoGatewayModule),
    BinanceModule,
  ],
  controllers: [CryptocurrencyController],
  providers: [
    CryptocurrencyService,
    CoinGeckoService,
    CryptoSchedulerService,
    CryptocurrencySeeder,
  ],
  exports: [CryptocurrencyService],
})
export class CryptocurrencyModule {}
