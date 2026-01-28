#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    Service,
    ServiceRuntime,
    views::View,
};
use linera_sdk::abi::WithServiceAbi;

use state::WalletFactoryState;
use wallet_factory::{WalletFactoryAbi, Query};

pub struct WalletFactoryService {
    state: WalletFactoryState,
}

linera_sdk::service!(WalletFactoryService);

impl WithServiceAbi for WalletFactoryService {
    type Abi = WalletFactoryAbi;
}

impl Service for WalletFactoryService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = WalletFactoryState::load(
            runtime.root_view_storage_context(),
        )
        .await
        .expect("load state");

        Self { state }
    }

    async fn handle_query(
        &self,
        query: Query,
    ) -> u64 {
        match query {
            Query::Counter => *self.state.counter.get(),
        }
    }
}

