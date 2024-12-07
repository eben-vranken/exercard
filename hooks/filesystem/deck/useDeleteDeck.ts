import Database from "@tauri-apps/plugin-sql"

interface Deck {
    id: number;
    name: string;
    description: string;
}

const useGetDecks = async (deck: Deck): Promise<{ status: string, message: string }> => {
    try {
        const db = await Database.load('sqlite:decks.db');
        const result = await db.select<Deck[]>(`DELETE FROM decks WHERE id=${deck.id}`);

        return { status: 'ok', message: 'Successfully deleted deck.' }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to fetch decks: ${err.message}` }
        }
        return { status: 'error', message: 'An unknown error occurred.' }
    }
}

export default useGetDecks