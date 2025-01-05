import Database from "@tauri-apps/plugin-sql";

interface UseGetCardsResponse {
    status: 'ok' | 'error';
    data?: CardWithTags[];
    message?: string;
}

const useGetDueCards = async (deckId: number): Promise<UseGetCardsResponse> => {
    try {
        const db = await Database.load("sqlite:decks.db");
        const currentTimestamp = Math.floor(Date.now() / 1000);

        const result: any = await db.select(`
            SELECT 
                c.*,
                GROUP_CONCAT(t.id) as tag_ids,
                GROUP_CONCAT(t.name) as tag_names
            FROM cards c
            LEFT JOIN card_tags ct ON c.id = ct.card_id
            LEFT JOIN tags t ON ct.tag_id = t.id
            WHERE c.deck_id = $1
            AND c.next_review <= $2
            GROUP BY c.id
            ORDER BY c.next_review ASC`,
            [deckId, currentTimestamp]
        );

        const cardsWithTags = result.map((row: { [x: string]: any; tag_ids: string; tag_names: string }) => {
            const tagIds = row.tag_ids ? row.tag_ids.split(',').map(Number) : [];
            const tagNames = row.tag_names ? row.tag_names.split(',') : [];

            const tags = tagIds.map((id, index) => ({
                id,
                name: tagNames[index]
            }));

            const { tag_ids, tag_names, ...cardData } = row;
            return {
                ...cardData,
                tags
            };
        });

        return {
            status: 'ok',
            data: cardsWithTags
        };
    } catch (err: unknown) {
        return {
            status: 'error',
            message: `Failed to fetch due cards with tags: ${(err as Error).message}`
        };
    }
};


export default useGetDueCards;
