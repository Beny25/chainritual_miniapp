use linera_sdk::abi::{ContractAbi, ServiceAbi};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Query {
    Counter,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Operation {
    Ping,
}

pub struct WalletFactoryAbi;

impl ContractAbi for WalletFactoryAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for WalletFactoryAbi {
    type Query = Query;
    type QueryResponse = u64;
}

