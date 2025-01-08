'use client';

import Navbar from "@/components/UI/functional/Navbar";

const Settings: React.FC = () => {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    }

    return (
        <section className="w-full flex flex-col">
            <Navbar pageTitle="Settings" />

            {/* Settings Form */}
            <form onSubmit={handleSubmit} className="p-[10px]">

                <section className="mb-2 p-[10px] flex justify-between items-center">
                    <section>
                        <h1 className="text-responsive-md font-semibold">Settings</h1>
                        <p className="text-responsive-sm text-light">
                            Adjust your preferences here.
                        </p>
                    </section>

                    {/* Save button */}
                    <button type="submit" className="styled-button">
                        Save
                    </button>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-scroll">
                    {/* User profile settings */}
                    <section className="flex flex-col gap-y-2 p-3 border border-light rounded cursor-not-allowed opacity-50">
                        <h2 className="text-responsive-md font-semibold">
                            User Profile
                        </h2>

                        <section className="flex items-center justify-between gap-y-2 pointer-events-none">
                            <label htmlFor="user-name" className="text-responsive-sm">Username:</label>
                            <input type="text" id="user-name" className="styled-input" />
                        </section>
                    </section>

                    {/* Spaced-repetition settings */}
                    <section className="flex flex-col gap-y-2 p-3 border border-light rounded">
                        <h2 className="text-responsive-md font-semibold">
                            Spaced Repetition
                        </h2>

                        <section className="flex items-center justify-between gap-y-2">
                            <label htmlFor="user-name" className="text-responsive-sm">Daily new card limit:</label>
                            <input type="number" id="daily-card-limit" min={1} className="styled-input text-right [&::-webkit-inner-spin-button]:appearance-none" />
                        </section>
                    </section>

                    {/* Appearance settings */}
                    <section className="flex flex-col gap-y-2 p-3 border border-light rounded cursor-not-allowed opacity-50">
                        <h2 className="text-responsive-md font-semibold">
                            Appearance
                        </h2>

                        <section className="flex items-center justify-between gap-y-2 pointer-events-none">
                            <label htmlFor="user-name" className="text-responsive-sm">Primary color:</label>
                            <input type="text" id="user-name" className="styled-input" />
                        </section>
                    </section>
                </section>
            </form>
        </section>
    )
}

export default Settings;