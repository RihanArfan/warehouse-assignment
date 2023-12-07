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
    let mut stream = TcpStream::connect("localhost:4444").unwrap();

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
            get_suppliers,
            get_subscribed_products,
            subscribe_product,
            unsubscribe_product,
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
fn get_suppliers() {
    let payload = json!({
        "action": "GET_SUPPLIERS",
        "payload": {}
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}

#[tauri::command]
fn get_subscribed_products() {
    let payload = json!({
        "action": "GET_SUBSCRIBED_PRODUCTS",
        "payload": {}
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}

#[tauri::command]
fn subscribe_product(product_id: String) {
    let payload = json!({
        "action": "SUBSCRIBE_PRODUCT",
        "payload": {
            "productId": product_id,
        }
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}

#[tauri::command]
fn unsubscribe_product(product_id: String) {
    let payload = json!({
        "action": "UNSUBSCRIBE_PRODUCT",
        "payload": {
            "productId": product_id,
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
fn send_message(supplier_id: String, message: String) {
    let payload = json!({
        "action": "SEND_MESSAGE",
        "payload": {
            "supplierId": supplier_id,
            "message": message,
        }
    });

    let tx = TX.lock().unwrap();
    let tx = tx.as_ref().unwrap();
    tx.send(payload.to_string()).unwrap();
}
