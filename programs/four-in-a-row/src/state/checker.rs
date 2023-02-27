use crate::*;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, Debug, PartialEq)]
pub enum Checker {
    Red,
    Yellow,
}

impl Checker {
    pub fn flip_checker(&self) -> Checker {
        match self {
            Checker::Red => Checker::Yellow,
            Checker::Yellow => Checker::Red,
        }
    }

    pub fn to_string(&self) -> String {
        match self {
            Checker::Red => "Red".to_string(),
            Checker::Yellow => "Yellow".to_string(),
        }
    }
}
