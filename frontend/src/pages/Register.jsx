import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tenantName: "",
    subdomain: "",
    adminEmail: "",
    adminFullName: "",
    adminPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.adminPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { confirmPassword, ...registerData } = form;

      await api.post("/auth/register-tenant", registerData);

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-color" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card w-full max-w-2xl animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Create Workspace</h2>
          <p className="text-muted">Start your free trial today</p>
        </div>

        {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/10 rounded border border-red-800/50">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input
                className="form-input"
                name="tenantName"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subdomain</label>
              <input
                className="form-input"
                name="subdomain"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Name</label>
              <input
                className="form-input"
                name="adminFullName"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                className="form-input"
                type="email"
                name="adminEmail"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="adminPassword"
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="btn btn-primary w-full mt-6" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login" className="text-primary-color hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;