import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Signup.css";

function Signup(){

    const [username,setUsername]=useState("");

    const [email,setEmail]=useState("");

    const [password,setPassword]=useState("");

    const navigate=useNavigate();

    const handleSignup=async()=>{

        try{

            await api.post("/auth/signup",{

                username,

                email,

                password

            });

            alert("Signup Successful");

            navigate("/login");

        }

        catch{

            alert("Signup Failed");

        }

    };

    return(

        <div className="auth-page">

            <div className="auth-card">

                <h1>

                    SecureChat

                </h1>

                <p>

                    Create your account 🚀

                </p>

                <input

                    type="text"

                    placeholder="Username"

                    value={username}

                    onChange={(e)=>setUsername(e.target.value)}

                />

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

                    onClick={handleSignup}

                >

                    Sign Up

                </button>

                <span>

                    Already have an account?

                    <Link to="/login">

                        Login

                    </Link>

                </span>

            </div>

        </div>

    );

}

export default Signup;