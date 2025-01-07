interface ToastProps {
    text: string;
    position: "top" | "right" | "bottom" | "left";
}

const positionClasses = {
    top: "top-5 toast-animation-top",
    right: "right-5 top-1/2 transform -translate-y-1/2 toast-animation-right",
    bottom: "bottom-5 toast-animation-bottom",
    left: "left-5 top-1/2 transform -translate-y-1/2 toast-animation-left",
};

const Toast: React.FC<ToastProps> = ({ text, position }) => {
    const positionClass = positionClasses[position];

    return (
        <section
            className={`absolute ${positionClass} px-3 py-2 bg-background border border-light rounded-full text-medium z-10`}
        >
            {text}
        </section>
    );
};

export default Toast;