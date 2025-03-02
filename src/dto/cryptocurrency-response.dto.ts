import { ApiProperty } from '@nestjs/swagger';

export class CryptocurrencyResponseDto {
  @ApiProperty({
    example: '745b28d8-3cd0-487d-b101-7242f2033a20',
    description: 'Unique ID of the cryptocurrency',
  })
  id: string;

  @ApiProperty({
    example: 'Bitcoin',
    description: 'Full name of the cryptocurrency',
  })
  name: string;

  @ApiProperty({ example: 'BTC', description: 'Ticker symbol' })
  symbol: string;

  @ApiProperty({
    example: 60000.0,
    description: 'Price stored in the database',
  })
  price: number;

  @ApiProperty({
    example: '2025-03-02T09:24:55.078Z',
    description: 'Timestamp when the cryptocurrency was added',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-03-02T09:24:55.078Z',
    description: 'Timestamp when the cryptocurrency was updated',
  })
  updatedAt: Date;
}
