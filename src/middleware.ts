/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Router, Request, Response, NextFunction,
} from 'express';

import { config } from 'dotenv';
import createConnectionPool, { sql } from '@databases/pg';
import { Client } from 'pg';

config();

const client = new Client();
client.connect();

/**
 * ! Middleware
 * @param {Request} request - The HTTP Request.
 * @param {Response} response - The HTTP Response.
 * @param {NextFunction} next - The function that forwards to the next available request.
 */
export const save = async (request: Request, response: Response, next: NextFunction) => {
  const filePath = request.file.path;
  console.log(filePath);

  const results = await client.query(`
  INSERT INTO dates (description, image) VALUES ('Some description', ${filePath}) ON CONFLICT DO NOTHING;
  `);

  console.log(results);

  next();
};
