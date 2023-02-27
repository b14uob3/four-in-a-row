use crate::*;

#[derive(Accounts)]
pub struct AddChecker<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub board: Account<'info, Board>,
}

impl<'info> AddChecker<'info> {
    #[access_control(Self::constraints(&self, col))]
    pub fn process(&mut self, col: u8) -> Result<()> {
        let Self { signer, board, .. } = self;

        if signer.key() == board.red || signer.key() == board.yellow {
            board.add_checker(col as usize);
            msg!("added checker");
        }

        Ok(())
    }

    pub fn constraints(&self, col: u8) -> Result<()> {
        require!(self.board.turn().is_some(), ErrorCode::Unauthorized);
        // require!(self.board.turn_key() == self.signer.key(), ErrorCode::Unauthorized);
        require!(self.board.board[0][col as usize].is_none(), ErrorCode::ColumnFull);
        require!(col < COLS as u8, ErrorCode::InvalidColumn);

        Ok(())
    }
}
