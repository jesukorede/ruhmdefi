# ... existing code ...
# ===== Helper: Connect to Backend (Fastify API) =====
import os
import requests
from datetime import datetime
from uuid import uuid4
from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    EndSessionContent,
    StartSessionContent,
    TextContent,
    chat_protocol_spec,
)

# ===== Optional: MeTTa Integration =====
try:
    # metta-python package provides runtime for MeTTa
    from hyperon import MeTTa
    METTA_AVAILABLE = True
except Exception:
    METTA_AVAILABLE = False

METTA_KNOWLEDGE = """
# Pairs, pools, and simple risk rules
(token SOL)
(token USDC)
(token BONK)

(pool raydium SOL/USDC liquidity-high apy-0.05)
(pool orca SOL/USDC liquidity-medium apy-0.04)
(pool raydium BONK/USDC liquidity-low apy-0.20)

# If liquidity-low and apy > 0.15 then risk-high
(:- (risk-high $pair)
    (pool $proto $pair liquidity-low $apy)
    (> $apy 0.15))

# If liquidity-high and apy < 0.10 then risk-low
(:- (risk-low $pair)
    (pool $proto $pair liquidity-high $apy)
    (< $apy 0.10))

# Fallback medium
(:- (risk-medium $pair)
    (token-pair $pair))
"""

def assess_with_metta(token_pair: str) -> dict:
    if not METTA_AVAILABLE:
        return {"metta": False, "risk": "unknown"}
    try:
        m = MeTTa()
        m.run(METTA_KNOWLEDGE)
        # Ensure token pair atom is present
        m.run(f"(= (token-pair {token_pair.replace('/', '')}) true)")
        # Query risk predicates in order
        high = m.run(f"(risk-high {token_pair})")
        low = m.run(f"(risk-low {token_pair})")
        if str(high).strip() != "()":
            return {"metta": True, "risk": "high"}
        if str(low).strip() != "()":
            return {"metta": True, "risk": "low"}
        return {"metta": True, "risk": "medium"}
    except Exception as e:
        return {"metta": False, "error": str(e), "risk": "unknown"}

def fetch_backend_data(endpoint: str):
    BASE_URL = os.getenv("AGENT_BACKEND_URL", "http://localhost:4000")
    try:
        response = requests.get(f"{BASE_URL}/{endpoint}", timeout=20)
        return response.json() if response.status_code == 200 else {"error": f"Backend returned {response.status_code}"}
    except Exception as e:
        return {"error": str(e), "endpoint": endpoint}

# ===== Helper: Fetch DeFi Data (DefiLlama, Jupiter) =====
def get_defi_opportunities():
    try:
        llama = requests.get("https://yields.llama.fi/pools", timeout=20).json()
        jupiter = requests.get(
            "https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000",
            timeout=20
        ).json()
        return {"llama_pools": len(llama.get("data", [])), "jupiter_best_price": jupiter.get("outAmount", 0)}
    except Exception as e:
        return {"error": str(e)}

agent = Agent(
    name=os.getenv("AGENT_NAME", "RuhmDeFi"),
    port=int(os.getenv("AGENT_PORT", "8000")),
    seed=os.getenv("AGENT_SEED", "RuhmDeFiSolanaAgentSeed"),
)

chat_proto = Protocol(spec=chat_protocol_spec)

def create_text_chat(text: str, end_session: bool = False) -> ChatMessage:
    content = [TextContent(type="text", text=text)]
    return ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=content,
    )

recent = []

@chat_proto.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    try:
        await ctx.send(sender, ChatAcknowledgement(timestamp=datetime.utcnow(), acknowledged_msg_id=msg.msg_id))
    except Exception:
        pass
    for item in msg.content:
        if isinstance(item, StartSessionContent):
            continue
        elif isinstance(item, TextContent):
            text = (item.text or "").lower()
            if "yield" in text:
                data = get_defi_opportunities()
                recent.append({"t": "yield", "d": data})
                await ctx.send(sender, create_text_chat(f"Yield data: {data}"))
            elif "arbitrage" in text:
                await ctx.send(sender, create_text_chat("Scanning for arbitrage..."))
                arb = fetch_backend_data("arbitrage")
                # Assess first suggestion with MeTTa if present
                try:
                    if isinstance(arb, dict) and "suggestions" in arb and arb["suggestions"]:
                        pair = arb["suggestions"][0].get("token_pair", "SOL/USDC")
                        risk = assess_with_metta(pair)
                        arb["metta_risk"] = risk
                except Exception:
                    pass
                recent.append({"t": "arbitrage", "d": arb})
                await ctx.send(sender, create_text_chat(f"Arbitrage: {arb}"))
            elif "decision" in text:
                dec = fetch_backend_data("decision")
                try:
                    if isinstance(dec, dict) and "plan" in dec:
                        pair = dec["plan"].get("token_pair", "SOL/USDC")
                        dec["plan"]["metta_risk"] = assess_with_metta(pair)
                except Exception:
                    pass
                recent.append({"t": "decision", "d": dec})
                await ctx.send(sender, create_text_chat(f"Decision: {dec}"))
            elif "summary" in text:
                await ctx.send(sender, create_text_chat(f"Recent: {recent[-3:]}"))
            elif "end" in text:
                await ctx.send(sender, create_text_chat("Session ended.", end_session=True))
            else:
                await ctx.send(sender, create_text_chat("Say 'yield', 'arbitrage', 'decision', or 'summary'."))
        elif isinstance(item, EndSessionContent):
            continue
        else:
            continue

@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    return

agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    agent.run()