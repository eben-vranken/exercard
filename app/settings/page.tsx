'use client'

import Navbar from "@/components/UI/functional/Navbar";
import useGetAllSettings from "@/hooks/settings/useGetAllSettings";
import useSetSettings from "@/hooks/settings/useSetSettings";
import { useState, useEffect } from "react";
import Toast from "@/components/UI/functional/Toast";

const Settings: React.FC = () => {
    const [initialSettings, setInitialSettings] = useState<{ [key: string]: string | number }>({});
    const [isChanged, setIsChanged] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; text: string }>({ visible: false, text: "" });

    const showToast = (text: string, duration = 3000) => {
        setToast({ visible: true, text });
        setTimeout(() => setToast({ visible: false, text: "" }), duration);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData: { [key: string]: string | number } = {};

        const formElements = e.target as HTMLFormElement;
        for (const element of formElements.elements) {
            if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
                formData[element.name || element.id] = element.value;
            }
        }

        const result = await useSetSettings(formData);

        if (result.status === "ok") {
            showToast("Settings saved successfully!");
            setInitialSettings(formData); // Update initial settings after successful save
            setIsChanged(false); // Reset the "changed" state
        } else {
            showToast("Failed to update settings. Please try again.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setIsChanged(
            Object.keys(initialSettings).some(
                (key) => key === name && initialSettings[key] !== value
            )
        );
    };

    useEffect(() => {
        const fetchSettings = async () => {
            const result = await useGetAllSettings();

            if (result.settings && result.settings.length > 0) {
                const settingsMap: { [key: string]: string | number } = {};
                result.settings.forEach((setting) => {
                    settingsMap[setting.key] = setting.value;

                    const element = document.querySelector(
                        `[name=${setting.key}], [id=${setting.key}]`
                    ) as HTMLInputElement | HTMLSelectElement;

                    if (element && (element.type === "number" || element.type === "text")) {
                        element.value = setting.value;
                    }
                });

                setInitialSettings(settingsMap); // Store initial settings
            }
        };

        fetchSettings();
    }, []);

    return (
        <section className="w-full flex flex-col">
            <Navbar pageTitle="Settings" />

            <form onSubmit={handleSubmit} className="p-[10px]">
                <section className="mb-2 p-[10px] flex justify-between items-center">
                    <section>
                        <h1 className="text-responsive-md font-semibold">Settings</h1>
                        <p className="text-responsive-sm text-light">
                            Adjust your preferences here.
                        </p>
                    </section>

                    {/* Save button */}
                    <button
                        type="submit"
                        className={`styled-button ${!isChanged ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!isChanged}
                    >
                        Save
                    </button>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-scroll">
                    {/* User profile settings */}
                    <section className="flex flex-col gap-y-2 p-3 border border-light rounded">
                        <h2 className="text-responsive-md font-semibold">User Profile</h2>

                        <section className="flex items-center justify-between gap-y-2">
                            <label htmlFor="user_name" className="text-responsive-sm">
                                Username:
                            </label>
                            <input
                                type="text"
                                id="user_name"
                                name="user_name"
                                className="styled-input"
                                onChange={handleInputChange}
                            />
                        </section>
                    </section>

                    {/* Spaced-repetition settings */}
                    <section className="flex flex-col gap-y-2 p-3 border border-light rounded">
                        <h2 className="text-responsive-md font-semibold">
                            Spaced Repetition
                        </h2>

                        <section className="flex items-center justify-between gap-y-2">
                            <label
                                htmlFor="daily_card_limit"
                                className="text-responsive-sm"
                            >
                                Daily new card limit:
                            </label>
                            <input
                                type="number"
                                id="daily_card_limit"
                                name="daily_card_limit"
                                min={1}
                                className="styled-input text-right [&::-webkit-inner-spin-button]:appearance-none"
                                onChange={handleInputChange}
                            />
                        </section>
                    </section>
                </section>
            </form>

            {/* Toast */}
            <section className="w-full flex justify-center">
                {toast.visible && <Toast text={toast.text} position="top" />}
            </section>
        </section>
    );
};

export default Settings;
