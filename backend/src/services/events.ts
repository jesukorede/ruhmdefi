import type { ServerResponse } from 'http';

type Client = { id: string; res: ServerResponse };

const clients = new Map<string, Client>();

export function addClient(res: ServerResponse) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  clients.set(id, { id, res });
  return id;
}

export function removeClient(id: string) {
  const client = clients.get(id);
  if (client) {
    try { client.res.end(); } catch {}
  }
  clients.delete(id);
}

export function broadcast(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const { res } of clients.values()) {
    try { res.write(payload); } catch {}
  }
}

export function write(res: ServerResponse, event: string, data: any) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}