import Fastify from 'fastify';
import dotenv from 'dotenv';
import authPlugin from './plugins/auth.js';
import { registerRoutes } from './routes/index.js';

dotenv.config();

const server = Fastify({ logger: true });

server.register(authPlugin);

server.get('/health', async () => ({ status: 'ok' }));

await registerRoutes(server);

const port = Number(process.env.PORT || 4000);
server
  .listen({ port, host: '0.0.0.0' })
  .catch((err) => {
    server.log.error(err);
    process.exit(1);
  });
