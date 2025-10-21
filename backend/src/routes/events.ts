import { FastifyInstance } from 'fastify';
import { addClient, removeClient, write } from '../services/events';

export default async function eventsRoutes(server: FastifyInstance) {
  server.get('/events', (request, reply) => {
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('Access-Control-Allow-Origin', '*');
    reply.raw.flushHeaders?.();

    reply.raw.write('retry: 2000\n\n'); // reconnection delay
    write(reply.raw, 'hello', { ts: Date.now() });

    const id = addClient(reply.raw);

    const interval = setInterval(() => {
      try { reply.raw.write(`event: ping\ndata: ${Date.now()}\n\n`); } catch {}
    }, 15000);

    request.raw.on('close', () => {
      clearInterval(interval);
      removeClient(id);
    });
  });
}