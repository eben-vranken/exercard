import Navbar from "@/components/UI/functional/Navbar"

const createManual: React.FC = () => {
    return (
        <main className="w-full">
            <Navbar pageTitle="Create" />

            <section className="p-[10px] h-full flex flex-col">
                {/* Welcome message */}
                <section className="mb-2">
                    <h2 className="text-responsive-md font-semibold">Create manually</h2>
                    <p className="text-responsive-sm text-light">
                        Customize every detail of your deck by adding cards yourself.
                    </p>
                </section>
            </section>
        </main>
    )
}

export default createManual