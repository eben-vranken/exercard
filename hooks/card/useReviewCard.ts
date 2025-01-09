import { invoke } from "@tauri-apps/api/core";
import useUpdateCard from "./useUpdateCard";
import Database from "@tauri-apps/plugin-sql";

interface UseGetCardsResponse {
    status: 'ok' | 'error';
    card?: Card;
    next_review?: number;
    message?: string;
}

interface ReviewProps {
    card: Card;
    grade: number;
    algorithm: string;
    deckId: number;
}

const useReviewCard = async (card: Card, grade: number, algorithm: string, deckId: number): Promise<UseGetCardsResponse> => {
    try {
        const result: Card = await invoke(`review_${algorithm}`, { card, grade });

        if (result) {
            switch (algorithm) {
                case "sm2":
                    useUpdateCard({
                        id: Number(card.id),
                        easiness_factor: result.easiness_factor,
                        interval: result.interval,
                        repetition: result.repetition,
                        next_review: new Date(result.next_review),
                        grade: grade,
                        new: 0
                    });
                    break;
            }

            const db = await Database.load("sqlite:exercard.db");

            await db.execute(`
                UPDATE decks
                SET
                    last_review_date = CASE
                        WHEN last_review_date != strftime('%s', 'now', 'start of day') THEN strftime('%s', 'now', 'start of day')
                        ELSE last_review_date
                    END,
                    new_cards_reviewed_today = CASE
                        WHEN last_review_date != strftime('%s', 'now', 'start of day') THEN 0
                        ELSE new_cards_reviewed_today + 1
                    END
                WHERE id = $1;
            `, [deckId]);

            return { status: "ok", next_review: result.next_review };
        }
    } catch (error) {
        console.error("Error reviewing card:", error);
        return { status: "error", message: String(error) };
    }
    return { status: "error", message: "Unknown error" };
};

export default useReviewCard;
