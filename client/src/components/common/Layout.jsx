import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/shipments', label: 'Shipments' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/vendors', label: 'Vendors' },
  { to: '/analytics', label: 'Analytics' },
];

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h2 className="brand">Supply Chain</h2>
          <p className="brand-subtitle">Supply Chain</p>
        </div>
        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
