import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

import ListChatMessages from "../components/ListChatMessages";

import { useAuth } from "../context/Auth";
import CreateGroupChat from "../components/CreateGroupChat";
import {toast} from "react-toastify";

const Chat = () => {
    const { loggedInUser } = useAuth();
    const [cookies, setCookie] = useCookies(["chatMessages"]);

    const [users, setUsers] = useState([]);
    const [previousChats, setPreviousChats] = useState([]);

    const [currentChat, setCurrentChat] = useState({});

    const [userDetails, setUserDetails] = useState({});

    const [createGroupChat, setCreateGroupChat] = useState(false);

    async function fetchUsers() {
        try {
            const listUsersResponse = await axios.get('list-users');

            if (listUsersResponse.status === 200) {
                setUsers(listUsersResponse.data.users);
            }
        } catch (e) {
            // No users found.
        }
    }

    async function fetchChats() {
        try {
            const chatResponse = await axios.get('chats');

            if (chatResponse.status === 200) {
                setPreviousChats(chatResponse.data.chats);
            }
        } catch (e) {
            // No previous chats found.
        }
    }

    async function userDetail(userName) {
        try {
            const userDetailsResponse = await axios.get(`user-details?userName=${userName}`);

            if (userDetailsResponse.status === 200) {
                setUserDetails(userDetailsResponse.data.user);
            }
        } catch (e) {
            // No user found.
        }
    }

    async function createChat(participant) {
        try {
            const existingChat = previousChats.find(chat => chat.participants.includes(participant));

            if (existingChat) {
                setCurrentChat(existingChat);
                return;
            }

            const createChatResponse = await axios.post('create-chat', {
                participants: [loggedInUser.userName, participant]
            });

            if (createChatResponse.status === 201) {
                toast("Chat created successfully.", { type: "success" });
                setCurrentChat(createChatResponse.data.chat);
            }
        } catch (e) {
            if (e.response?.data.message === "Chat already exists.") {
                const chat = previousChats.find(chat => chat.participants.includes(participant));

                setCurrentChat(chat);
                return;
            }
        }
    }

    function findSecondParticipant(participants) {
        if (participants.length === 1) {
            return "Participant left."
        }

        return "Chat with " + participants.find(participant => participant !== loggedInUser.userName);
    }

    useEffect(() => {
        fetchUsers();
        fetchChats();

        const fetchUsersInterval = setInterval(fetchUsers, 10000);
        const fetchChatsInterval = setInterval(fetchChats, 10000);

        return () => {
            clearInterval(fetchUsersInterval);
            clearInterval(fetchChatsInterval);
        }
    }, []);

    return (
        <div className="bg-zinc-200 dark:bg-zinc-900 min-h-screen p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-4xl text-gray-800 dark:text-white font-semibold mb-4">Previous Chats</h2>
                    <div className="space-y-4">
                        {previousChats.map((chat, index) => (
                            <div key={index} className="bg-white dark:bg-zinc-800 p-6 w-1/2 rounded-lg shadow-md hover:cursor-pointer hover:scale-105 transition-transform">
                                <p className="text-gray-800 text-2xl dark:text-white font-semibold">{chat.participants.length > 2 ? "Group chat" : findSecondParticipant(chat.participants)}</p>
                                {chat.participants.length > 2 && (
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">Participants: {chat.participants.filter(user => user !== loggedInUser.userName).join(', ')}</p>
                                )}
                                <div className="space-x-4">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 font-bold rounded-lg mt-4 hover:bg-blue-600 transition-transform"
                                        onClick={() => setCurrentChat(chat)}>
                                        Chat
                                    </button>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">Messages: {chat.messages.length}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 font-bold rounded-lg mt-4 hover:bg-blue-600 transition-transform"
                        onClick={() => setCreateGroupChat(true)}>
                        Create group chat
                    </button>
                    {createGroupChat && (
                        <div className="w-1/2 mt-4">
                            <CreateGroupChat onClose={() => setCreateGroupChat(false)} />
                        </div>
                    )}
                </div>

                <div className="col-span-1 md:col-span-1">
                    <h2 className="text-4xl text-gray-800 dark:text-white font-semibold mb-4">List of all users</h2>
                    <div className="space-y-4">
                        {users.filter(user => user.userName !== loggedInUser.userName).map((user, index) => (
                            <div key={index} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md hover:cursor-pointer hover:scale-105 transition-transform">
                                <p className="text-gray-800 text-2xl dark:text-white font-semibold">{user.userName}</p>
                                <div className="space-x-4">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 font-bold rounded-lg mt-4 hover:bg-green-600 transition-transform"
                                        onClick={() => createChat(user.userName)}>
                                        Create chat
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 font-bold rounded-lg mt-4 hover:bg-blue-600 transition-transform"
                                        onClick={() => setCurrentChat(previousChats.find(chat => chat.participants.includes(user.userName)) || { participants: [loggedInUser.userName, user.userName] })}>
                                        Chat
                                    </button>
                                </div>
                                {previousChats.find(chat => chat.participants.includes(user.userName))?.messages.length > 0 && (
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">Messages: {previousChats.find(chat => chat.participants.includes(user.userName)).messages.length}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                {currentChat && Object.keys(currentChat).length > 0 ? (
                    <>
                        <h2 className="text-4xl text-gray-800 dark:text-white font-semibold mb-4">{currentChat.participants.length > 2 ? "Group chat" : findSecondParticipant(currentChat.participants)}</h2>
                        {currentChat.participants.length > 2 && (
                            <>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">Participants: {currentChat.participants.filter(user => user !== loggedInUser.userName).join(', ')}</p>
                            </>
                        )}
                        <ListChatMessages key={currentChat._id} currentChat={currentChat} setCurrentChat={setCurrentChat} />
                    </>
                ) : (
                    <p className="flex justify-center text-center text-gray-800 dark:text-white text-xl">
                        Select either a previous chat or a user to start a new chat.<br/>
                        Once you start a chat, the chat will appear here.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Chat;
