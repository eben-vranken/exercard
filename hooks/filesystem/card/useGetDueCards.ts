import Database from "@tauri-apps/plugin-sql";

interface Card {
    id: Number;
    deckId: number;
    front: string;
    back: string;
    retrievability: number;
    stability: number;
    difficulty: number;
}

interface UseGetCardsResponse {
    status: 'ok' | 'error';
    data?: Card[];
    message?: string;
}

const useGetDueCards = async (deckId: number): Promise<UseGetCardsResponse> => {
    try {
        const db = await Database.load("sqlite:decks.db");

        const result = await db.select(
            "SELECT * FROM cards WHERE deck_id = $1 AND next_review < $2 ORDER BY next_review ASC",
            [deckId, Date.now()]
        );


        console.log(result)

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