use crate::*;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, Debug, PartialEq)]
pub enum Phase {
    TurnRed,
    TurnYellow,
    WonRed,
    WonYellow,
    Tie,
    Waiting,
}

impl Default for Phase {
    fn default() -> Self {
        Phase::TurnRed
    }
}
