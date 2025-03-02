import { ApiProperty } from '@nestjs/swagger';

export class CoinDetailsDto {
  @ApiProperty({ example: 'Bitcoin', description: 'Full name of the coin' })
  fullName: string;

  @ApiProperty({ example: 'BTC', description: 'Asset symbol' })
  asset: string;

  @ApiProperty({ example: 60500.25, description: 'Price in USDT' })
  price: number;

  @ApiProperty({
    example: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    description: 'Image URL of the coin',
  })
  image: string;
}
