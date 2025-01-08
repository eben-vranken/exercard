import Database from "@tauri-apps/plugin-sql";

const useGetSpecificDeck = async (deckId: string): Promise<{ status: string, deck?: Deck, message?: string }> => {
    try {
        const db = await Database.load("sqlite:exercard.db");

        const result = await db.select<Deck[]>("SELECT * FROM decks WHERE id = $1", [deckId]);

        if (result.length > 0) {
            return { status: 'ok', deck: result[0] };
        } else {
            return { status: 'error', message: `Deck with name "${deckId}" not found.` };
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to fetch deck: ${err.message}` };
        }
        return { status: 'error', message: 'An unknown error occurred when fetching specific deck' };
    }
}

export default useGetSpecificDeck;
