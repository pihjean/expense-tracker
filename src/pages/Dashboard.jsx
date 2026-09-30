import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../lib/categories'
import Navbar from '../components/Navbar'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import ExpenseSummary from '../components/ExpenseSummary'

export default function Dashboard({ session }) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const fullName = session.user.user_metadata?.full_name
  const firstName = fullName ? fullName.split(' ')[0] : session.user.email

  const filteredExpenses = useMemo(() => {
    const term = search.trim().toLowerCase()
    return expenses.filter((e) => {
      const matchesCategory =
        categoryFilter === 'All' || e.category === categoryFilter
      const matchesSearch =
        term === '' ||
        e.description.toLowerCase().includes(term) ||
        e.category.toLowerCase().includes(term)
      return matchesCategory && matchesSearch
    })
  }, [expenses, search, categoryFilter])

  const total = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const isFiltered = search.trim() !== '' || categoryFilter !== 'All'

  async function fetchExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setExpenses(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  async function handleSave(values) {
    setSaving(true)
    setError('')

    // user_id is filled in automatically by the database (auth.uid())
    const { error } = editing
      ? await supabase.from('expenses').update(values).eq('id', editing.id)
      : await supabase.from('expenses').insert(values)

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    closeForm()
    fetchExpenses()
  }

  async function handleDelete() {
    setError('')
    const { error } = await supabase.from('expenses').delete().eq('id', deleting.id)

    setDeleting(null)
    if (error) {
      setError(error.message)
      return
    }
    fetchExpenses()
  }

  function openAdd() {
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(expense) {
    setEditing(expense)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div>
      <Navbar name={firstName} onLogout={handleLogout} />

      <main className="container">
        <div className="page-header">
          <h2>My Expenses</h2>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Expense
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p>Loading expenses...</p>
        ) : (
          <>
            <ExpenseSummary
              total={total}
              count={filteredExpenses.length}
              isFiltered={isFiltered}
            />

            <div className="filters">
              <input
                type="text"
                className="filter-input"
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {expenses.length > 0 && filteredExpenses.length === 0 ? (
              <div className="empty-state">
                <p>No expenses match your search or filter.</p>
              </div>
            ) : (
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            )}
          </>
        )}
      </main>

      {showForm && (
        <ExpenseForm
          expense={editing}
          onSave={handleSave}
          onCancel={closeForm}
          saving={saving}
        />
      )}

      {deleting && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">Delete Expense</h2>
            <p>Are you sure you want to delete this expense?</p>
            <p className="delete-name">
              <strong>{deleting.description}</strong>
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setDeleting(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}