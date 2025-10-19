# RuhmDeFi Architecture

- Frontend: Next.js app with wallet adapter, dashboard, and backend proxy.
- Backend: Fastify with endpoints for arbitrage scan, Prisma persistence, LangChain agent.
- Programs: Anchor smart contract storing AI decision records (devnet).
- Data sources: DefiLlama pools, Jupiter price API.
- Transparency: AI suggestions displayed, on-chain logging for approvals.