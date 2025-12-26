import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

export default function Layout({ children, title }) {
    const { user, logout, isTenantAdmin, isSuperAdmin } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Link to="/dashboard" className="app-logo">
                        Nexus SaaS
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        to="/dashboard"
                        className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/projects"
                        className={`nav-item ${isActive("/projects") ? "active" : ""}`}
                    >
                        Projects
                    </Link>
                    {(isTenantAdmin() || isSuperAdmin()) && (
                        <Link
                            to="/users"
                            className={`nav-item ${isActive("/users") ? "active" : ""}`}
                        >
                            Users
                        </Link>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-snippet">
                        <div className="user-avatar">
                            {user?.full_name?.charAt(0) || "U"}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user?.full_name}</span>
                            <span className="user-role">
                                {user?.role?.replace("_", " ")}
                            </span>
                        </div>
                    </div>
                    <button onClick={logout} className="btn logout-btn">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="topbar">
                    <h1 className="page-title">{title || "Dashboard"}</h1>
                    <div className="tenant-badge badge badge-neutral">
                        {user?.tenant_name || user?.tenant_subdomain || "System"}
                    </div>
                </header>
                <div className="content-wrapper">{children}</div>
            </main>
        </div>
    );
}
