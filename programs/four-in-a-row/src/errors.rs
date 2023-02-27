use crate::*;

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("The column must be between 0 and 6")]
    InvalidColumn,
    #[msg("The column is full")]
    ColumnFull,
}