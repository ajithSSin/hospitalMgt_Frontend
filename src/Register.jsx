import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://hospitalmgt-backend.onrender.com";

function Register() {
  const [form, setForm] = useState({
    name: "",
    user: "",
    password: "",
    role: ""
  });

  const navigate = useNavigate();

  const register = async () => {
    if (!form.name || !form.user || !form.password || !form.role) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post(`${API}/register`, form);
      alert("Registered Successfully ✅");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"   // ✅ fixed (was empty)
          placeholder="Username"
          value={form.user}
          onChange={(e) =>
            setForm({ ...form, user: e.target.value })
          }
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
          className="w-full px-4 py-2 mb-4 border rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>

        <button
          onClick={register}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Register
        </button>

      </div>
    </div>
  );
}

export default Register;
