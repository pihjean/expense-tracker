function formatAmount(value) {
  return (
    '₱' +
    Number(value).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

function formatDate(value) {
  return new Date(value + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  return (
    <tr>
      <td>{formatDate(expense.date)}</td>
      <td>{expense.description}</td>
      <td>
        <span className="badge">{expense.category}</span>
      </td>
      <td className="amount">{formatAmount(expense.amount)}</td>
      <td className="actions">
        <button className="btn btn-small btn-outline" onClick={() => onEdit(expense)}>
          Edit
        </button>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(expense)}>
          Delete
        </button>
      </td>
    </tr>
  )
}