use anchor_lang::prelude::*;

declare_id!("RuhmDeFiProgram1111111111111111111111111111");

#[program]
pub mod ruhmdefi {
    use super::*;
    pub fn record_decision(ctx: Context<RecordDecision>, trade_id: String, token_pair: String, strategy_summary: String, confidence_score: u8, timestamp: i64) -> Result<()> {
        let rec = &mut ctx.accounts.decision_record;
        rec.authority = *ctx.accounts.authority.key;
        rec.trade_id = trade_id;
        rec.token_pair = token_pair;
        rec.strategy_summary = strategy_summary;
        rec.confidence_score = confidence_score;
        rec.timestamp = timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(trade_id: String)]
pub struct RecordDecision<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    /// PDA per user + trade_id
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + 64 + 4 + 256 + 1 + 8, // rough sizing
        seeds = [authority.key().as_ref(), trade_id.as_bytes()],
        bump
    )]
    pub decision_record: Account<'info, DecisionRecord>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct DecisionRecord {
    pub authority: Pubkey,
    pub trade_id: String,
    pub token_pair: String,
    pub strategy_summary: String,
    pub confidence_score: u8,
    pub timestamp: i64,
}