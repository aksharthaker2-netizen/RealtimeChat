import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSignup = async () => {

    try{

        await api.post("/auth/signup",{

            username,
            email,
            password

        });

        alert("Signup Successful");

        navigate("/login");

    }

    catch(error){

        console.error(error.response?.data || error.message);

    }

};

    return (

        <div>

            <h1>Sign Up</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <br /><br />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

           <button onClick={handleSignup}>
            Sign Up
            </button>
            <p>
                Already have an account?
                <Link to="/login">
                Login
                </Link>
            </p>
        </div>

    );
}

export default Signup;