import React, {useEffect, useState} from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { format } from "date-fns";
import axios from "axios";
import toastr from "toastr";

import {HiMoon, HiSun} from "react-icons/hi";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from './context/Auth';

import './styles.css';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [cookies, setCookie] = useCookies(['darkMode']);

    const location = useLocation();

    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:8080/api';

    useEffect(() => {
        const storedDarkMode = cookies.darkMode === true;
        setIsDarkMode(storedDarkMode);
    }, []);

    useEffect(() => {
        const title = "Chat App";
        const matchedRoute = routes.find(route => route.path === location.pathname);
        const componentName = matchedRoute ? getComponentName(matchedRoute.element) : "Not Found";
        document.title = `${title} | ${componentName}`;
    }, [location.pathname]);

    const routes = [
        { path: "/", element: <Home /> },
        { path: "/chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
        { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: "*", element: <NotFound /> }
    ];

    const getComponentName = (element) => {
        if (element.type === ProtectedRoute) {
            return getComponentName(element.props.children);
        } else {
            return element.type.name;
        }
    };

    const toggleMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            setCookie('darkMode', newMode.toString(), { path: '/', maxAge: 60 * 60 * 24 * 400 });
            return newMode;
        });
    };

    return (
        <>
            <div className={isDarkMode ? 'dark' : ''}>
                <AuthProvider>
                    <Navbar/>

                    <Routes>
                        {routes.map(({path, element}) => (
                            <Route key={path} path={path} element={element}/>
                        ))}
                    </Routes>
                </AuthProvider>
                <div
                    className="fixed bottom-5 right-5 rounded-full p-2 bg-gray-300 dark:bg-gray-800 shadow-lg cursor-pointer"
                    onClick={toggleMode}
                    style={{userSelect: 'none'}}
                >
                    {isDarkMode ? <HiSun size={24} color="#FBBF24"/> : <HiMoon size={24} color="#FBBF24"/>}
                </div>

                <footer className="bg-zinc-900 text-white text-center p-4">
                    <p>&copy; {format(new Date(), "yyyy")} - Chat App</p>
                </footer>
            </div>
        </>
    );
}

export default App;