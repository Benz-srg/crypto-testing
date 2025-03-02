import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BinanceService } from '../services/binance.service';
import { CryptocurrencyModule } from './cryptocurrency.module';
import { Cryptocurrency } from '../entities/cryptocurrency.entity';

@Module({
  imports: [
    forwardRef(() => CryptocurrencyModule),
    SequelizeModule.forFeature([Cryptocurrency]),
  ],
  providers: [BinanceService],
  exports: [BinanceService],
})
export class BinanceModule {}
