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
import { Inject, Injectable, forwardRef } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: true })
export class CryptoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => CryptocurrencyService))
    private readonly cryptoService: CryptocurrencyService,
    private readonly coingeckoService: CoinGeckoService,
  ) {}

  async handleConnection() {
    await this.sendAllCryptos();
  }

  async sendAllCryptos() {
    const cryptos = await this.cryptoService.findAll();
    const enrichedCryptos = cryptos.map((crypto) => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      price: Number(crypto.price),
      image: null,
      updatedAt: crypto.updatedAt,
    }));

    this.server.emit('cryptoList', enrichedCryptos);
    this.updateCryptoPrices();
  }

  async sendCoinUpdates(cryptoSymbol: string) {
    if (!cryptoSymbol) return;

    const crypto = await this.cryptoService.findBySymbol(cryptoSymbol);
    if (!crypto) return;

    let updatedCrypto = {
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      price: Number(crypto.price),
      image: null,
      updatedAt: crypto.updatedAt,
    };

    this.server.emit('coinUpdate', updatedCrypto);
    this.updateSingleCrypto(crypto);
  }

  async updateCryptoPrices() {
    const cryptos = await this.cryptoService.findAll();
    cryptos.forEach((crypto) => this.updateSingleCrypto(crypto));
  }

  async updateSingleCrypto(crypto) {
    try {
      const coingeckoData = await this.coingeckoService.getCoinDetails(
        formatCryptoName(crypto.name),
      );

      if (coingeckoData.price !== null) {
        const updatedCrypto = {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          price: Number(coingeckoData.price),
          image: coingeckoData.image ?? null,
          updatedAt: crypto.updatedAt,
        };

        this.server.emit('coinUpdate', updatedCrypto);
      }
    } catch (error) {
      if (error.response?.status !== 429) {
        console.error(
          `⚠️ Failed to fetch CoinGecko data for ${crypto.symbol}:`,
          error.message,
        );
      }
    }
  }

  handleDisconnect() {
    console.log('❌ WebSocket Disconnected');
  }
}
