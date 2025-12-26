import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    tenantSubdomain: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // 1️⃣ LOGIN
      const loginRes = await api.post("/auth/login", form);
      const token = loginRes.data.data.token;

      // 2️⃣ FETCH FULL USER (TENANT + PLAN)
      const meRes = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 3️⃣ SET CONTEXT
      login(token, meRes.data.data);

      // 4️⃣ NAVIGATE
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-color" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card w-full max-w-md animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 text-primary-color" style={{ color: 'var(--primary-color)' }}>Nexus SaaS</h2>
          <p className="text-muted">Sign in to your dashboard</p>
        </div>

        {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/10 rounded border border-red-800/50">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              name="password"
              type="password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Workspace Subdomain</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                className="form-input"
                name="tenantSubdomain"
                onChange={handleChange}
                required
                style={{ flex: 1 }}
              />
              <span className="text-muted text-sm">.app.com</span>
            </div>
          </div>

          <button className="btn btn-primary w-full mt-4" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          New organization? <Link to="/register" className="text-primary-color hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;