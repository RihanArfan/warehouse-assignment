// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    io::{Read, Write},
    net::TcpStream,
    sync::mpsc,
};

use serde_json::json;
use tauri::{AppHandle, Manager};
use window_shadows::set_shadow;

use lazy_static::lazy_static;
use std::sync::{Arc, Mutex};

lazy_static! {
    static ref STREAM: Arc<Mutex<Option<TcpStream>>> = Arc::new(Mutex::new(None));
    static ref TX: Mutex<Option<mpsc::Sender<String>>> = Mutex::new(None);
}

// payload struct for incoming messages from the server
#[derive(Clone, Debug, serde::Deserialize, serde::Serialize)]
struct Payload {
    code: String,
    data: serde_json::Value,
}

async fn socket_handler(app: AppHandle, rx: mpsc::Receiver<String>) {
    let mut stream = TcpStream::connect("localhost:5555").unwrap();

    loop {
        let mut buf = [0; 51200];

        // check if there's a payload in the channel
        if let Ok(payload) = rx.try_recv() {
            println!("Payload: {}", payload);
            // write payload to the stream
            stream.write_all(payload.as_bytes()).unwrap();
        }

        // read from the stream
        let n = stream.read(&mut buf).unwrap();

        if n == 0 {
            // connection closed, handle this case separately
            println!("Connection closed");
            continue;
        }

        // ignore heartbeat messages
        if String::from_utf8_lossy(&buf[..n]) == "HEARTBEAT\n" {
            continue;
        }

        let msg = String::from_utf8_lossy(&buf[..n]);
        println!("Message: {}", msg);

        let _ = app.emit_all("server", msg);
    }
}

fn main() {
    tauri::Builder::default()
        // windows 11 rounded ui
        // @see https://github.com/tauri-apps/window-shadows/blob/dev/examples/tauri/src-tauri/src/main.rs
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            set_shadow(&window, true).expect("Unsupported platform!");

            let (tx, rx) = mpsc::channel();
            *TX.lock().unwrap() = Some(tx);

            let app_handle = app.handle();
            tauri::async_runtime::spawn(async move { socket_handler(app_handle, rx).await });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            auth,
            get_broadcasts,
            get_products,
            get_customers,
            create_broadcast,
            create_product,
            edit_product,
            create_variant,
            edit_variant,
            delete_product,
            delete_variant,
            get_conversations,
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

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}

#[tauri::command]
fn get_broadcasts() {
    let payload = json!({
        "action": "GET_BROADCASTS",
        "payload": {}
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}

#[tauri::command]
fn get_products() {
    let payload = json!({
        "action": "GET_PRODUCTS",
        "payload": {}
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}

#[tauri::command]
fn get_customers() {
    let payload = json!({
        "action": "GET_CUSTOMERS",
        "payload": {}
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}

#[tauri::command]
fn create_broadcast(message: &str) {
    let payload = json!({
        "action": "CREATE_BROADCAST",
        "payload": {
            "message": message
        }
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
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

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
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

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
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

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}

#[tauri::command]
fn edit_variant(sku: String, quantity: i32) {
    let payload = json!({
        "action": "EDIT_VARIANT",
        "payload": {
            "sku": sku,
            "quantity": quantity
        }
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}

#[tauri::command]
fn delete_product(id: String) {
    let payload = json!({
        "action": "DELETE_PRODUCT",
        "payload": {
            "id": id
        }
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}

#[tauri::command]
fn delete_variant(sku: String) {
    let payload = json!({
        "action": "DELETE_VARIANT",
        "payload": {
            "sku": sku
        }
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}

#[tauri::command]
fn get_conversations() {
    let payload = json!({
        "action": "GET_CONVERSATIONS",
        "payload": {}
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
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

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}
