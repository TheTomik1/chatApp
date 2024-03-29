import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";

import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";

import { useAuth } from "../context/Auth";

const Navbar = () => {
    const { isLoggedIn, loggedInUserProfilePicture } = useAuth();

    const [showRegistration, setShowRegistration] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const [navbarOpen, setNavbarOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/logout", null);
            navigate(0);
        } catch (error) {
            toast("Error logging out. Try again later.", { type: "error" });
        }
    };

    const handleRegistrationOpen = () => {
        setShowRegistration(true);
    };

    const handleRegistrationClose = () => {
        setShowRegistration(false);
    };

    const handleLoginOpen = () => {
        setShowLogin(true);
    };

    const handleLoginClose = () => {
        setShowLogin(false);
    };

    const toggleNavbar = () => {
        setNavbarOpen(!navbarOpen);
    };

    return (
        <nav className="bg-zinc-300 dark:bg-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img
                                src={require("../images/chat.png")}
                                alt={"LOGO"}
                                className="h-16 rounded"
                            />
                        </Link>
                    </div>
                    <div className="md:hidden">
                        <button onClick={toggleNavbar} className="text-black dark:text-white focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 6h16M4 12h16m-7 6h7"/>
                            </svg>
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/chat" className="text-black dark:text-white hover:bg-zinc-400 hover:dark:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium">
                                Chat
                            </Link>
                            {isLoggedIn ? (
                                <div className="flex space-x-4">
                                    <p onClick={handleLogout} className="text-black dark:text-white hover:bg-zinc-400 hover:dark:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                        Logout
                                    </p>
                                    <Link to="/profile">
                                        <img src={loggedInUserProfilePicture} alt={"Profile"} className="h-12 w-12 rounded-full select-none hover:cursor-pointer hover:scale-105 transition-transform"/>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex space-x-4">
                                    <p onClick={handleLoginOpen}
                                       className="text-black dark:text-white hover:bg-zinc-400 hover:dark:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                        Login
                                    </p>
                                    <p onClick={handleRegistrationOpen} className="text-black dark:text-white hover:bg-zinc-400 hover:dark:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                        Register
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:hidden" style={{
                maxHeight: navbarOpen ? '100vh' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.5s ease-in-out'
            }}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/chat" className="text-black dark:text-white hover:bg-zinc-400 hover:dark:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium">
                        My calendar
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" className="text-black dark:text-white hover:bg-zinc-400 hover:dark:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium">
                                Profile
                            </Link>
                            <p onClick={handleLogout} className="text-black dark:text-white hover:bg-zinc-400 hover:dark:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                Logout
                            </p>
                        </>
                    ) : (
                        <>
                            <p onClick={handleLoginOpen} className="text-black dark:text-white hover:bg-zinc-400 hover:dark:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                Login
                            </p>
                            <p onClick={handleRegistrationOpen} className="text-black dark:text-white hover:bg-zinc-400 hover:dark:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                Register
                            </p>
                        </>
                    )}
                </div>
            </div>
            {showLogin && <LoginForm onClose={handleLoginClose} />}
            {showRegistration && <RegistrationForm onClose={handleRegistrationClose} />}
        </nav>
    );
};

export default Navbar;