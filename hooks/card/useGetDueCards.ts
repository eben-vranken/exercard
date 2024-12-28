import Database from "@tauri-apps/plugin-sql";

interface UseGetCardsResponse {
    status: 'ok' | 'error';
    data?: Card[];
    message?: string;
}

const useGetDueCards = async (deckId: number): Promise<UseGetCardsResponse> => {
    try {
        const db = await Database.load("sqlite:decks.db");

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const todayEndTimestamp = todayEnd.getTime();

        const result = await db.select(
            `SELECT 
                *
            FROM cards 
            WHERE deck_id = $1 
            AND next_review <= $2
            ORDER BY next_review ASC`,
            [deckId, todayEndTimestamp]
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

export default useGetDueCards;
