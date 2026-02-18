import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const API = "https://hospitalmgt-backend.onrender.com";

function Doctor() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  
  //////////////////////// CHECK AUTH & ROLE/////////////////////////
  
  useEffect(() => {
    if (!user || !user.token || user.role !== "doctor") {
      alert("Unauthorized access. Please login as doctor.");
      localStorage.removeItem("user");
      navigate("/");
      return;
    }

    loadAppointments();
  }, [navigate]);


  ///////////////////// LOAD APPOINTMENTS///////////////////
  
  const loadAppointments = async () => {
    try {
      const res = await axios.get(`${API}/doctor-appointments`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setAppointments(res.data || []);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Server error";

      if (status === 401 || status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("user");
        navigate("/");
      } else {
        alert(`Failed to load appointments: ${message}`);
      }

      setAppointments([]);
    }
  };

  // SOCKET.IO (REAL-TIME)
  
  useEffect(() => {
    if (!user?.token) return;

    const socket = io(API, {
      auth: { token: user.token },
      transports:["polling"],
    });

    socket.on("new-appointment", (newAppointment) => {
      try {
        if (newAppointment.doctorId === user._id) {
        alert(`New appointment booked on ${newAppointment.date} 
                at ${newAppointment.time}`);

        // Update UI instantly without reloading everything
        setAppointments((prev) => [newAppointment, ...prev]);
      }
      else{
        console.log("socket.on error:");
        
      }
        
      } catch (error) {
        console.log("socket.on error:",error);
        
        
      }
      // Check if appointment belongs to logged-in doctor
      // if (newAppointment.doctorId === user._id) {
      //   alert(`New appointment booked on ${newAppointment.date} 
      //           at ${newAppointment.time}`);

      //   // Update UI instantly without reloading everything
      //   setAppointments((prev) => [newAppointment, ...prev]);
      // }
      // else{
      //   console.log();
        
      // }
    });

    socket.on("connect_error", (err) => {
      
      console.log("am in socket.on");
      
      console.error("Socket connection error:", err.message);
    });

    return () => socket.disconnect();
  }, [user]);

 
  // UPDATE STATUS
  
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert("Appointment updated successfully");

      // Update UI instantly instead of reloading
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status } : appt
        )
      );
    } catch (err) {
      alert("Failed to update appointment.");
    }
  };

  
  // LOGOUT
  
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

 
  // UI
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Doctor Dashboard
        </h2>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-500">
            No appointments available.
          </p>
        ) : (
          <div className="space-y-6">
            {appointments.map((a) => (
              <div
                key={a._id}
                className="border rounded-xl p-5 bg-gray-50 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Date: {a.date}</p>
                    <p className="text-gray-600">Time: {a.time}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      a.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : a.status === "Accepted"
                        ? "bg-blue-100 text-blue-700"
                        : a.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>

                {a.status === "Pending" && (
                  <button
                    onClick={() => updateStatus(a._id, "Accepted")}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg 
                    hover:bg-blue-600"
                  >
                    Accept
                  </button>
                )}

                {a.status === "Accepted" && (
                  <button
                    onClick={() => updateStatus(a._id, "Completed")}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg 
                    hover:bg-green-600"
                  >
                    Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Doctor;
