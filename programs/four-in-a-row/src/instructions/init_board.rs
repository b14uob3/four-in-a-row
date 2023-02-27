use crate::*;

#[derive(Accounts)]
pub struct InitializeBoard<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(init, payer=signer, space=120)]
    pub board: Account<'info, Board>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeBoard<'_> {
    pub fn process(&mut self) -> Result<()> {
        let Self { signer, board, .. } = self;

        board.red = signer.key();

        Ok(())
    }
}
