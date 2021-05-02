import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import { types } from 'pg';
import routes from './routes';
import AppError from './errors/AppError';

import createConnection from './database';

types.setTypeParser(1700, val => parseFloat(val));

createConnection();
const app = express();

app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;
