import { Module, forwardRef } from '@nestjs/common';
import { CryptocurrencyModule } from './cryptocurrency.module';
import { BinanceModule } from './binance.module';
import { CryptoSchedulerService } from '../services/crypto-scheduler.service';

@Module({
  imports: [forwardRef(() => CryptocurrencyModule), BinanceModule],
  providers: [CryptoSchedulerService],
  exports: [CryptoSchedulerService],
})
export class CryptoSchedulerModule {}
