# ... existing code ...
# ===== Helper: Connect to Backend (Fastify API) =====
import os
import requests

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
    name="RuhmDeFi",
    port=8000,
    seed="RuhmDeFiSolanaAgentSeed",
    endpoint="https://agentverse.ai/agent/ruhmdefi",
    protocol=chat_protocol_spec,
)

@agent.on_message(model=ChatMessage, replies=ChatAcknowledgement)
async def handle_chat(ctx: Context, sender: str, msg: ChatMessage):
    user_text = (msg.content[0].text or "").lower()
    ctx.logger.info(f"🧠 Received message: {user_text}")

    if "yield" in user_text:
        data = get_defi_opportunities()
        ctx.send(sender, create_text_chat(f"📊 Yield data fetched: {data}"))
        memory.add({"type": "yield", "data": data})

    elif "arbitrage" in user_text:
        ctx.send(sender, create_text_chat("🔍 Scanning for arbitrage..."))
        arb_data = fetch_backend_data("arbitrage")
        ctx.send(sender, create_text_chat(f"💰 Arbitrage update: {arb_data}"))
        memory.add({"type": "arbitrage", "data": arb_data})

    elif "summary" in user_text:
        ctx.send(sender, create_text_chat(f"🧾 Recent actions: {memory.history[-3:]}"))

    elif "end" in user_text:
        ctx.send(sender, create_text_chat("👋 Ending session.", end_session=True))

    else:
        ctx.send(sender, create_text_chat("🤖 RuhmDeFi: I can check yield, arbitrage, or summary."))