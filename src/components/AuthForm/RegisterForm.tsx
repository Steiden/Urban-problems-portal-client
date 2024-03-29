import { FormEvent, FormEventHandler, ReactNode, useEffect, useState } from "react";
import { AuthForm } from "./AuthForm";
import { TypeUserFromServer } from "../../api/users/UsersTypes";
import { signUp } from "../../api/auth/Auth";

type TypeProps = {
    registerForm: {
        registerFormIsOpen: boolean;
        setRegisterFormIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    };
};

export const RegisterForm = ({ registerForm }: TypeProps): ReactNode => {
    // ___________Данные для регистрации____________
    const [fio, setFio] = useState("");
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [consentIsChecked, setConsentIsChecked] = useState(true);
    // _____________________________________________


    // __________Корректность введенных данных____________
    const [isCorrectFio, setIsCorrectFio] = useState(true);
    const [isCorrectLogin, setIsCorrectLogin] = useState(true);
    const [isCorrectEmail, setIsCorrectEmail] = useState(true);
    const [isCorrectPassword, setIsCorrectPassword] = useState(true);
    const [isCorrectPasswordCheck, setIsCorrectPasswordCheck] = useState(true);
    // ____________________________________________________

    // ___________Проверка корректности введенных данных____________
    useEffect(() => {
        if (fio !== "" && fio.trim().split(" ").length !== 3) {
            setIsCorrectFio(false);
            return;
        } else setIsCorrectFio(true);

        // TODO Сделать проверку на занятость логина (Это надо БД использовать)
        setIsCorrectLogin(true);

        // TODO Сделать проверку на занятость почты (Это надо БД использовать)
        setIsCorrectEmail(true);

        if (password !== "" && password.length < 8) {
            setIsCorrectPassword(false);
            return;
        } else setIsCorrectPassword(true);

        if (passwordCheck !== "" && password !== passwordCheck) {
            setIsCorrectPasswordCheck(false);
            return;
        } else setIsCorrectPasswordCheck(true);
    }, [fio, login, email, password, passwordCheck, consentIsChecked]);
    // ______________________________________________________________


    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: FormEvent) => {
        e.preventDefault();

        const user: TypeUserFromServer | Error = await signUp({
            second_name: fio.split(" ")[0],
            first_name: fio.split(" ")[1],
            patronymic: fio.split(" ")[2],
            login: login,
            email: email,
            password: password,
        });

        if(user instanceof Error) return;

        registerForm.setRegisterFormIsOpen(false);
    }

    return (
        <AuthForm
            authForm={{
                authFormIsOpen: registerForm.registerFormIsOpen,
                setAuthFormIsOpen: registerForm.setRegisterFormIsOpen,
            }}
            title="Регистрация"
            onSubmit={handleSubmit}>
            <div className="auth__input-container">
                <input
                    className="auth__input"
                    type="text"
                    name="fio"
                    placeholder="ФИО"
                    maxLength={100}
                    required
                    value={fio}
                    onChange={(e) => setFio(e.target.value)}
                />
                {!isCorrectFio && <span className="auth__input-error">*Проверьте корректность ФИО</span>}
            </div>
            <div className="auth__input-container">
                <input
                    className="auth__input"
                    type="text"
                    name="login"
                    placeholder="Логин"
                    maxLength={30}
                    required
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                {!isCorrectLogin && <span className="auth__input-error">*Данный логин уже занят</span>}
            </div>
            <div className="auth__input-container">
                <input
                    className="auth__input"
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    maxLength={64}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {!isCorrectEmail && <span className="auth__input-error">*Данный e-mail уже занят</span>}
            </div>
            <div className="auth__input-container">
                <input
                    className="auth__input"
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    maxLength={64}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {!isCorrectPassword && (
                    <span className="auth__input-error">*Пароль должен содержать не менее 8 символов</span>
                )}
            </div>
            <div className="auth__input-container">
                <input
                    className="auth__input"
                    type="password"
                    placeholder="Повторите пароль"
                    maxLength={64}
                    required
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                />
                {!isCorrectPasswordCheck && <span className="auth__input-error">*Пароли не совпадают</span>}
            </div>
            <div className="auth__checkbox-container">
                <input
                    className="auth__checkbox"
                    type="checkbox"
                    name="consent"
                    id="consent"
                    checked={consentIsChecked}
                    onChange={() => setConsentIsChecked(!consentIsChecked)}
                />
                <label className="auth__label" htmlFor="consent">
                    Согласие на обработку персональных данных
                </label>
            </div>
            <button
                className="auth__button"
                type="submit"
                disabled={
                    !isCorrectFio ||
                    !isCorrectLogin ||
                    !isCorrectEmail ||
                    !isCorrectPassword ||
                    !isCorrectPasswordCheck ||
                    !consentIsChecked
                }>
                Зарегистрироваться
            </button>
        </AuthForm>
    );
};
