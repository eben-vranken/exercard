import Navbar from "@/components/UI/functional/Navbar"

const Create: React.FC = () => {
    return (
        <main className="w-full">
            <Navbar pageTitle="Create" />

            <section className="p-[10px] h-full flex flex-col">
                {/* Welcome message */}
                <section className="mb-2">
                    <h2 className="text-responsive-md font-semibold">Start building your deck</h2>
                    <p className="text-responsive-sm text-light">
                        Every great achievement starts with a single step.
                    </p>


                </section>
            </section>
        </main>
    )
}

export default Create