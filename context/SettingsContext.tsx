import React, { createContext, useContext, useEffect, useState } from 'react';
import useGetAllSettings from '@/hooks/settings/useGetAllSettings';
import useSetSettings from '@/hooks/settings/useSetSettings';

interface UserSettings {
    dailyCardLimit: number;
    username: string;
}

interface SettingsContextProps {
    settings: UserSettings | null;
    loading: boolean;
    error: string | null;
    updateSettings: (newSettings: { [key: string]: string | number }) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const response = await useGetAllSettings();
            if (response.status === 'ok') {
                const settingsMap: Record<string, any> = {};
                response.settings?.forEach((setting: Setting) => {
                    settingsMap[setting.key] = setting.value;
                });
                const userSettings: UserSettings = {
                    dailyCardLimit: parseInt(settingsMap['daily_card_limit'], 10),
                    username: settingsMap['user_name'],
                };
                setSettings(userSettings);
            } else {
                setError(response.message || 'An unknown error occurred when fetching settings');
            }
            setLoading(false);
        };

        fetchSettings();
    }, []);

    const updateSettings = async (newSettings: { [key: string]: string | number }) => {
        const response = await useSetSettings(newSettings);
        if (response.status === 'ok') {
            const settingsMap: Record<string, any> = {};
            response.settings?.forEach((setting: Setting) => {
                settingsMap[setting.key] = setting.value;
            });
            const userSettings: UserSettings = {
                dailyCardLimit: parseInt(settingsMap['daily_card_limit'], 10),
                username: settingsMap['user_name'],
            };
            setSettings(userSettings);
        } else {
            setError(response.message || 'An unknown error occurred when updating settings');
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, error, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};