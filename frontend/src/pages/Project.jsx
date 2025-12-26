import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function Projects() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    fetchProjects();
  }, [loading]);

  const fetchProjects = () => {
    // API 13 query params: ?limit=100
    api.get(`/projects?limit=100`)
      .then((res) => setProjects(res.data.data.projects))
      .catch(() => console.error("Failed to load projects"));
  };

  const addProject = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      await api.post(`/projects`, { name, description: desc });
      setName("");
      setDesc("");
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 className="text-xl font-bold">All Projects</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {error && <div className="p-3 mb-4 text-red-400 bg-red-900/20 rounded border border-red-800">{error}</div>}

      {showForm && (
        <div className="card mb-6 animate-fade-in" style={{ marginBottom: '2rem' }}>
          <form onSubmit={addProject}>
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-input"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Create Project</button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center p-12 card text-muted">
          No projects found.
        </div>
      ) : (
        <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.map((p) => (
            <Link to={`/projects/${p.id}`} key={p.id} className="card block hover:border-primary transition-colors" style={{ textDecoration: 'none' }}>
              <div className="flex justify-between items-start mb-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 className="font-semibold text-lg text-white">{p.name}</h3>
                <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{p.status}</span>
              </div>
              <p className="text-sm text-muted mb-4 h-12 overflow-hidden">{p.description || "No description"}</p>
              <div className="text-xs text-muted flex justify-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tasks: {p.task_count || 0}</span>
                <span>Created by {p.creator_name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;