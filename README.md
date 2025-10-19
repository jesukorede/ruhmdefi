# RuhmDeFi

Decentralized AI DeFi agent on Solana devnet.

## Setup

1. Frontend
   - `cd frontend`
   - Set `NEXT_PUBLIC_API_BASE=http://localhost:4000` and `NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com`
   - `npm run dev`

2. Backend
   - `cd backend`
   - Copy `.env.example` to `.env` and set `DATABASE_URL`, optional `OPENROUTER_API_KEY`
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
   - `npm run dev`

3. Programs (Anchor)
   - Requires Solana CLI, Rust, and Anchor installed.
   - Update `PROGRAM_ID` in `.env` and `Anchor.toml`.
   - Build and deploy to devnet when ready.

## Notes
- `/arbitrage` works without AI key (stubbed suggestions).
- Add `/decision` next to write decisions on-chain via Anchor.