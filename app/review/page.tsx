import CardReview from "@/components/UI/functional/card/CardReview";
import Navbar from "@/components/UI/functional/Navbar";
import { Suspense } from "react";

const Review: React.FC = () => {
    return (
        <section className="w-full h-full flex flex-col">
            <Navbar />

            <Suspense fallback={<section>Loading...</section>}>
                <CardReview />
            </Suspense>
        </section>
    )
}

export default Review;