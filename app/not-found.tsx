import Navbar from "@/components/UI/functional/Navbar";

const Page: React.FC = () => {
    return (
        <section className="w-full">
            <Navbar pageTitle="Page Not Found" />

            <section className="p-[10px] h-full flex flex-col">
                {/* Welcome message */}
                <section className="mb-2">
                    <h2 className="text-responsive-md font-semibold">404 Not found</h2>
                    <p className="text-responsive-sm text-light">
                        How did you end up here?
                    </p>
                </section>
            </section>
        </section>
    )
}

export default Page;