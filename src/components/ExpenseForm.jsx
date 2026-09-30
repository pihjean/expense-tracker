import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'

function today() {
  return new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time
}

export default function ExpenseForm({ expense, onSave, onCancel, saving }) {
  const isEdit = Boolean(expense)

  const [description, setDescription] = useState(expense?.description ?? '')
  const [amount, setAmount] = useState(expense?.amount ?? '')
  const [category, setCategory] = useState(expense?.category ?? 'Food')
  const [date, setDate] = useState(expense?.date ?? today())

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      description: description.trim(),
      amount: Number(amount),
      category,
      date,
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">{isEdit ? 'Edit Expense' : 'Add Expense'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Lunch"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="150"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}