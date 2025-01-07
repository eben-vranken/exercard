import Navbar from "@/components/UI/functional/Navbar";

const Settings: React.FC = () => {
    return (
        <section className="w-full flex flex-col">
            <Navbar pageTitle="Settings" />

            <section className="mb-2 p-[10px]">
                <h2 className="text-responsive-md font-semibold">Settings</h2>
                <p className="text-responsive-sm text-light">
                    Adjust your preferences here.
                </p>
            </section>
        </section>
    )
}

export default Settings;