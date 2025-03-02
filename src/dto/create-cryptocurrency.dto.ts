import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCryptocurrencyDto {
  @ApiProperty({
    example: 'Bitcoin',
    description: 'The full name of the cryptocurrency',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'BTC',
    description: 'The ticker symbol of the cryptocurrency',
  })
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @ApiProperty({
    example: 60500.25,
    description: 'The current price of the cryptocurrency in USD',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
