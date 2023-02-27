use crate::*;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, Debug, PartialEq)]
pub enum Checker {
    Red,
    Yellow,
}

impl Checker {
    pub fn get_opposite(&self) -> Checker {
        match self {
            Checker::Red => Checker::Yellow,
            Checker::Yellow => Checker::Red,
        }
    }

    pub fn get_checker(&self) -> String {
        match self {
            Checker::Red => "Red".to_string(),
            Checker::Yellow => "Yellow".to_string(),
        }
    }
}
