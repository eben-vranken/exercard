import Database from "@tauri-apps/plugin-sql"

const useDeleteCard = async (cardId: Number): Promise<{ status: string, message: string }> => {
    try {
        const db = await Database.load('sqlite:exercard.db');

        const result = await db.execute('DELETE FROM cards WHERE id = ?', [cardId]);

        if (result.rowsAffected === 0) {
            throw new Error('No card found with the given ID.');
        }

        return { status: 'ok', message: 'Successfully deleted card.' };
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Error details:', err);
            return { status: 'error', message: `Failed to delete card: ${err.message}` };
        }

        console.error('Unknown error:', err);
        return { status: 'error', message: 'An unknown error occurred.' };
    }
};

export default useDeleteCard