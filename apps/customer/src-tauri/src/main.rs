// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::json;
use tauri::Manager;
use window_shadows::set_shadow;

fn main() {
    tauri::Builder::default()
        // windows 11 rounded ui
        // @see https://github.com/tauri-apps/window-shadows/blob/dev/examples/tauri/src-tauri/src/main.rs
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            set_shadow(&window, true).expect("Unsupported platform!");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            subscribe_product,
            unsubscribe_product
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn subscribe_product(product_id: String) {
    let payload = json!({
        "action": "SUBSCRIBE_PRODUCT",
        "payload": {
            "productId": product_id,
        }
    });

    println!("Payload: {}", payload);
}

#[tauri::command]
fn unsubscribe_product(product_id: String) {
    let payload = json!({
        "action": "UNSUBSCRIBE_PRODUCT",
        "payload": {
            "productId": product_id,
        }
    });

    println!("Payload: {}", payload);
}
