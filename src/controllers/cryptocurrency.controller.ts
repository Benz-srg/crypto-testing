import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CryptocurrencyService } from '../services/cryptocurrency.service';
import { CoinGeckoService } from '../services/coingecko.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateCryptocurrencyDto } from '../dto/create-cryptocurrency.dto';
import { UpdateCryptocurrencyDto } from '../dto/update-cryptocurrency.dto';
import { UUID } from 'crypto';
import { CryptocurrencyResponseDto } from 'src/dto/cryptocurrency-response.dto';

@ApiTags('Cryptocurrencies')
@Controller('cryptocurrencies')
export class CryptocurrencyController {
  constructor(
    private readonly cryptocurrencyService: CryptocurrencyService,
    private readonly coinGeckoService: CoinGeckoService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all cryptocurrencies with live prices and images',
  })
  @ApiResponse({
    status: 200,
    description: 'List of cryptocurrencies with database & live prices',
    type: [CryptocurrencyResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllCryptocurrencies() {
    return this.cryptocurrencyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single cryptocurrency by ID' })
  @ApiParam({
    name: 'id',
    example: '745b28d8-3cd0-487d-b101-7242f2033a20',
    description: 'UUID of the cryptocurrency',
  })
  @ApiResponse({
    status: 200,
    description: 'Cryptocurrency details',
    type: CryptocurrencyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cryptocurrency not found' })
  async findOne(@Param('id') id: UUID) {
    return this.cryptocurrencyService.findOne(id);
  }

  @Get(':asset/details')
  @ApiOperation({
    summary: 'Get live details of a cryptocurrency from CoinGecko',
  })
  @ApiParam({
    name: 'asset',
    example: 'bitcoin',
    description: 'Asset name as used in CoinGecko API',
  })
  @ApiResponse({
    status: 200,
    description: 'Live details of cryptocurrency from CoinGecko',
    schema: {
      example: {
        fullName: 'Bitcoin',
        asset: 'BTC',
        price: 60500.25,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Asset not found on CoinGecko' })
  async getCoinDetails(@Param('asset') asset: string) {
    return this.coinGeckoService.getCoinDetails(asset);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new cryptocurrency record' })
  @ApiBody({
    type: CreateCryptocurrencyDto,
    description: 'Data for creating a cryptocurrency',
  })
  @ApiResponse({
    status: 201,
    description: 'Cryptocurrency created successfully',
    type: CryptocurrencyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createDto: CreateCryptocurrencyDto) {
    return this.cryptocurrencyService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing cryptocurrency' })
  @ApiParam({
    name: 'id',
    example: '745b28d8-3cd0-487d-b101-7242f2033a20',
    description: 'UUID of the cryptocurrency',
  })
  @ApiBody({
    type: UpdateCryptocurrencyDto,
    description: 'Data for updating the cryptocurrency',
  })
  @ApiResponse({
    status: 200,
    description: 'Cryptocurrency updated successfully',
    type: CryptocurrencyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cryptocurrency not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async update(
    @Param('id') id: UUID,
    @Body() updateDto: UpdateCryptocurrencyDto,
  ) {
    return this.cryptocurrencyService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cryptocurrency by ID' })
  @ApiParam({
    name: 'id',
    example: '745b28d8-3cd0-487d-b101-7242f2033a20',
    description: 'UUID of the cryptocurrency',
  })
  @ApiResponse({
    status: 200,
    description: 'Cryptocurrency deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Cryptocurrency not found' })
  async remove(@Param('id') id: UUID) {
    return this.cryptocurrencyService.remove(id);
  }
}
