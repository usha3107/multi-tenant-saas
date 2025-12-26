import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, isTenantAdmin, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ((isTenantAdmin() || isSuperAdmin()) && user?.tenant_id) {
      api.get(`/tenants/${user.tenant_id}`)
        .then(res => setStats(res.data.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="card mb-6" style={{ marginBottom: '2rem' }}>
        <h2 className="text-xl font-bold mb-2">Welcome back, {user?.full_name}</h2>
        <p className="text-muted">
          You are logged in as <span className="text-primary font-medium capitalize">{user?.role?.replace('_', ' ')}</span>
          {' '}in <strong>{stats?.name || user?.tenant_name || 'your organization'}</strong>.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 className="text-muted text-sm uppercase">Total Users</h3>
            <div className="text-3xl font-bold mt-2">{stats.stats?.totalUsers || 0} / {stats.maxUsers}</div>
          </div>
          <div className="card">
            <h3 className="text-muted text-sm uppercase">Projects</h3>
            <div className="text-3xl font-bold mt-2">{stats.stats?.totalProjects || 0} / {stats.maxProjects}</div>
          </div>
          <div className="card">
            <h3 className="text-muted text-sm uppercase">Subscription</h3>
            <div className="text-3xl font-bold mt-2 capitalize text-primary">{stats.subscriptionPlan}</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h3 className="mt-8 mb-4 font-semibold text-lg" style={{ marginTop: '2rem', marginBottom: '1rem' }}>Quick Actions</h3>
      <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/projects" className="btn btn-primary">
          View Projects
        </Link>
        {(isTenantAdmin() || isSuperAdmin()) && (
          <Link to="/users" className="btn btn-secondary">
            Manage Users
          </Link>
        )}
      </div>
    </div>
  );
}