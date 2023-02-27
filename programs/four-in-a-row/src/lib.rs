use anchor_lang::prelude::*;

mod instructions;
mod state;
mod errors;

pub use instructions::*;
pub use state::*;
pub use errors::ErrorCode;

declare_id!("DKmcCpAshxyvZdBsABr6j7AgQ3JhL8um66MKwvugFEuA");

#[program]
mod four_in_a_row {
    use super::*;

    pub fn initialize_board(ctx: Context<InitializeBoard>, board_id: String) -> Result<()> {
        ctx.accounts.process(board_id)
    }

    pub fn add_checker(ctx: Context<AddChecker>, col: u8) -> Result<()> {
        ctx.accounts.process(col)
    }
}
