use crate::*;

#[derive(Accounts)]
pub struct AddPlayer<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub board: Account<'info, Board>,
}

impl<'info> AddPlayer<'info> {
    #[access_control(Self::constraints(&self))]
    pub fn process(&mut self) -> Result<()> {
        let Self { signer, board, .. } = self;

        board.yellow = signer.key();

        // todo: randomize who goes first
        board.phase = Phase::Turn { checker: Checker::Red };

        Ok(())
    }

    pub fn constraints(&self) -> Result<()> {
        require!(self.board.phase == Phase::Waiting, ErrorCode::InvalidPhase);

        Ok(())
    }
}