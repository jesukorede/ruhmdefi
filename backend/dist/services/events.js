"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addClient = addClient;
exports.removeClient = removeClient;
exports.broadcast = broadcast;
exports.write = write;
const clients = new Map();
function addClient(res) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    clients.set(id, { id, res });
    return id;
}
function removeClient(id) {
    const client = clients.get(id);
    if (client) {
        try {
            client.res.end();
        }
        catch { }
    }
    clients.delete(id);
}
function broadcast(event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const { res } of clients.values()) {
        try {
            res.write(payload);
        }
        catch { }
    }
}
function write(res, event, data) {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}
