import { Module, forwardRef } from '@nestjs/common';
import { CryptoGateway } from '../gateways/crypto.gateway';
import { CryptocurrencyModule } from './cryptocurrency.module';
import { CoinGeckoService } from '../services/coingecko.service';

@Module({
  imports: [forwardRef(() => CryptocurrencyModule)],
  providers: [CryptoGateway, CoinGeckoService],
  exports: [CryptoGateway],
})
export class CryptoGatewayModule {}
