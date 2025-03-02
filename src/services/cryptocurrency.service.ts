import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cryptocurrency } from '../entities/cryptocurrency.entity';
import { CreateCryptocurrencyDto } from '../dto/create-cryptocurrency.dto';
import { UpdateCryptocurrencyDto } from '../dto/update-cryptocurrency.dto';
import { UUID } from 'crypto';
import { CryptoGateway } from 'src/gateways/crypto.gateway';

@Injectable()
export class CryptocurrencyService {
  constructor(
    @InjectModel(Cryptocurrency)
    private readonly cryptocurrencyModel: typeof Cryptocurrency,

    @Inject(forwardRef(() => CryptoGateway))
    private readonly cryptoGateway: CryptoGateway,
  ) {}

  async findAll(): Promise<Cryptocurrency[]> {
    const cryptos = await this.cryptocurrencyModel.findAll();

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
    const crypto = await this.cryptocurrencyModel.create({ ...dto } as Omit<
      Cryptocurrency,
      'id'
    >);

    const symbol = crypto.getDataValue('symbol');
    if (!symbol) {
      return crypto;
    }

    this.cryptoGateway.sendCoinUpdates(symbol);

    return crypto;
  }

  async update(
    id: UUID,
    dto: UpdateCryptocurrencyDto,
  ): Promise<Cryptocurrency> {
    const crypto = await this.findOne(id);
    await crypto.update(dto);

    this.cryptoGateway.sendCoinUpdates(crypto.symbol);

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
