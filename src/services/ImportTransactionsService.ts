import parse from 'csv-parse';
import path from 'path';
import fs from 'fs';

import Transaction from '../models/Transaction';
import uploadConfigs from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();
    const transactions: Array<TransactionDTO> = [];

    const dest = path.join(uploadConfigs.destination, fileName);
    const file = fs.readFileSync(dest, 'utf-8');
    const parser = parse({ columns: true, trim: true });

    parser.on('readable', () => {
      let record = parser.read();
      while (record) {
        transactions.push(record);
        record = parser.read();
      }
    });

    parser.write(file);
    parser.end();

    const entities: Array<Transaction> = [];

    for await (const transaction of transactions) {
      const entity = await createTransactionService.execute({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        categoryTitle: transaction.category,
      });
      entities.push(entity);
    }

    return entities;
  }
}

export default ImportTransactionsService;
