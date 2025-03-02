import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'crypto_testing',
      password: process.env.DB_PASSWORD || 'crypto_testing_password',
      database: process.env.DB_NAME || 'crypto_testing',
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
