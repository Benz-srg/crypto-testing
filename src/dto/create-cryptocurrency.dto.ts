import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCryptocurrencyDto {
  @ApiProperty({
    example: 'Doge Coin',
    description: 'The full name of the cryptocurrency',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'DOGE',
    description: 'The ticker symbol of the cryptocurrency',
  })
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @ApiProperty({
    example: 0.2,
    description: 'The current price of the cryptocurrency in USD',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
