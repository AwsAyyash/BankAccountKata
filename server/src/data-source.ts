import { DataSource } from 'typeorm';
import { Account } from './entity/Account';
import { Transaction } from './entity/Transaction';
import { Transfer } from './entity/Transfer';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './bank.sqlite',
  synchronize: true,
  logging: true,
  entities: [Account, Transaction, Transfer],
});
