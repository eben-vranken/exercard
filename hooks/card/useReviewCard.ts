import { invoke } from "@tauri-apps/api/core";
import useUpdateCard from "./useUpdateCard";

interface UseGetCardsResponse {
    status: 'ok' | 'error';
    card?: Card;
    message?: string;
}

interface ReviewProps {
    card: Card;
    grade: number;
    algorithm: string;
}

const useReviewCard = async (card: Card, grade: number, algorithm: string): Promise<UseGetCardsResponse> => {
    try {
        const result: Card = await invoke(`review_${algorithm}`, { card, grade });

        if (result) {
            useUpdateCard({
                id: Number(card.id),
                grade: grade,
                next_review: new Date(result.next_review),
                easiness_factor: result.easiness_factor,
                interval: result.interval,
                repetition: result.repetition,
                stability: result.stability,
                retrievability: result.retrievability,
                difficulty: result.difficulty
            });
        }

        return { status: "ok" };
    } catch (error) {
        console.error("Error reviewing card:", error);
        return { status: "error", message: String(error) };
    }
};

export default useReviewCard;