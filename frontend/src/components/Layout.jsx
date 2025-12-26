import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    Building,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";

const Layout = ({ children }) => {
    const { user, logout, isTenantAdmin } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const isActive = (path) => location.pathname.startsWith(path);

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { path: "/projects", label: "Projects", icon: <FolderKanban size={20} /> },
    ];

    if (isTenantAdmin()) {
        navItems.push({ path: "/users", label: "Users", icon: <Users size={20} /> });
    }

    if (user?.role === "super_admin") {
        navItems.push({ path: "/tenants", label: "Tenants", icon: <Building size={20} /> });
    }

    return (
        <div className="app-container" style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-color)" }}>
            {/* SIDEBAR */}
            <aside
                style={{
                    width: sidebarOpen ? "260px" : "80px",
                    background: "var(--card-bg)",
                    borderRight: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "width 0.3s ease",
                    position: "relative",
                    zIndex: 50
                }}
            >
                {/* LOGO AREA */}
                <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid var(--border-color)", height: "70px" }}>
                    <div style={{ width: "32px", height: "32px", background: "var(--primary-color)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem", flexShrink: 0 }}>
                        P
                    </div>
                    {sidebarOpen && <span style={{ fontSize: "1.2rem", fontWeight: "bold", whiteSpace: "nowrap" }}>Partnr</span>}
                </div>

                {/* NAVIGATION */}
                <nav style={{ flex: 1, padding: "20px 10px", display: "flex", flexDirection: "column", gap: "5px" }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={isActive(item.path) ? "nav-link active" : "nav-link"}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 14px",
                                borderRadius: "8px",
                                color: isActive(item.path) ? "#fff" : "var(--text-muted)",
                                background: isActive(item.path) ? "var(--primary-color)" : "transparent",
                                textDecoration: "none",
                                transition: "all 0.2s",
                                justifyContent: sidebarOpen ? "flex-start" : "center"
                            }}
                            title={!sidebarOpen ? item.label : ""}
                        >
                            {item.icon}
                            {sidebarOpen && <span style={{ fontWeight: 500 }}>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* USER PROFILE & LOGOUT */}
                <div style={{ padding: "15px", borderTop: "1px solid var(--border-color)" }}>
                    {sidebarOpen ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ overflow: "hidden" }}>
                                <p style={{ margin: 0, fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.full_name?.split(" ")[0]}</p>
                                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.role?.replace("_", " ")}</p>
                            </div>
                            <button
                                onClick={logout}
                                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "5px" }}
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <button
                                onClick={logout}
                                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "5px" }}
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* TOGGLE BUTTON */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        position: "absolute",
                        top: "25px",
                        right: "-12px",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "var(--border-color)",
                        color: "#fff",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 60
                    }}
                >
                    {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
                </button>

            </aside>

            {/* MAIN CONTENT AREA */}
            <main style={{ flex: 1, overflowY: "auto", position: "relative" }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
