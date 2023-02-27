use crate::*;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, Debug, PartialEq)]
pub enum Phase {
    Waiting,
    Tie,
    Turn { checker: Checker},
    Won { checker: Checker},
}

impl Default for Phase {
    fn default() -> Self {
        Phase::Turn { checker: Checker::Red }
    }
}
