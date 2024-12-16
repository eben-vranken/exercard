import Database from "@tauri-apps/plugin-sql";

interface Card {
    id: Number;
    deckId: number;
    front: string;
    back: string;
    hint?: string;
}

interface UseGetCardsResponse {
    status: 'ok' | 'error';
    data?: Card[];
    message?: string;
}

const useGetCards = async (deckId: number): Promise<UseGetCardsResponse> => {
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
                FOREIGN KEY (deck_id) REFERENCES decks (id) ON DELETE CASCADE
            );
        `);

        const result = await db.select(
            "SELECT * FROM cards WHERE deck_id = $1 ORDER BY due_date ASC",
            [deckId]
        );

        return {
            status: 'ok',
            data: result as Card[],
        };
    } catch (err: unknown) {
        return {
            status: 'error',
            message: `Failed to fetch cards: ${(err as Error).message}`,
        };
    }
};

export default useGetCards;