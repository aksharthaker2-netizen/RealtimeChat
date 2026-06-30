import { useState, useEffect } from "react";
import api from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    const fetchUsers = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(response.data);

        } catch (error) {

            console.error(error.response?.data || error.message);

        }

    };

    useEffect(() => {

        fetchUsers();

    }, []);
    const sendMessage = () => {

    console.log(message);

};
return (

    <div className="dashboard">

        <div className="sidebar">

            <h2>Chats</h2>

            <input
                type="text"
                placeholder="Search users..."
            />

            <div className="user-list">

                {

                    users.map((user) => (

                        <div
                            key={user.id}
                            className="user-card"
                            onClick={() => setSelectedUser(user)}
                        >

                            <h3>{user.username}</h3>

                            <p>{user.email}</p>

                        </div>

                    ))

                }

            </div>

            <button onClick={logout}>

                Logout

            </button>

        </div>

        <div className="chat-area">

            {

                selectedUser ? (

                  <div className="chat-container">

                      <div className="chat-header">

                          <h2>

                              {selectedUser.username}

                          </h2>

                      </div>

                      <div className="messages">

                          <p>

                              No messages yet.

                          </p>

                      </div>

                      <div className="message-input">

                          <input

                              type="text"

                              placeholder="Type a message..."

                              value={message}

                              onChange={(e)=>setMessage(e.target.value)}

                          />

                          <button
                          onClick={sendMessage}
                          >
                          Send
                          </button>
                      </div>
                  </div>
              )
              :
              (
              <h2>
              Select a user to start chatting
              </h2>
              )
          }

        </div>

    </div>

);
}

export default Dashboard;