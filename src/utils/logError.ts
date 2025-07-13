import logger from './logger';
import { Request } from 'express';

export const logError = (message: string, error?: any, req?: Request) => {
  let requestInfo = '';
  if (req) {
    requestInfo = `
Request Info:
  URL: ${req.originalUrl || req.url}
  Method: ${req.method}
  Body: ${JSON.stringify(req.body, null, 2)}
  Query: ${JSON.stringify(req.query, null, 2)}
  Params: ${JSON.stringify(req.params, null, 2)}
    `;
  }

  const logMessage = `[errorResponse] ${message}\n${requestInfo}\nError: ${
    error?.stack || error?.message || error
  }`;

  logger.error(logMessage);
};
