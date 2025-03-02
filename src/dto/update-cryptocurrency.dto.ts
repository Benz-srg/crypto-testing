import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCryptocurrencyDto {
  @ApiPropertyOptional({
    example: 'Bitcoin',
    description: 'The updated full name of the cryptocurrency',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'BTC',
    description: 'The updated ticker symbol of the cryptocurrency',
  })
  @IsOptional()
  @IsString()
  symbol?: string;

  @ApiPropertyOptional({
    example: 60500.25,
    description: 'The updated price of the cryptocurrency in USD',
  })
  @IsOptional()
  @IsNumber()
  price?: number;
}
