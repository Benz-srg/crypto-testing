export interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  price: number | null;
}

export interface BinanceMarketData {
  symbol: string;
  price: string;
}
