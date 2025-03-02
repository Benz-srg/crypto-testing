import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'cryptocurrencies' })
export class Cryptocurrency extends Model<Cryptocurrency> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  symbol: string;

  @Column({
    type: DataType.DECIMAL(18, 8),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;
}
