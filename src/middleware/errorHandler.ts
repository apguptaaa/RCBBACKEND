import type { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';

const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Request validation failed.',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
    return;
  }

  if (err instanceof MulterError) {
    const statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    res.status(statusCode).json({
      error: statusCode === 413 ? 'Image exceeds the 5 MB upload limit.' : err.message
    });
    return;
  }

  const databaseError = err as { code?: string; statusCode?: number };
  if (databaseError.code === 'P2002' || databaseError.code === '23505') {
    res.status(409).json({ error: 'A record with these details already exists.' });
    return;
  }
  if (databaseError.code === 'P2003' || databaseError.code === 'P2014' ||
      databaseError.code === '23503' || databaseError.code === '23514') {
    res.status(409).json({ error: 'This change conflicts with related records or database rules.' });
    return;
  }
  if (databaseError.code === 'P2025') {
    res.status(404).json({ error: 'The requested record was not found.' });
    return;
  }

  const statusCodeCandidate =
    typeof err === 'object' && err !== null && 'statusCode' in err
      ? err.statusCode
      : typeof err === 'object' && err !== null && 'status' in err
        ? err.status
        : undefined;
  const statusCode =
    typeof statusCodeCandidate === 'number' &&
    Number.isInteger(statusCodeCandidate) &&
    statusCodeCandidate >= 400 &&
    statusCodeCandidate < 600
      ? statusCodeCandidate
      : 500;

  if (statusCode === 500) {
    console.error('Unhandled API error:', err);
  }

  const errorMessage =
    typeof err === 'object' && err !== null && 'message' in err
      ? err.message
      : undefined;
  const message =
    statusCode === 500
      ? 'Internal server error.'
      : typeof errorMessage === 'string'
        ? errorMessage
        : 'Request failed';

  res.status(statusCode).json({ message });
};

export default errorHandler;
