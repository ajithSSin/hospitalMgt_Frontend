import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = "https://hospitalmgt-backend.onrender.com";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const res = await axios.post(`${API}/login`, {
        user: username,
        password
      });

      if (res.data.token) {
        
        localStorage.setItem("user", JSON.stringify(res.data));               

        navigate(`/${res.data.role}`);

      } else {
        // console.log(res.data.message);        
        alert(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <input
          type="text"
          placeholder="User Name"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={login}
          className="w-full bg-blue-500 text-white py-2 rounded-lg 
                     hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          No account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
