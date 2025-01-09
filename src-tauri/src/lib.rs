use tauri_plugin_sql::{Migration, MigrationKind};

mod review_algorithms;
use review_algorithms::{review_fsrs, review_sm2};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations: Vec<Migration> = vec![
        // Decks and card
        Migration {
            version: 1,
            description: "create decks table",
            sql: "CREATE TABLE IF NOT EXISTS decks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                algorithm TEXT NOT NULL DEFAULT 'sm2'
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
                retrievability REAL DEFAULT 1.0,  -- FSRS-specific
                stability REAL DEFAULT 1.0,      -- FSRS-specific
                difficulty REAL DEFAULT 0.0,    -- FSRS-specific
                repetition INTEGER DEFAULT 0,   -- SM-2-specific
                easiness_factor REAL DEFAULT 2.5, -- SM-2-specific
                interval INTEGER DEFAULT 1,     -- SM-2-specific
                grade INTEGER DEFAULT 0,        -- User's last review grade
                next_review INTEGER NOT NULL,  -- User's next review time
                new INTEGER NOT NULL DEFAULT 1,  -- User's next review time
                FOREIGN KEY(deck_id) REFERENCES decks(id) ON DELETE CASCADE
            )",
            kind: MigrationKind::Up,
        },
        // Tags
        Migration {
            version: 3,
            description: "create tags table",
            sql: "CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE 
            )",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create card_tags junction table",
            sql: "CREATE TABLE IF NOT EXISTS card_tags (
                card_id INTEGER,
                tag_id INTEGER,
                PRIMARY KEY (card_id, tag_id),
                FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            )",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create settings table",
            sql: "CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL UNIQUE,
            value TEXT NOT NULL,
            value_type TEXT NOT NULL,
            description TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )",
            kind: MigrationKind::Up,
        },

        // Individual settings
        Migration {
            version: 6,
            description: "insert default settings",
            sql: r#"
            INSERT OR IGNORE INTO settings (key, value, value_type, description) 
            VALUES ('daily_card_limit', '20', 'integer', 'The number of flashcards to study daily');

            INSERT OR IGNORE INTO settings (key, value, value_type, description) 
            VALUES ('user_name', 'User', 'string', 'The name of the user');
            "#,
            kind: MigrationKind::Up,
        }
    ];
    


    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:exercard.db", migrations)
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
        .invoke_handler(tauri::generate_handler![
            review_sm2,
            review_fsrs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
