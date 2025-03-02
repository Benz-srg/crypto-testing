import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { CryptocurrencyService } from '../services/cryptocurrency.service';
import { CoinGeckoService } from '../services/coingecko.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class CryptoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(CryptoGateway.name);

  constructor(
    private readonly cryptocurrencyService: CryptocurrencyService,
    private readonly coinGeckoService: CoinGeckoService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.sendCryptoList();
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async sendCryptoList() {
    this.logger.log('Fetching cryptocurrency list from database...');
    const cryptos = await this.cryptocurrencyService.findAll();

    const enrichedCryptos = await Promise.all(
      cryptos.map(async (crypto) => {
        try {
          const coingeckoData = await this.coinGeckoService.getCoinDetails(
            crypto.symbol.toLowerCase(),
          );
          return {
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            price: coingeckoData.price,
            image: coingeckoData.image,
            created_at: crypto.created_at,
          };
        } catch (error) {
          this.logger.error(`Failed to fetch data for ${crypto.symbol}`);
          return {
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            price: crypto.price,
            image: null,
            created_at: crypto.created_at,
          };
        }
      }),
    );

    this.server.emit('cryptoList', enrichedCryptos);
  }

  async sendCoinUpdates(asset: string) {
    try {
      this.logger.log(`Fetching update for ${asset}...`);
      const coingeckoData = await this.coinGeckoService.getCoinDetails(asset);

      const updatedCrypto = {
        asset: coingeckoData.asset,
        price: coingeckoData.price,
        image: coingeckoData.image,
        fullName: coingeckoData.fullName,
      };

      this.server.emit('coinUpdate', updatedCrypto);
      this.logger.log(`Sent update for ${asset}: $${updatedCrypto.price}`);
    } catch (error) {
      this.logger.error(
        `Failed to fetch update for ${asset}: ${error.message}`,
      );
    }
  }
}
