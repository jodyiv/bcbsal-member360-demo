import React, { useState } from 'react'
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Pagination,
  Tag,
  Button
} from '@carbon/react'
import { Download } from '@carbon/icons-react'

const STATUS_TAG_MAP = {
  active:      { type: 'green',   label: 'Active' },
  completed:   { type: 'teal',    label: 'Completed' },
  pending:     { type: 'gray',    label: 'Pending' },
  denied:      { type: 'red',     label: 'Denied' },
  approved:    { type: 'green',   label: 'Approved' },
  error:       { type: 'red',     label: 'Error' },
  processing:  { type: 'purple',  label: 'Processing' },
  high:        { type: 'red',     label: 'High' },
  medium:      { type: 'magenta', label: 'Medium' },
  low:         { type: 'green',   label: 'Low' },
  open:        { type: 'cyan',    label: 'Open' },
  closed:      { type: 'gray',    label: 'Closed' },
  inprogress:  { type: 'blue',    label: 'In Progress' },
  'in-progress': { type: 'blue', label: 'In Progress' },
}

/**
 * DataTableView — Carbon DataTable wrapper with toolbar, search, and pagination
 */
export default function DataTableView({
  title = 'Data',
  description = '',
  headers = [],
  rows = [],
  statusKey = 'status',
  pageSize = 10,
  showExport = true
}) {
  const [page, setPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRows = rows.filter(row => {
    if (!searchTerm) return true
    return Object.values(row).some(v =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const paginatedRows = filteredRows.slice(
    (page - 1) * currentPageSize,
    page * currentPageSize
  )

  const handleExportCSV = () => {
    const csvHeaders = headers.map(h => h.header).join(',')
    const csvRows = filteredRows.map(row =>
      headers.map(h => `"${row[h.key] ?? ''}"`).join(',')
    )
    const csv = [csvHeaders, ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '-')}.csv`)
    link.click()
    URL.revokeObjectURL(url)
  }

  const renderCell = (cell, rowData) => {
    if (cell.info.header === statusKey) {
      const statusRaw = String(cell.value || '').toLowerCase().replace(/\s+/g, '')
      const tagConfig = STATUS_TAG_MAP[statusRaw] || { type: 'gray', label: cell.value }
      return <Tag type={tagConfig.type} size="sm">{tagConfig.label}</Tag>
    }
    return cell.value
  }

  return (
    <div>
      <DataTable rows={paginatedRows} headers={headers} isSortable>
        {({ rows: tableRows, headers: tableHeaders, getHeaderProps, getRowProps, getTableProps, getTableContainerProps, getToolbarProps, onInputChange }) => (
          <TableContainer title={title} description={description} {...getTableContainerProps()}>
            <TableToolbar {...getToolbarProps()} aria-label="Table toolbar">
              <TableToolbarContent>
                <TableToolbarSearch
                  persistent
                  onChange={e => {
                    setSearchTerm(e.target.value)
                    setPage(1)
                    onInputChange(e)
                  }}
                  placeholder="Search records…"
                />
                {showExport && (
                  <Button
                    kind="ghost"
                    size="sm"
                    renderIcon={Download}
                    onClick={handleExportCSV}
                    aria-label="Export to CSV"
                  >
                    Export CSV
                  </Button>
                )}
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()} aria-label={title}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map(header => (
                    <TableHeader key={header.key} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map(row => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map(cell => (
                      <TableCell key={cell.id}>
                        {renderCell(cell, row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {tableRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={headers.length} style={{ textAlign: 'center', color: '#a8a8a8', padding: '2rem' }}>
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      {filteredRows.length > currentPageSize && (
        <Pagination
          page={page}
          pageSize={currentPageSize}
          pageSizes={[5, 10, 20, 50]}
          totalItems={filteredRows.length}
          onChange={({ page: p, pageSize: ps }) => { setPage(p); setCurrentPageSize(ps) }}
          size="md"
        />
      )}
    </div>
  )
}
