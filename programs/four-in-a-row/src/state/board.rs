use crate::*;

const ROWS: usize = 6;
pub const COLS: usize = 7;
const WINNING_COUNT: usize = 4;

#[derive(Default)]
#[account]
pub struct Board {
    pub board: [[Option<Checker>; COLS]; ROWS],
    pub phase: Phase,
    pub red: Option<Pubkey>,
    pub yellow: Option<Pubkey>,
}

impl Board {
    pub fn add_checker(&mut self, col: usize) {
        let mut row = 0;
        for i in (0..ROWS).rev() {
            if self.board[i][col].is_none() {
                row = i;
                break;
            }
        }

        self.board[row][col] = self.turn();

        if self.is_full() {
            self.phase = Phase::Tie;
            msg!("Tie!");
        } else if self.is_winner() {
            let winner = self.turn().unwrap();
            self.phase = Phase::Won { checker: winner };
            msg!("{} won!", winner.to_string());
        } else {
            self.phase = Phase::Turn { checker: self.turn().unwrap().flip_checker() };
        }
    }

    fn is_full(&self) -> bool {
        (0..COLS).all(|col| self.board[0][col].is_some())
    }

    fn is_winner(&self) -> bool {
        // check horizontal
        for row in 0..ROWS {
            for col in 0..=COLS - WINNING_COUNT {
                if self.board[row][col..col + WINNING_COUNT]
                    .iter()
                    .all(|&c| c == self.turn())
                {
                    return true;
                }
            }
        }

        // check vertical
        for col in 0..COLS {
            for row in 0..=ROWS - WINNING_COUNT {
                if (0..WINNING_COUNT).all(|i| self.board[row + i][col] == self.turn()) {
                    return true;
                }
            }
        }

        // check diagonal (\)
        for row in 0..=ROWS - WINNING_COUNT {
            for col in 0..=COLS - WINNING_COUNT {
                if (0..WINNING_COUNT).all(|i| self.board[row + i][col + i] == self.turn()) {
                    return true;
                }
            }
        }

        // check diagonal (/)
        for row in (WINNING_COUNT - 1)..ROWS {
            for col in 0..=COLS - WINNING_COUNT {
                if (0..WINNING_COUNT).all(|i| self.board[row - i][col + i] == self.turn()) {
                    return true;
                }
            }
        }

        false
    }

    pub fn turn(&self) -> Option<Checker> {
        match self.phase {
            Phase::Turn { checker } => Some(checker),
            _ => None,
        }
    }
}