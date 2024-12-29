import Database from "@tauri-apps/plugin-sql";

const useCreateCard = async (card: Card): Promise<{ status: string, message: string }> => {
    try {
        const db = await Database.load("sqlite:decks.db");

        await db.execute(
            "INSERT INTO cards (deck_id, front, back, next_review) VALUES ($1, $2, $3, $4)",
            [
                card.deckId,
                card.front,
                card.back,
                Math.floor(Date.now() / 1000)
            ]
        );

        return { status: 'ok', message: 'Card created successfully.' };
    } catch (err: unknown) {
        console.error('Card creation error:', err);
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to create card: ${err.message}` };
        }
        return { status: 'error', message: 'An unknown error occurred when creating card.' };
    }
}

export default useCreateCard;