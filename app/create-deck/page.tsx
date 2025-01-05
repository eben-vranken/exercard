import Navbar from "@/components/UI/functional/Navbar"
import { Gavel, Sparkle } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

const Create: React.FC = () => {
    return (
        <main className="w-full flex flex-col">
            <Navbar />

            <section className="p-[10px] h-full flex flex-col">
                <section className="mb-2">
                    <h2 className="text-responsive-md font-semibold">Start building your deck</h2>
                    <p className="text-responsive-sm text-light">
                        Every great achievement starts with a single step.
                    </p>
                </section>

                {/* Creation Options */}
                <section className="h-full flex flex-col lg:flex-row flex-wrap justify-center items-center gap-[10px]">
                    {/* Manually */}
                    <Link href={'/create-deck/manual'} className="w-full lg:w-[45%] h-2/5 flex flex-col gap-y-2 justify-center items-center rounded border border-light hover:bg-white/[1%] cursor-pointer">
                        <section className="flex items-center gap-x-2">
                            <Gavel size={25} className="text-primary" />
                            <span className="text-sm text-light font-semibold">Create manually</span>
                        </section>
                        <span className="text-xs text-ultralight">Make your deck yourself</span>
                    </Link>

                    {/* AI */}
                    <section className="w-full lg:w-[45%] h-2/5 flex gap-y-2 flex-col justify-center items-center rounded border border-light hover:bg-white/[1%] cursor-not-allowed">
                        <section className="flex items-center gap-x-2">
                            <Sparkle size={25} className="text-primary" />
                            <span className="text-sm text-light font-semibold">Create with AI</span>
                        </section>
                        <span className="text-xs text-ultralight">Under construction</span>
                    </section>
                </section>

            </section>
        </main>
    )
}

export default Create