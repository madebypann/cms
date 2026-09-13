export default function PaginationBar({ page, totalPages, rowsPerPage, totalItems, onPageChange, onRowsPerPageChange }) {
  const start = totalItems === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, totalItems);

  return (
    <div className="pagination-bar">
      <div className="rows-per-page">
        <select value={rowsPerPage} onChange={(e) => onRowsPerPageChange(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <label>Rows per page</label>
      </div>

      <div className="pagination-info">
        Menampilkan {start} - {end} dari {totalItems} data
      </div>

      <div className="pagination-controls">
        <button className="icon-btn" onClick={() => onPageChange(1)} disabled={page === 1}>«</button>
        <button className="icon-btn" onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</button>
        <span className="pagination-page">{page} / {totalPages}</span>
        <button className="icon-btn" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>›</button>
        <button className="icon-btn" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>»</button>
      </div>
    </div>
  );
}