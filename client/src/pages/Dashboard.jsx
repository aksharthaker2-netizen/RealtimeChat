import { useState, useEffect } from "react";
import api from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import socket from "../services/socket";

function Dashboard() {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    const fetchUsers = async () => {

        try {

            const response = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const fetchMessages = async (receiverId) => {

        try {

            const response = await api.get(
                `/messages/${receiverId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessages(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchUsers();

    }, []);

    useEffect(() => {

        socket.connect();

        socket.emit("register-user", currentUser.id);

        const handleReceiveMessage = (data) => {

            setMessages((previousMessages) => [

                ...previousMessages,

                data,

            ]);

        };

        socket.on("receive-message", handleReceiveMessage);

        return () => {

            socket.off("receive-message", handleReceiveMessage);

            socket.disconnect();

        };

    }, []);

    const sendMessage = () => {

        if (!message.trim() || !selectedUser) return;

        socket.emit("send-message", {

            senderId: currentUser.id,

            receiverId: selectedUser.id,

            text: message,

        });

        setMessage("");

    };
return (

<div className="dashboard">

    <div className="sidebar">

        <div className="logo">

            <h1>💬 SecureChat</h1>

        </div>

        <div className="search-box">

            <input
                type="text"
                placeholder="Search users..."
            />

        </div>

        <div className="user-list">

            {

                users.map((user) => (

                    <div

                        key={user.id}

                        className={
                            selectedUser?.id === user.id
                            ? "user-card active-user"
                            : "user-card"
                        }

                        onClick={() => {

                            setSelectedUser(user);

                            fetchMessages(user.id);

                        }}

                    >

                        <div className="avatar">

                            {user.username.charAt(0).toUpperCase()}

                        </div>

                        <div className="user-info">

                            <h3>{user.username}</h3>

                            <p>{user.email}</p>

                        </div>

                    </div>

                ))

            }

        </div>

        <button

            className="logout-btn"

            onClick={logout}

        >

            Logout

        </button>

    </div>

    <div className="chat-area">

        {

            selectedUser ? (

                <>

                    <div className="chat-header">

                        <div className="chat-user">

                            <div className="chat-avatar">

                                {selectedUser.username.charAt(0).toUpperCase()}

                            </div>

                            <div>

                                <h2>{selectedUser.username}</h2>

                                <span className="status">

                                    Online

                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="messages">

                        {

                            messages.map((msg,index)=>(

                                <div

                                    key={index}

                                    className={

                                        (msg.sender_id || msg.senderId) === currentUser.id

                                        ?

                                        "my-message"

                                        :

                                        "other-message"

                                    }

                                >

                                    {msg.message || msg.text}

                                </div>

                            ))

                        }

                    </div>

                    <div className="message-input">

                        <input

                            type="text"

                            placeholder="Type your message..."

                            value={message}

                            onChange={(e)=>setMessage(e.target.value)}

                            onKeyDown={(e)=>{

                                if(e.key==="Enter"){

                                    sendMessage();

                                }

                            }}

                        />

                        <button

                            onClick={sendMessage}

                        >

                            ➤

                        </button>

                    </div>

                </>

            )

            :

            (

                <div className="empty-chat">

                    <h1>

                        💬

                    </h1>

                    <h2>

                        Welcome to SecureChat

                    </h2>

                    <p>

                        Select a user to start chatting.

                    </p>

                </div>

            )

        }

    </div>

</div>

);

}

export default Dashboard;