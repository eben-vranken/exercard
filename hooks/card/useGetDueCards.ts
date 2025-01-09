import { useSettings } from "@/context/SettingsContext";
import Database from "@tauri-apps/plugin-sql";

interface UseGetCardsResponse {
    status: 'ok' | 'error';
    data?: CardWithTags[];
    message?: string;
}

const useGetDueCards = async (deckId: number, dailyCardLimit: number): Promise<UseGetCardsResponse> => {

    try {
        const db = await Database.load("sqlite:exercard.db");
        const currentTimestamp = Math.floor(Date.now() / 1000);

        // First, fetch the deck's current status: how many new cards have been reviewed today
        const deckStatus: any = await db.select(`
            SELECT last_review_date, new_cards_reviewed_today
            FROM decks
            WHERE id = $1
        `, [deckId]);

        const newCardsReviewedToday = deckStatus[0]?.new_cards_reviewed_today;
        const dailyLimit = dailyCardLimit;

        // Calculate the remaining new cards to be reviewed today
        const remainingNewCards = dailyLimit - newCardsReviewedToday;

        console.log("Daily Limit", dailyLimit)
        console.log("New cards reviewed today", newCardsReviewedToday)
        console.log("Remaining cards:", remainingNewCards)

        // 1. Fetch all due cards with new = 0 (already reviewed cards)
        const dueCardsResult = await db.select(`
            SELECT 
                c.*, 
                GROUP_CONCAT(t.id) as tag_ids,
                GROUP_CONCAT(t.name) as tag_names
            FROM cards c
            LEFT JOIN card_tags ct ON c.id = ct.card_id
            LEFT JOIN tags t ON ct.tag_id = t.id
            WHERE c.deck_id = $1
            AND c.next_review <= $2
            AND c.new = 0
            GROUP BY c.id
            ORDER BY c.next_review ASC
        `, [deckId, currentTimestamp]);

        // 2. Fetch the remaining new cards up to the daily limit
        const newCardsResult = remainingNewCards > 0 ? await db.select(`
            SELECT 
                c.*,
                GROUP_CONCAT(t.id) AS tag_ids,
                GROUP_CONCAT(t.name) AS tag_names
            FROM cards c
            LEFT JOIN card_tags ct ON c.id = ct.card_id
            LEFT JOIN tags t ON ct.tag_id = t.id
            WHERE c.deck_id = $1
            AND c.new = 1
            GROUP BY c.id
            ORDER BY c.next_review ASC
            LIMIT $2`,
            [deckId, remainingNewCards]) : [];

        // Process cards with tags
        const processCards = (cards: any) => {
            return cards.map((row: { [x: string]: any; tag_ids: string; tag_names: string }) => {
                const tagIds = row.tag_ids ? row.tag_ids.split(',').map(Number) : [];
                const tagNames = row.tag_names ? row.tag_names.split(',') : [];

                const tags = tagIds.map((id, index) => ({
                    id,
                    name: tagNames[index] || '' // Fallback to empty string if name is missing
                }));

                const { tag_ids, tag_names, ...cardData } = row;
                return {
                    ...cardData,
                    tags
                };
            });
        };

        const dueCardsWithTags = processCards(dueCardsResult);
        const newCardsWithTags = processCards(newCardsResult);

        return {
            status: 'ok',
            data: [...dueCardsWithTags, ...newCardsWithTags] // Return combined data
        };
    } catch (err: unknown) {
        return {
            status: 'error',
            message: `Failed to fetch due cards with tags: ${(err as Error).message}`
        };
    }
};



export default useGetDueCards;
