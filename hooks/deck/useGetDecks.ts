import Database from "@tauri-apps/plugin-sql"

const useGetDecks = async () => {
    try {
        const db = await Database.load('sqlite:exercard.db');
        const dbDecks = await db.select<Deck[]>("SELECT * FROM decks");

        return { status: 'ok', decks: dbDecks }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to fetch decks: ${err.message}` }
        }
        return { status: 'error', message: 'An unknown error occurred.' }
    }
}

export default useGetDecks