import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://hospitalmgt-backend.onrender.com";


function Patient() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // LOAD APPOINTMENTS
  const loadAppointments = async () => {
    try {
      const res = await axios.get(
        `${API}/my-appointments`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );

      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load appointments");
      setAppointments([]);
    }
  };

  // LOAD DOCTORS
  useEffect(() => {
    axios
      .get(`${API}/doctors`)
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Doctor load error:", err));

    if (user?.token) {
      loadAppointments();
    }
  }, []);

  // VALIDATION
  const validateForm = () => {
    let newErrors = {};

    if (!form.doctorId) newErrors.doctorId = "Select a doctor";
    if (!form.date) newErrors.date = "Select a date";
    if (!form.time) newErrors.time = "Select a time";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // BOOK APPOINTMENT
  const book = async () => {
    if (!validateForm()) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/book`,
        form,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      alert(res.data.message || "Booked Successfully ");

      setForm({ doctorId: "", date: "", time: "" });
      setErrors({});
      loadAppointments();
    } catch (err) {
      console.error(err);
      alert("Booking failed ");
    } finally {
      setLoading(false);
    }
  };

  // CANCEL APPOINTMENT
  const cancel = async (id) => {
    try {
      await axios.put(
        `${API}/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      alert("Appointment Cancelled");
      loadAppointments();
    } catch (err) {
      console.error(err);
      alert("Cancel failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Patient Dashboard
          </h2>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* BOOK SECTION */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Book Appointment
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={form.doctorId}
              onChange={(e) =>
                setForm({ ...form, doctorId: e.target.value })
              }
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d._id}-{d.name} - {d.specialization}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            onClick={book}
            disabled={loading}
            className="mt-5 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </div>

        {/* APPOINTMENTS */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            My Appointments
          </h3>

          <div className="grid gap-6">
            {appointments.length === 0 ? (
              <p className="text-gray-500">
                No appointments yet.
              </p>
            ) : (
              appointments.map((a) => (
                <div
                  key={a._id}
                  className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-700">
                        Date: {a.date}
                      </p>
                      <p className="text-gray-600">
                        Time: {a.time}
                      </p>
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
                    <div className="mt-4">
                      <button
                        onClick={() => cancel(a._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Patient;
