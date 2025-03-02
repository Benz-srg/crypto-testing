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

  async findAll(): Promise<Cryptocurrency[]> {
    const cryptos = await this.cryptocurrencyModel.findAll({ raw: true });

    return cryptos;
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

  async findBySymbol(symbol: string): Promise<Cryptocurrency | null> {
    return this.cryptocurrencyModel.findOne({ where: { symbol } });
  }
}
