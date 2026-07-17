import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Download, 
  MoreVertical,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './LoadingSkeleton';

export const DataTable = ({
  columns,
  data,
  isLoading = false,
  onRowClick,
  searchPlaceholder = "بحث...",
  onExport,
  bulkActions = [],
  rowActions = [],
  emptyStateTitle = "لا توجد بيانات",
  emptyStateDesc = "لم يتم العثور على أي سجلات مطابقة للبحث."
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [activeMenu, setActiveMenu] = useState(null);

  // Search
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(row => 
      columns.some(col => {
        const val = row[col.key];
        return val && String(val).toLowerCase().includes(lowerSearch);
      })
    );
  }, [data, searchTerm, columns]);

  // Sort
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(paginatedData.map(row => row.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  return (
    <div className="bg-bgPurple border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-xl">
      {/* Toolbar */}
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-accentGold transition-colors"
            />
          </div>
          
          {selectedRows.size > 0 && bulkActions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 font-medium mr-2">
                تم تحديد ({selectedRows.size})
              </span>
              {bulkActions.map((action, idx) => (
                <Button 
                  key={idx}
                  size="sm" 
                  variant={action.variant || "secondary"}
                  onClick={() => action.onClick(Array.from(selectedRows))}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onExport && (
            <Button size="sm" variant="ghost" onClick={onExport} icon={Download}>
              تصدير
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[300px]">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : paginatedData.length === 0 ? (
          <EmptyState title={emptyStateTitle} description={emptyStateDesc} />
        ) : (
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-4 py-3 w-12 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-600 bg-bgDark checked:bg-accentGold focus:ring-accentGold focus:ring-offset-bgDark"
                    onChange={handleSelectAll}
                    checked={selectedRows.size > 0 && selectedRows.size === paginatedData.length}
                  />
                </th>
                {columns.map((col) => (
                  <th 
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    className={`px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider ${col.sortable !== false ? 'cursor-pointer hover:text-white select-none' : ''}`}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortConfig.key === col.key && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
                {rowActions.length > 0 && <th className="px-4 py-3 w-16"></th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr 
                  key={row.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-600 bg-bgDark checked:bg-accentGold focus:ring-accentGold focus:ring-offset-bgDark"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </td>
                  {columns.map((col) => (
                    <td 
                      key={col.key} 
                      className={`px-4 py-3 text-sm text-gray-300 ${onRowClick ? 'cursor-pointer' : ''}`}
                      onClick={() => onRowClick && onRowClick(row)}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {rowActions.length > 0 && (
                    <td className="px-4 py-3 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === row.id ? null : row.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {/* Action Menu Dropdown */}
                      {activeMenu === row.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-30" 
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }}
                          />
                          <div className="absolute left-4 top-10 w-48 bg-bgDarker border border-white/10 rounded-xl shadow-2xl z-40 overflow-hidden py-1">
                            {rowActions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                  action.onClick(row);
                                }}
                                className={`w-full text-right px-4 py-2 text-sm transition-colors ${
                                  action.danger 
                                    ? 'text-red-400 hover:bg-red-500/10' 
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalPages > 1 && (
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            إظهار {((currentPage - 1) * rowsPerPage) + 1} إلى {Math.min(currentPage * rowsPerPage, sortedData.length)} من {sortedData.length} سجل
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                  currentPage === idx + 1
                    ? 'bg-accentGold text-bgDark'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
