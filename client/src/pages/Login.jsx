import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {

        try {

            const response = await api.post("/auth/login", {

                email,

                password

            });

            localStorage.setItem("token", response.data.token);

            localStorage.setItem(

                "user",

                JSON.stringify(response.data.user)

            );

            navigate("/dashboard");

        }

        catch(error){

            alert("Invalid Email or Password");

        }

    };

    return(

        <div className="auth-page">

            <div className="auth-card">

                <h1>

                    SecureChat

                </h1>

                <p>

                    Welcome Back 👋

                </p>

                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={(e)=>setEmail(e.target.value)}

                />

                <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e)=>setPassword(e.target.value)}

                />

                <button

                    onClick={handleLogin}

                >

                    Login

                </button>

                <span>

                    Don't have an account?

                    <Link to="/signup">

                        Sign Up

                    </Link>

                </span>

            </div>

        </div>

    );

}

export default Login;