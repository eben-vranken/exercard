import React from "react";

interface ConfirmModalProps {
    title: string;
    description: string;
    onClose: (result: boolean) => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, description, onClose }) => {
    return (
        <section className="absolute top-1/2 left-1/2 w-1/4 flex flex-col gap-y-6 h-min bg-background border border-light rounded p-3 transform -translate-x-1/2 -translate-y-1/2">
            <section>
                <h2 className="text-responsive-md font-semibold">{title}</h2>
                <p className="text-responsive-sm text-light">{description}</p>
            </section>

            <section className="flex gap-x-2 text-medium">
                <button
                    className="flex items-center bg-[#7FB069] rounded p-1 cursor-pointer hover:opacity-75 text-sm"
                    onClick={() => onClose(true)}
                >
                    Confirm
                </button>
                <button
                    className="flex items-center bg-[#D1462F] rounded p-1 cursor-pointer hover:opacity-75 text-sm"
                    onClick={() => onClose(false)}
                >
                    Cancel
                </button>
            </section>
        </section>
    );
};

export default ConfirmModal;
