import Database from "@tauri-apps/plugin-sql";

interface Card {
    deckId: number;
    front: string;
    back: string;
    hint?: string;
}

const useCreateCard = async (card: Card): Promise<{ status: string, message: string }> => {
    try {
        const db = await Database.load("sqlite:decks.db");

        // Create table if it doesn't exist
        await db.execute(`
            CREATE TABLE IF NOT EXISTS cards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                deck_id INTEGER NOT NULL,
                front TEXT NOT NULL,
                back TEXT NOT NULL,
                hint TEXT,
                due_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (deck_id) REFERENCES decks(id)
            )
        `);

        await db.execute(
            "INSERT INTO cards (deck_id, front, back, hint) VALUES ($1, $2, $3, $4)",
            [card.deckId, card.front, card.back, card.hint || null]
        );

        return { status: 'ok', message: 'Card created successfully.' }
    } catch (err: unknown) {
        console.error('Card creation error:', err);
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to create card: ${err.message}` }
        }
        return { status: 'error', message: 'An unknown error occurred when creating card.' }
    }
}

export default useCreateCard;