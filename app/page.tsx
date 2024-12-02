import Navbar from "@/components/UI/functional/Navbar";

export default function Home() {
  return (
    <main className="w-full flex flex-col">
      <Navbar pageTitle="Home" />

      <section className="p-[10px] h-full flex flex-col">
        {/* Welcome message */}
        <section className="mb-2">
          <h2 className="text-responsive-md font-semibold">Welcome Eben</h2>
          <p className="text-responsive-sm text-light">
            Ready to level up your language learning?
          </p>
        </section>

        {/* Panel Grid Layout */}
        <section className="grid grid-cols-1 gap-[10px] md:grid-cols-2 lg:grid-cols-2 xl11:grid-cols-3 h-full overflow-auto">
          {/* Weekly Study Time */}
          <section className="flex flex-col w-full rounded-md border border-white/5 p-[10px]">
            <span className="font-semibold">Weekly Study Time</span>

          </section>

          {/* Quick Start Panel */}
          <section className="flex flex-col w-full rounded-md border border-white/5 p-[10px]">
            <span className="font-semibold">Quick Start</span>
          </section>

          {/* Recent Activity Panel */}
          <section className="flex flex-col w-full rounded-md border border-white/5 p-[10px]">
            <span className="font-semibold">Recent Activity</span>
          </section>

          {/* Featured Deck Panel */}
          <section className="flex flex-col w-full rounded-md border border-white/5 p-[10px]">
            <span className="font-semibold">Featured Deck</span>
          </section>

          {/* Flashcard Progress Panel */}
          <section className="flex flex-col w-full rounded-md border border-white/5 p-[10px]">
            <span className="font-semibold">Flashcard Progress</span>
          </section>

          {/* Achievements */}
          <section className="flex flex-col w-full rounded-md border border-white/5 p-[10px]">
            <span className="font-semibold">Achievements</span>
          </section>
        </section>
      </section>
    </main>
  );
}
