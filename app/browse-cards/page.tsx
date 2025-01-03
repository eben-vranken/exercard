import BrowseCards from "@/components/UI/functional/card/BrowseCards";
import Navbar from "@/components/UI/functional/Navbar"
import { Suspense } from "react"

const Browse: React.FC = () => {
    return (
        <main className="w-full flex flex-col">
            <Navbar />

            <section className="p-[10px] h-full flex flex-col">
                <section className="mb-2 ">
                    <h2 className="text-responsive-md font-semibold">Browse Cards</h2>
                    <p className="text-responsive-sm text-light">
                        Find what you're looking for?
                    </p>
                </section>

                <Suspense>
                    <BrowseCards />
                </Suspense>
            </section>
        </main>
    )
}

export default Browse;