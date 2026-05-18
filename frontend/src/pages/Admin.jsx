import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import StatCard from "../components/StatCard";

const emptyForm = {
  name: "",
  matric: "",
  email: "",
  phone: "",
  gender: "",
  department: "",
  level: "",
  credentialType: "",
  session: ""
};

export default function Admin() {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [studentResponse, statResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/students`),
      axios.get(`${API_BASE_URL}/stats`)
    ]);
    setStudents(studentResponse.data);
    setStats(statResponse.data);
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!file) {
      setMessage({ type: "error", text: "Please upload a credential file." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    data.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/admin/upload`, data);
      setMessage({ type: "success", text: response.data.message });
      setForm(emptyForm);
      setFile(null);
      event.target.reset();
      await fetchData();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Upload failed"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <span className="badge">Admin Dashboard</span>
          <h1>Credential Registration</h1>
          <p>Create student records and upload credentials for blockchain hashing.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Students" value={stats?.students ?? 0} helper="registered records" />
        <StatCard label="Blocks" value={stats?.blocks ?? 0} helper="credential chain" />
        <StatCard label="Audit Events" value={stats?.history ?? 0} helper="system activity" />
      </div>

      <div className="two-column">
        <form className="panel" onSubmit={handleSubmit}>
          <h2>Add Student Credential</h2>

          {message.text && <div className={message.type === "success" ? "success-box" : "error-box"}>{message.text}</div>}

          <div className="form-grid">
            <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
            <input className="input" name="matric" value={form.matric} onChange={handleChange} placeholder="Matric number" required />
            <input className="input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Valid email address" required />
            <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" required />

            <select className="input" name="department" value={form.department} onChange={handleChange} required>
              <option value="">Select department</option>
              <option>Computer Science</option>
              <option>Software Engineering</option>
              <option>Cyber Security</option>
              <option>Information Technology</option>
              <option>Computer Engineering</option>
              <option>Electrical Engineering</option>
              <option>Mechanical Engineering</option>
              <option>Business Administration</option>
              <option>Accounting</option>
              <option>Mass Communication</option>
            </select>

            <select className="input" name="level" value={form.level} onChange={handleChange} required>
              <option value="">Select level</option>
              <option>100 Level</option>
              <option>200 Level</option>
              <option>300 Level</option>
              <option>400 Level</option>
              <option>500 Level</option>
            </select>

            <select className="input" name="credentialType" value={form.credentialType} onChange={handleChange} required>
              <option value="">Select credential type</option>
              <option>Admission Letter</option>
              <option>Result Statement</option>
              <option>Transcript</option>
              <option>Certificate</option>
              <option>Clearance Document</option>
            </select>

            <input className="input" name="session" value={form.session} onChange={handleChange} placeholder="Academic session e.g. 2025/2026" required />
          </div>

          <div className="radio-row">
            <span>Gender:</span>
            <label><input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handleChange} required /> Male</label>
            <label><input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handleChange} required /> Female</label>
          </div>

          <label className="file-upload">
            <span>{file ? file.name : "Upload credential file"}</span>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
          </label>

          <button className="primary-btn full" disabled={loading}>{loading ? "Saving..." : "Save Credential"}</button>
        </form>

        <section className="panel">
          <h2>Recently Registered Students</h2>
          <div className="student-list">
            {students.length === 0 && <p className="muted">No students yet. Add a record to begin.</p>}
            {students.slice().reverse().map((student) => (
              <div className="student-row" key={student.id}>
                <div>
                  <strong>{student.name}</strong>
                  <span>{student.matric} • {student.department}</span>
                </div>
                <small>{student.credentialType}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
