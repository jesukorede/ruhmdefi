# API Reference

- GET `/arbitrage`: returns `{ suggestions: Suggestion[] }`
- Suggestion: `{ trade_id, token_pair, strategy_summary, confidence_score, expected_apy?, timestamp }`