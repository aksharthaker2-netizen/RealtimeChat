import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const token = localStorage.getItem("token");

    if (!token) {

        return <Navigate to="/login" />;

    }

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    return (

        <div>

            <h1>Dashboard</h1>

            <h2>Welcome {user.username}</h2>

            <button onClick={logout}>
                Logout
            </button>

        </div>

    );

}

export default Dashboard; 