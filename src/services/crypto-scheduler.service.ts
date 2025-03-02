import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CryptoGateway } from '../gateways/crypto.gateway';

@Injectable()
export class CryptoSchedulerService {
  private readonly logger = new Logger(CryptoSchedulerService.name);
  private trackedAssets = ['bitcoin', 'ethereum', 'binancecoin'];

  constructor(private readonly cryptoGateway: CryptoGateway) {}

  @Cron('0 */5 * * * *')
  async updateCryptoPrices() {
    this.logger.log('Fetching latest coin prices...');
    for (const asset of this.trackedAssets) {
      await this.cryptoGateway.sendCoinUpdates(asset);
    }
  }
}
