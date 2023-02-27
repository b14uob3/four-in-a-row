use crate::*;

#[derive(Accounts)]
pub struct AddChecker<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub board: Account<'info, Board>,
}

impl<'info> AddChecker<'info> {
    pub fn process(&mut self, cul: u8) -> Result<()> {
        let Self { signer, board, .. } = self;

        if signer.key() == board.red.unwrap() {
            board.add_checker(cul as usize);
            msg!("added checker");
        }

        Ok(())
    }
}
