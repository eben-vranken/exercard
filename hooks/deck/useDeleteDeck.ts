import Database from "@tauri-apps/plugin-sql"

interface Deck {
    id: number;
    name: string;
    description: string;
}

const useDeleteDeck = async (deck: Deck): Promise<{ status: string, message: string }> => {
    try {
        console.log("Deleting deck:", deck);
        const db = await Database.load('sqlite:decks.db');

        await db.execute('PRAGMA foreign_keys = ON;');

        const result = await db.execute('DELETE FROM decks WHERE id = ?', [deck.id]);

        console.log('Delete result:', result);

        if (result.rowsAffected === 0) {
            throw new Error('No deck found with the given ID.');
        }

        return { status: 'ok', message: 'Successfully deleted deck.' };
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Error details:', err);
            return { status: 'error', message: `Failed to delete deck: ${err.message}` };
        }

        console.error('Unknown error:', err);
        return { status: 'error', message: 'An unknown error occurred.' };
    }
};

export default useDeleteDeck