import Navbar from "@/components/UI/functional/Navbar";

export default function Home() {
  return (
    <section className="w-full flex flex-col h-screen">
      <Navbar pageTitle="Home" />

      <section className="p-[10px] h-full flex flex-col">
        {/* Welcome message */}
        <section className="mb-2">
          <h2 className="text-responsive-md font-semibold">Welcome Eben</h2>
          <p className="text-responsive-sm text-light">
            Ready to level up your language learning?
          </p>
        </section>

        {/* Panel Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[10px] h-full">
          <section className="grid grid-rows-2 gap-[10px]">
            <section className="rounded-md border border-white/5  p-[10px] flex flex-col justify-between h-full relative overflow-hidden">
              <span className="font-semibold text-responsive-lg">
                Streak
              </span>
            </section>
            <section className="rounded-md border border-white/5  p-[10px] flex flex-col justify-between h-full relative overflow-hidden">
              <span className="font-semibold text-responsive-lg">
                Weakly Study Time
              </span>
            </section>
          </section>

          <section className="rounded-md border border-white/5  p-[10px] flex flex-col justify-between h-full relative overflow-hidden">
            <span className="font-semibold text-responsive-lg">
              Quick Start
            </span>
          </section>

          <section className="rounded-md border border-white/5  p-[10px] flex flex-col justify-between h-full relative overflow-hidden">
            <span className="font-semibold text-responsive-lg">
              Recent Activity
            </span>
          </section>

          <section className="rounded-md border border-white/5  p-[10px] flex flex-col justify-between h-full relative overflow-hidden">
            <span className="font-semibold text-responsive-lg">
              Featured Deck
            </span>
          </section>
          <section className="rounded-md border border-white/5  p-[10px] flex flex-col justify-between h-full relative overflow-hidden">
            <span className="font-semibold text-responsive-lg">
              Flashcard Progress
            </span>
          </section>

          <section className="rounded-md border border-white/5  p-[10px] flex flex-col justify-between h-full relative overflow-hidden">
            <span className="font-semibold text-responsive-lg">

            </span>
          </section>
        </section>


      </section>
    </section>
  );
}
