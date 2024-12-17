use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations: Vec<Migration> = vec![
        Migration {
            version: 1,
            description: "create decks table",
            sql: "CREATE TABLE IF NOT EXISTS decks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT
        )",
        kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create cards table",
            sql: "CREATE TABLE IF NOT EXISTS cards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                deck_id INTEGER NOT NULL,
                front TEXT NOT NULL,
                back TEXT NOT NULL,
                stability REAL DEFAULT 1.0,
                retrievability REAL DEFAULT 1.0,
                difficulty REAL DEFAULT 0.0,
                next_review INTEGER NOT NULL,
                FOREIGN KEY(deck_id) REFERENCES decks(id)
            )",
            kind: MigrationKind::Up,
        }
    ];

  tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:decks.db", migrations)
                .build())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}