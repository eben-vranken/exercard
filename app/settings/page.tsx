'use client';

import Navbar from "@/components/UI/functional/Navbar";
import useGetAllSettings from "@/hooks/settings/useGetAllSettings";
import useSetSettings from "@/hooks/settings/useSetSettings";
import { useEffect } from "react";

const Settings: React.FC = () => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData: { [key: string]: string | number } = {};

        const formElements = e.target as HTMLFormElement;
        for (const element of formElements.elements) {
            if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
                formData[element.name || element.id] = element.value;
            }
        }

        // Send the form data to the useSetSettings hook
        const result = await useSetSettings(formData);

        if (result.status === 'ok') {
            console.log("Settings updated successfully!");
        } else {
            console.error("Failed to update settings:", result.message);
        }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            const result = await useGetAllSettings();

            if (result.settings && result.settings.length > 0) {
                result.settings.forEach((setting) => {
                    const element = document.querySelector(
                        `[name=${setting.key}], [id=${setting.key}]`
                    ) as HTMLInputElement | HTMLSelectElement;

                    if (element.type === 'number' || element.type === 'text') {
                        element.value = setting.value;
                    }
                })
            }
        }

        fetchSettings();
    }, []);

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
                    <section className="flex flex-col gap-y-2 p-3 border border-light rounded">
                        <h2 className="text-responsive-md font-semibold">
                            User Profile
                        </h2>

                        <section className="flex items-center justify-between gap-y-2">
                            <label htmlFor="user_name" className="text-responsive-sm">Username:</label>
                            <input type="text" id="user_name" className="styled-input" />
                        </section>
                    </section>

                    {/* Spaced-repetition settings */}
                    <section className="flex flex-col gap-y-2 p-3 border border-light rounded">
                        <h2 className="text-responsive-md font-semibold">
                            Spaced Repetition
                        </h2>

                        <section className="flex items-center justify-between gap-y-2">
                            <label htmlFor="daily_card_limit" className="text-responsive-sm">Daily new card limit:</label>
                            <input type="number" id="daily_card_limit" name="daily_card_limit" min={1} className="styled-input text-right [&::-webkit-inner-spin-button]:appearance-none" />
                        </section>
                    </section>

                    {/* Appearance settings */}
                    <section className="flex flex-col gap-y-2 p-3 border border-light rounded cursor-not-allowed opacity-50">
                        <h2 className="text-responsive-md font-semibold">
                            Appearance
                        </h2>

                        <section className="flex items-center justify-between gap-y-2 pointer-events-none">
                            <label htmlFor="primary_color" className="text-responsive-sm">Primary color:</label>
                            <input type="color" id="primary_color" className="styled-input" />
                        </section>
                    </section>
                </section>
            </form>
        </section>
    )
}

export default Settings;