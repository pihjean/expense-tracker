function formatAmount(value) {
  return (
    '₱' +
    Number(value).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

export default function ExpenseSummary({ total, count, isFiltered }) {
  return (
    <div className="summary-card">
      <p className="summary-label">
        {isFiltered ? 'Total (filtered)' : 'Total Expenses'}
      </p>
      <p className="summary-amount">{formatAmount(total)}</p>
      <p className="summary-count">
        {count} {count === 1 ? 'expense' : 'expenses'}
      </p>
    </div>
  )
}