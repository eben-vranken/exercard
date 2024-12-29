import Database from "@tauri-apps/plugin-sql";

interface UpdateCardProps {
    id: number;
    deckId?: number;
    front?: string;
    back?: string;
    retrievability?: number;
    stability?: number;
    difficulty?: number;
    repetition?: number;
    easiness_factor?: number;
    interval?: number;
    grade?: number;
    next_review?: number | Date;
}

const useUpdateCard = async (card: UpdateCardProps): Promise<void> => {
    const db = await Database.load("sqlite:decks.db");

    if (card.next_review instanceof Date) {
        card.next_review = card.next_review.getTime();
    }

    const fields = Object.keys(card).filter(key => key !== 'id');
    const values = fields.map(field => card[field as keyof UpdateCardProps]);

    const setClause = fields.map(field => `${field} = ?`).join(", ");
    const query = `UPDATE cards SET ${setClause} WHERE id = ?`;

    try {
        await db.execute(query, [...values, card.id]);
    } catch (error) {
        console.error("Error updating card:", error);
    }
};

export default useUpdateCard;
