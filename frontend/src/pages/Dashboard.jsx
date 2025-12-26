import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/api";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  LogOut,
  CheckCircle2,
  Plus,
  ArrowRight
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isTenantAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalUsers: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user && user.tenant_id) {
          try {
            const tenantRes = await axios.get(`/tenants/${user.tenant_id}`);
            if (tenantRes.data.success) {
              const s = tenantRes.data.data.stats;
              const projectsRes = await axios.get("/projects?limit=5");

              console.log("Dashboard Stats:", s); // Debug stats

              if (projectsRes.data.success) {
                setRecentProjects(projectsRes.data.data.projects);
                setStats({
                  totalProjects: Number(s.total_projects || s.totalProjects || 0),
                  totalTasks: Number(s.total_tasks || s.totalTasks || 0),
                  totalUsers: Number(s.total_users || s.totalUsers || 0),
                });
              }
            }
          } catch (err) {
            console.error("Failed to fetch dashboard data", err);
          }
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  /* ===============================
     FETCH MY TASKS
  =============================== */
  const [myTasks, setMyTasks] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get("/tasks?limit=5")
        .then(res => setMyTasks(res.data.data.tasks || []))
        .catch(err => console.error("Failed to fetch my tasks", err));
    }
  }, [user]);

  if (loading) return <div className="container" style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading workspace...</div>;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LayoutDashboard size={28} className="text-muted" color="var(--text-muted)" />
          <h2 style={{ fontSize: "1.2rem", color: "var(--text-muted)", margin: 0 }}>Dashboard</h2>
        </div>
      </div>

      <div className="welcome-banner">
        <h1>Welcome, {user?.full_name}</h1>
        <p>
          Organization: <strong style={{ color: "#fff" }}>{user?.tenant_name || user?.name}</strong>
          <span style={{ margin: "0 10px", opacity: 0.3 }}>|</span>
          Plan: <span style={{ textTransform: "capitalize", border: "1px solid rgba(255,255,255,0.3)", padding: "2px 10px", borderRadius: "20px", fontSize: "0.8rem" }}>{user?.subscription_plan || "Free"}</span>
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Projects</h3>
            <FolderKanban size={20} color="var(--text-muted)" />
          </div>
          <p>{stats.totalProjects}</p>
        </div>
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Tasks</h3>
            <CheckCircle2 size={20} color="var(--text-muted)" />
          </div>
          <p>{stats.totalTasks}</p>
        </div>
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Team</h3>
            <Users size={20} color="var(--text-muted)" />
          </div>
          <p>{stats.totalUsers}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>

        {/* RECENT PROJECTS */}
        <div className="section" style={{ marginTop: 0 }}>
          <div className="page-header" style={{ marginBottom: "20px" }}>
            <h2>Recent Projects</h2>
          </div>
          {recentProjects.length > 0 ? (
            <div style={{ display: "grid", gap: "15px" }}>
              {recentProjects.map((proj) => (
                <div key={proj.id} style={{ background: "var(--card-bg)", padding: "20px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--border-color)" }}>
                  <div>
                    <strong style={{ fontSize: "1rem", display: "block", color: "var(--text-main)" }}>{proj.name}</strong>
                    <span style={{ fontSize: "0.8rem", color: proj.status === 'active' ? "#10b981" : "#a8a29e", fontWeight: "500", marginTop: "4px", display: "inline-block" }}>
                      ● {proj.status}
                    </span>
                  </div>
                  <button className="btn-secondary btn-sm" onClick={() => navigate(`/projects/${proj.id}`)}>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", background: "var(--card-bg)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <p>No projects yet.</p>
            </div>
          )}
        </div>

        {/* MY TASKS */}
        <div className="section" style={{ marginTop: 0 }}>
          <div className="page-header" style={{ marginBottom: "20px" }}>
            <h2>My Pending Tasks</h2>
          </div>
          {myTasks.length > 0 ? (
            <div style={{ display: "grid", gap: "15px" }}>
              {myTasks.map(task => (
                <div key={task.id} style={{ background: "var(--card-bg)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: "#fff", background: "#f59e0b", padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase" }}>{task.priority}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}</span>
                  </div>
                  <h4 style={{ margin: "5px 0", fontSize: "1rem" }}>{task.title}</h4>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Project: {task.project_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", background: "var(--card-bg)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <CheckCircle2 size={40} style={{ opacity: 0.5, marginBottom: "15px" }} />
              <p>You have no pending tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;