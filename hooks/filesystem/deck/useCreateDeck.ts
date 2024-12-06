import { exists, create, mkdir, BaseDirectory } from "@tauri-apps/plugin-fs"
import Database from "@tauri-apps/plugin-sql";

interface Deck {
    name: string;
    description: string;
}

const useCreateDeck = async ({ name, description }: Deck): Promise<{ status: string, message: string }> => {
    try {
        const db = await Database.load("sqlite:decks.db");

        await db.execute("INSERT INTO decks (name, description) VALUES ($1, $2)", [
            name,
            description,
        ]);

        return { status: 'ok', message: 'Deck created successfully.' }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to create deck: ${err.message}` }
        }
        return { status: 'error', message: 'An unknown error occurred when creating deck.' }
    }
}

export default useCreateDeck