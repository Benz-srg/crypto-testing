import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CryptocurrencyService } from '../services/cryptocurrency.service';
import { CoinGeckoService } from '../services/coingecko.service';
import { formatCryptoName } from 'src/format/utils';

@WebSocketGateway({ cors: true })
export class CryptoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly cryptoService: CryptocurrencyService,
    private readonly coingeckoService: CoinGeckoService,
  ) {}

  async handleConnection() {
    const cryptos = await this.cryptoService.findAll();
    const enrichedCryptos = await Promise.all(
      cryptos.map(async (crypto) => {
        if (!crypto.symbol) {
          return {
            id: crypto.id,
            name: crypto.name ?? 'Unknown',
            symbol: crypto.symbol ?? 'Unknown',
            price: Number(crypto.price) ?? 0,
            image: null,
          };
        }

        try {
          const coingeckoData = await this.coingeckoService.getCoinDetails(
            formatCryptoName(crypto.name),
          );
          return {
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            price: coingeckoData.price
              ? Number(coingeckoData.price)
              : Number(crypto.price),
            image: coingeckoData.image ?? null,
          };
        } catch (error) {
          return {
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            price: Number(crypto.price) ?? 0,
            image: null,
          };
        }
      }),
    );

    this.server.emit('cryptoList', enrichedCryptos);
  }

  async sendCoinUpdates(cryptoSymbol: string) {
    try {
      const crypto = await this.cryptoService.findBySymbol(cryptoSymbol);
      if (!crypto) return;

      const coingeckoData = await this.coingeckoService.getCoinDetails(
        formatCryptoName(crypto.name),
      );

      const updatedCrypto = {
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price: coingeckoData.price ?? crypto.price,
        image: coingeckoData.image ?? null,
      };

      this.server.emit('coinUpdate', updatedCrypto);
    } catch (error) {
      console.error(`⚠️ Failed to fetch update for ${cryptoSymbol}`, error);
    }
  }

  handleDisconnect() {
    console.log('❌ WebSocket Disconnected');
  }
}
