import Navbar from "@/components/UI/functional/Navbar";

const Page: React.FC = () => {
    return (
        <section className="w-full">
            <Navbar back pageTitle="404" />

            <section className="p-[10px] h-full flex flex-col">
                {/* Welcome message */}
                <section className="mb-2">
                    <h2 className="text-responsive-md font-semibold">Page Not found</h2>
                    <p className="text-responsive-sm text-light">
                        How did you end up here?
                    </p>
                </section>
            </section>
        </section>
    )
}

export default Page;