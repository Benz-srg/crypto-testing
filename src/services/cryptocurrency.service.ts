import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cryptocurrency } from '../entities/cryptocurrency.entity';
import { CreateCryptocurrencyDto } from '../dto/create-cryptocurrency.dto';
import { UpdateCryptocurrencyDto } from '../dto/update-cryptocurrency.dto';
import { UUID } from 'crypto';
import { CoinGeckoService } from '../services/coingecko.service';

@Injectable()
export class CryptocurrencyService {
  constructor(
    @InjectModel(Cryptocurrency)
    private readonly cryptocurrencyModel: typeof Cryptocurrency,
    private readonly coinGeckoService: CoinGeckoService,
  ) {}

  async findAll(): Promise<any[]> {
    try {
      const cryptos = await this.cryptocurrencyModel.findAll();

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
              price: crypto.price,
              currentPrice: coingeckoData.price,
              image: coingeckoData.image,
              created_at: crypto.created_at,
            };
          } catch (error) {
            return {
              id: crypto.id,
              name: crypto.name,
              symbol: crypto.symbol,
              price: crypto.price,
              currentPrice: null,
              image: null,
              created_at: crypto.created_at,
            };
          }
        }),
      );

      return enrichedCryptos;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch cryptocurrency data',
      );
    }
  }

  async findOne(id: UUID): Promise<Cryptocurrency> {
    const crypto = await this.cryptocurrencyModel.findByPk(id);
    if (!crypto) {
      throw new NotFoundException(`Cryptocurrency with id ${id} not found`);
    }
    return crypto;
  }

  async create(dto: CreateCryptocurrencyDto): Promise<Cryptocurrency> {
    return this.cryptocurrencyModel.create({ ...dto } as Omit<
      Cryptocurrency,
      'id'
    >);
  }

  async update(
    id: UUID,
    dto: UpdateCryptocurrencyDto,
  ): Promise<Cryptocurrency> {
    const crypto = await this.findOne(id);
    await crypto.update(dto);
    return crypto;
  }

  async remove(id: UUID): Promise<void> {
    const crypto = await this.findOne(id);
    await crypto.destroy();
  }
}
