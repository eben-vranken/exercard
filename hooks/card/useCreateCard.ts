import Database, { QueryResult } from "@tauri-apps/plugin-sql";

interface NewCard {
    deckId: number,
    front: string,
    back: string,
    tags: string[],
}

const useCreateCard = async (card: NewCard): Promise<{ status: string, message: string }> => {
    try {
        const db = await Database.load("sqlite:exercard.db");

        await db.execute("BEGIN TRANSACTION");

        // Insert the card
        const result = await db.execute(
            "INSERT INTO cards (deck_id, front, back, next_review) VALUES ($1, $2, $3, $4)",
            [
                card.deckId,
                card.front,
                card.back,
                Math.floor(Date.now() / 1000)
            ]
        );

        const cardId = result.lastInsertId;

        // Ensure the card was successfully inserted before continuing
        if (!cardId) {
            throw new Error("Failed to insert card.");
        }

        for (const tagName of card.tags) {
            const tagInsertResult = await db.execute(
                `INSERT OR IGNORE INTO tags (name) VALUES ($1)`,
                [tagName]
            );

            const tagResult: any = await db.select(
                "SELECT id FROM tags WHERE name = $1",
                [tagName]
            );

            const tagId = tagResult[0].id;

            if (!tagId) {
                console.error(`Tag '${tagName}' could not be found.`);
                continue;
            }
            await db.execute(
                "INSERT INTO card_tags (card_id, tag_id) VALUES ($1, $2)",
                [cardId, tagId]
            );
        }

        await db.execute("COMMIT");

        return { status: 'ok', message: 'Card created successfully.' };
    } catch (err: unknown) {
        console.error('Card creation error:', err);
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to create card: ${err.message}` };
        }
        return { status: 'error', message: 'An unknown error occurred when creating card.' };
    }
}

export default useCreateCard;
