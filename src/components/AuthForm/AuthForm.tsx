import { ReactNode } from "react";
import "./scss/AuthForm.scss";
import { Overlay } from "../Overlay/Overlay";

type TypeProps = {
    authForm: {
        authFormIsOpen: boolean;
        setAuthFormIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    };
    title: string;
    children: ReactNode;
};

export const AuthForm = ({ authForm, title, children }: TypeProps): ReactNode => {
    return (
        <>
            {authForm.authFormIsOpen && <Overlay onClick={() => authForm.setAuthFormIsOpen(false)} />}
            <section className={`auth ${authForm.authFormIsOpen ? "auth_active" : ""}`}>
                <h2 className="auth__title">{title}</h2>
                <form className="auth__form">
                    {children}
                </form>
                <button className="auth__close-button" onClick={() => authForm.setAuthFormIsOpen(false)}>
                    ✕
                </button>
            </section>
        </>
    );
};