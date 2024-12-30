import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import React from "react";

interface PostReviewAnalyticsProps {
    reviews: { [key: number]: number };
    deckId: string;
}

const PostReviewAnalytics: React.FC<PostReviewAnalyticsProps> = ({ reviews, deckId }) => {
    const totalReviews = Object.values(reviews).reduce((acc, count) => acc + count, 0);
    const averageGrade = totalReviews
        ? Object.entries(reviews).reduce((acc, [grade, count]) => acc + Number(grade) * count, 0) / totalReviews
        : 0;

    return (
        <section className="h-full w-full p-5">
            <section className="flex justify-between items-center gap-x-5 mb-5 w-fit">
                <h1 className="font-bold">Review Analytics</h1>
                <Link href={`/deck?deckId=${deckId}`} className="flex items-center hover:text-light underline">
                    Back
                </Link>
            </section>
            <section className="flex flex-col gap-y-3">
                <section>
                    <h2>
                        Total Reviews: <span className="text-light">
                            {totalReviews}
                        </span>
                    </h2>
                    <h3>
                        Average Grade: <span className="text-light">
                            {averageGrade.toFixed(2)}
                        </span>
                    </h3>
                </section>
                <section>
                    {Object.entries(reviews).map(([grade, count]) => (
                        <p key={grade}>
                            Grade {grade}: <span className="text-light">
                                {count} reviews
                            </span>
                        </p>
                    ))}
                </section>
            </section>
        </section >
    );
};

export default PostReviewAnalytics;
