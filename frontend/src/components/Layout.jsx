export default function Layout({ user, page, setPage, onLogout, children }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "blockchain", label: "Blockchain" },
    { key: "history", label: "History" }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">EV</div>
          <div>
            <h2>EduVerify</h2>
            <p>Credential Trust System</p>
          </div>
        </div>

        <div className="user-pill">
          <span>Logged in as</span>
          <strong>{user?.role?.toUpperCase()}</strong>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={page === item.key ? "active" : ""}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
