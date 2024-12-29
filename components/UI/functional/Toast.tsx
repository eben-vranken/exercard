interface ToastProps {
    text: string;
}

const Toast: React.FC<ToastProps> = ({ text }) => {
    return (
        <section className="absolute top-5 px-3 py-2 bg-background border border-white/10 rounded-full text-medium toast-animation">
            {text}
        </section>
    );
}

export default Toast;