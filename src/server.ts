import 'dotenv/config';
import app from './app.js';

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing backend or set PORT to another available port.`);
    process.exitCode = 1;
    return;
  }

  throw error;
});
