import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import React from "react";

interface PostReviewAnalyticsProps {
    reviews: CardWithTags[];
    deckId: number;
}

const PostReviewAnalytics: React.FC<PostReviewAnalyticsProps> = ({ reviews, deckId }) => {

    return (
        <section className="flex flex-col h-full w-full overflow-y-scroll pb-14 p-12 gap-y-6">
            {/* Back Button */}
            <Link href={`/deck?deckId=${deckId}`} className="flex items-center gap-x-2">
                <ArrowLeft />
                <span>Back</span>
            </Link>

            {/* Statistics */}
            <section className="flex justify-between gap-x-6">
                {/* Performance Summary */}
                <section className="flex flex-1 justify-center border border-light">
                    <h1>Performance Summary</h1>
                    {/* Numbers of cards reviewed */}

                    {/* Correct/Incorrect responses */}
                </section>

                {/* Review Time */}
                <section className="flex flex-1 justify-center border border-light">
                    <h1>Review Time</h1>
                    {/* Average time per card */}

                    {/* Time spent reviewing */}
                </section>

                {/* Retention Metrics */}
                <section className="flex flex-1 justify-center border border-light">
                    <h1>Retention Metrics</h1>
                    {/* Average grade */}

                    {/* Retention rate */}
                </section>
            </section>

            <hr className="w-full my-2 border-light" />

            {/* All Reviews */}
            <section className="grid grid-cols-1 md:grid-cols-3 w-full gap-6">
                {
                    reviews.map((review, index) => {
                        let cardBackground;

                        switch (review.grade) {
                            case 1:
                                cardBackground = "red";
                                break;
                            case 2:
                                cardBackground = "orange";
                                break;
                            case 3:
                                cardBackground = "yellow";
                                break;
                            case 4:
                                cardBackground = "green";
                                break;
                            case 5:
                                cardBackground = "blue";
                        }

                        return (
                            <section
                                className={`relative flex flex-col items-center justify-center gap-y-6 p-4 w-full min-h-[200px] max-w-sm mx-auto border border-light rounded ${cardBackground}`}
                                key={index}
                            >
                                <span className="absolute top-4 left-4 text-ultralight font-light">{index + 1}</span>
                                <span className="absolute top-4 right-4 text-ultralight">Grade: {review.grade}</span>

                                <span className="font-semibold text-center text-lg">
                                    {review.front}
                                </span>

                                <span className="text-light text-center">
                                    {review.back}
                                </span>
                            </section>
                        );
                    })
                }
            </section>
        </section>
    )
};

export default PostReviewAnalytics;
