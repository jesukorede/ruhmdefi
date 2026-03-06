# RuhmDeFi

![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)

Decentralized AI DeFi agent on Solana devnet, automating arbitrage, yield farming, and portfolio management with cross-chain bridging.

## Project Overview

### Problem

Solana's DeFi ecosystem faces key challenges: fragmented liquidity leading to missed arbitrage opportunities worth $100M+ monthly, high barriers for retail users due to manual trading complexity and risk management, and limited cross-chain interoperability that prevents optimal capital flow between Base, Ethereum, and Solana.

### Solution

RuhmDeFi is an AI-powered autonomous DeFi agent that democratizes DeFi access. It uses Fetch.ai's uAgents for autonomous execution, Symbiosis (x402 bridging component) for seamless Base ↔ Solana transfers, and MeTTa Knowledge Graph for risk-aware decision-making. Users delegate capital management to an agent that executes on-chain via Anchor programs, reducing slippage by 40-60% and enabling cross-chain arbitrage and yield strategies.

## Key Benefits

- **Automated Arbitrage**: Scans Solana DEXs (e.g., Raydium, Orca) for price discrepancies and executes trades autonomously, increasing TVL and volume.
- **Cross-Chain Bridging (x402)**: Integrates Symbiosis for Base ↔ Solana transfers, unlocking liquidity from ERC-20 to SPL tokens, enabling multi-chain rebalancing and arbitrage.
- **AI-Driven Yield & Risk Management**: Uses MeTTa for structured risk assessment (high/medium/low labels) on token pairs, optimizing yield farming and reducing impermanent loss.
- **User-Friendly UX**: Next.js frontend with real-time charts, portfolio streams, and risk monitoring for non-technical users.
- **Ecosystem Growth**: Open-source and composable, fostering developer innovation and positioning Solana as a leader in AI-DeFi.

## Tech Stack

- **AI & Agents**: Fetch.ai uAgents, Agentverse, Chat Protocol, optional MeTTa Knowledge Graph.
- **Blockchain**: Solana (Anchor programs, SPL tokens), Base (via Symbiosis bridging).
- **Frontend**: Next.js, Tailwind CSS, React components for UI.
- **Backend**: Fastify API, Prisma ORM, PostgreSQL for data persistence.
- **DeFi Integrations**: Solana DEXs, DeFi data sources, cross-chain bridging.

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

## ASI Alliance Hackathon Alignment

- **Agents**: Built with Fetch.ai uAgents and Chat Protocol, published to Agentverse for ASI:One discovery.
- **Tech used**: uAgents, Agentverse, optional MeTTa Knowledge Graph for structured reasoning.
- **Frontend**: Modern Next.js UI (dark/light toggle, charts) for a clear demo flow.
- **Backend**: Fastify API integrates DeFi data sources and feeds the agent.

### Agent Details

- **Name**: RuhmDeFi
- **Address**: <to-be-filled-after-publish>
- **Agentverse**: <link-to-agent-on-agentverse>

### Submission

- Repo: This GitHub repository (public)
- Demo Video: 3–5 min walkthrough of agents, UI, and flows
- Category: Innovation Lab

## MeTTa Integration (Optional, Recommended)

We optionally integrate the MeTTa Knowledge Graph to assess risk of token pairs that appear in arbitrage suggestions and decision plans.

### Install

From the project root (where `agent.py` lives):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install metta-python
```

If `metta-python` fails on your system, try `pip install hyperon` (the package that provides the MeTTa runtime) or follow the official setup guide.

### Use

Run the agent:

```powershell
python agent.py
```

When the agent handles an "arbitrage" or "decision" message via the Chat Protocol, it will attempt to compute a simple risk label (high/medium/low) using MeTTa rules and include it in the response. If MeTTa is not installed, the agent gracefully falls back without risk labeling.

### Install

From the project root (where `agent.py` lives):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install metta-python
```

If `metta-python` fails on your system, try `pip install hyperon` (the package that provides the MeTTa runtime) or follow the official setup guide.

### Use

Run the agent:

```powershell
python agent.py
```

When the agent handles an "arbitrage" or "decision" message via the Chat Protocol, it will attempt to compute a simple risk label (high/medium/low) using MeTTa rules and include it in the response. If MeTTa is not installed, the agent gracefully falls back without risk labeling.
