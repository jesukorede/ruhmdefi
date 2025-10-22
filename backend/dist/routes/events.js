"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = eventsRoutes;
const events_1 = require("../services/events");
async function eventsRoutes(server) {
    server.get('/events', (request, reply) => {
        reply.raw.setHeader('Content-Type', 'text/event-stream');
        reply.raw.setHeader('Cache-Control', 'no-cache');
        reply.raw.setHeader('Connection', 'keep-alive');
        reply.raw.setHeader('Access-Control-Allow-Origin', '*');
        reply.raw.flushHeaders?.();
        reply.raw.write('retry: 2000\n\n'); // reconnection delay
        (0, events_1.write)(reply.raw, 'hello', { ts: Date.now() });
        const id = (0, events_1.addClient)(reply.raw);
        const interval = setInterval(() => {
            try {
                reply.raw.write(`event: ping\ndata: ${Date.now()}\n\n`);
            }
            catch { }
        }, 15000);
        request.raw.on('close', () => {
            clearInterval(interval);
            (0, events_1.removeClient)(id);
        });
    });
}
