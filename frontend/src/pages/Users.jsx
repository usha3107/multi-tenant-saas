import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function Users() {
  const { user, loading, isTenantAdmin, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({ email: "", fullName: "", role: "user" });

  useEffect(() => {
    if (loading) return;
    if (!user?.tenant_id) return;
    fetchUsers();
  }, [user, loading]);

  const fetchUsers = () => {
    api
      .get(`/tenants/${user.tenant_id}/users`)
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data)) setUsers(data);
        else if (Array.isArray(data?.users)) setUsers(data.users);
        else setUsers([]);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load users");
      });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post(
        `/tenants/${user.tenant_id}/users`,
        formData
      );
      if (res.data?.data) {
        setUsers((prev) => [res.data.data, ...prev]);
        setShowForm(false);
        setFormData({ email: "", fullName: "", role: "user" });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    }
  };

  if (!isTenantAdmin() && !isSuperAdmin()) {
    return <div className="p-4 text-center">You do not have permission to view this page.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 className="text-xl font-bold">Team Members</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {error && <div className="p-3 mb-4 text-red-400 bg-red-900/20 rounded border border-red-800">{error}</div>}

      {showForm && (
        <div className="card mb-6 animate-fade-in" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleAddUser}>
            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="tenant_admin">Tenant Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Add Member</button>
          </form>
        </div>
      )}

      <div className="card p-0" style={{ padding: 0, overflow: 'hidden' }}>
        {users.length === 0 ? (
          <div className="p-6 text-center text-muted">No users found</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium text-white">{u.full_name}</td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'tenant_admin' ? 'badge-warning' : 'badge-neutral'}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-green-400">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Users;