import { invoke } from "@tauri-apps/api/core";
import useUpdateCard from "./useUpdateCard";

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
}

const useReviewCard = async (card: Card, grade: number, algorithm: string): Promise<UseGetCardsResponse> => {
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
                    });
                    break;
            }

            return { status: "ok", next_review: result.next_review };
        }
    } catch (error) {
        console.error("Error reviewing card:", error);
        return { status: "error", message: String(error) };
    }
    return { status: "error", message: "Unknown error" };
};

export default useReviewCard;