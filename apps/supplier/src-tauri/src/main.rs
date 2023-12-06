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
            auth,
            create_broadcast,
            create_product,
            edit_product,
            create_variant,
            edit_variant,
            send_message
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn auth(email: String, password: String) {
    let payload = json!({
        "action": "AUTH",
        "payload": {
            "email": email,
            "password": password,
        }
    });

    println!("Payload: {}", payload);
}

#[tauri::command]
fn create_broadcast(message: &str) {
    let payload = json!({
        "action": "CREATE_BROADCAST",
        "payload": {
            "message": message
        }
    });

    println!("Payload: {}", payload);
}

#[tauri::command]
fn create_product(id: String, name: String, icon: String) {
    let payload = json!({
        "action": "CREATE_PRODUCT",
        "payload": {
            "id": id,
            "name": name,
            "icon": icon
        }
    });

    println!("Payload: {}", payload);
}

#[tauri::command]
fn edit_product(id: String, name: String, icon: String) {
    let payload = json!({
        "action": "EDIT_PRODUCT",
        "payload": {
            "id": id,
            "name": name,
            "icon": icon
        }
    });

    println!("Payload: {}", payload);
}

#[tauri::command]
fn create_variant(product_id: String, size: String, colour: String, quantity: i32) {
    let payload = json!({
        "action": "CREATE_VARIANT",
        "payload": {
            "productId": product_id,
            "size": size,
            "colour": colour,
            "quantity": quantity
        }
    });

    println!("Payload: {}", payload);
}

#[tauri::command]
fn edit_variant(product_id: String, id: String, size: String, colour: String, quantity: String) {
    let payload = json!({
        "action": "EDIT_VARIANT",
        "payload": {
            "productId": product_id,
            "id": id,
            "size": size,
            "colour": colour,
            "quantity": quantity
        }
    });

    println!("Payload: {}", payload);
}

#[tauri::command]
fn send_message(customer_id: String, message: String) {
    let payload = json!({
        "action": "SEND_MESSAGE",
        "payload": {
            "customerId": customer_id,
            "message": message
        }
    });

    println!("Payload: {}", payload);
}
