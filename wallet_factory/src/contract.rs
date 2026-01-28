#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    views::{RootView, View},
    Contract, ContractRuntime,
    linera_base_types::WithContractAbi,
};

use wallet_factory::{Operation, WalletFactoryAbi};
use state::WalletFactoryState;

pub struct WalletFactoryContract {
    state: WalletFactoryState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(WalletFactoryContract);

impl WithContractAbi for WalletFactoryContract {
    type Abi = WalletFactoryAbi;
}

impl Contract for WalletFactoryContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state =
            WalletFactoryState::load(runtime.root_view_storage_context())
                .await
                .expect("load state");
        Self { state, runtime }
    }

    async fn instantiate(&mut self, _arg: ()) {
        self.state.counter.set(0);
    }

async fn execute_operation(&mut self, op: Operation) {
    match op {
        Operation::Ping => {
            let v = *self.state.counter.get();
            self.state.counter.set(v + 1);
        }
    }
}

    async fn execute_message(&mut self, _: ()) {}

    async fn store(mut self) {
        self.state.save().await.unwrap();
    }
}

