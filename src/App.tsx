import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { MainPage } from "./components/MainPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProblemsPage } from "./components/ProblemsPage";
import { Main } from "./components/Main/Main";
import { Header } from "./components/Header/Header";
import { ProfilePage } from "./components/ProfilePage";
import { RequestsPage } from "./components/RequstsPage";
import { NewRequestPage } from "./components/NewRequestPage";
import { postData } from "./api/Data";
import { endpoints_auth } from "./api/config";
import { getJWT } from "./helpers/jwtHelper";
import { TypeDataToComePost } from "./api/types/RequestTypes";
import { TypeUser } from "./api/types/DatabaseTypes";
import "./App.scss";

export const App = (): ReactNode => {
    const [isAuthorized, setIsAuthorized]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
    const [user, setUser]: [TypeUser, Dispatch<SetStateAction<TypeUser>>] = useState({} as TypeUser);
    const [jwt, setJwt]: [string, Dispatch<SetStateAction<string>>] = useState("");

    useEffect(() => {
        const title: HTMLHeadElement = document.querySelector("title") as HTMLHeadElement;
        title.textContent = "Городские проблемы";

        const head: HTMLElement = document.querySelector("head") as HTMLElement;
        const link: HTMLLinkElement = document.createElement("link");
        link.rel = "icon";
        link.type = "image/svg+xml";
        link.href = "../img/1476434895129645719.jpg";

        head.appendChild(link);
    }, []);

    useEffect(() => {
        setJwt(getJWT());
    }, [])

    useEffect(() => {
        async function checkAuth(): Promise<void> {
            if (!jwt) {
                setUser({} as TypeUser);
                setIsAuthorized(false);
                return;
            }

            const user: TypeDataToComePost = await postData(
                endpoints_auth.me,
                {
                    login: "",
                    password: "",
                },
                jwt
            );

            if (user instanceof Error) return;

            setUser(user as TypeUser);
            setIsAuthorized(true);
        }

        checkAuth();
    }, [jwt]);

    const PageNotFound = (): ReactNode => <h1>Страница не найдена</h1>;
    return (
        <Router>
            <Header auth={{ isAuthorized, setIsAuthorized }} user={user} setJwt={setJwt}/>
            <Main>
                <Routes>
                    <Route path="/" Component={MainPage} />
                    <Route path="/problems" element={<ProblemsPage isAuthorized={isAuthorized} />} />
                    <Route path="/me" Component={ProfilePage} />
                    <Route path="/me/requests" Component={RequestsPage} />
                    <Route path="/me/new-request" Component={NewRequestPage} />
                    <Route path="*" Component={PageNotFound} />
                </Routes>
            </Main>
        </Router>
    );
};

export default App;
