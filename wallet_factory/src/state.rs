use linera_sdk::views::{
    linera_views, RegisterView, RootView, ViewStorageContext,
};

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct WalletFactoryState {
    pub counter: RegisterView<u64>,
}

