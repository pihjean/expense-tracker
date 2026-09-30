export default function Navbar({ name, onLogout }) {
  return (
    <nav className="navbar">
      <span className="navbar-brand">💰 Expense Tracker</span>
      <div className="navbar-right">
        <span className="navbar-user">Welcome, {name}</span>
        <button className="btn btn-outline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}