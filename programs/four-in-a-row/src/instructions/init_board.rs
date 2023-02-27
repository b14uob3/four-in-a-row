use crate::*;

#[derive(Accounts)]
#[instruction(board_id: String)]
pub struct InitializeBoard<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(init, payer = signer, space = 120, seeds = [b"board", signer.key().as_ref(), board_id.as_bytes()], bump)]
    pub board: Account<'info, Board>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeBoard<'_> {
    pub fn process(&mut self, board_id: String) -> Result<()> {
        let Self { signer, board, .. } = self;

        board.red = signer.key();
        board.board_id = board_id;

        Ok(())
    }
}