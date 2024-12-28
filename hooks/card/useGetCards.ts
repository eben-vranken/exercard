import Database from "@tauri-apps/plugin-sql";

interface UseGetCardsResponse {
    status: 'ok' | 'error';
    data?: Card[];
    message?: string;
}

const useGetCards = async (deckId: number): Promise<UseGetCardsResponse> => {
    try {
        const db = await Database.load("sqlite:decks.db");

        const result = await db.select(
            "SELECT * FROM cards WHERE deck_id = $1 ORDER BY next_review ASC",
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