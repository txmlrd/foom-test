"use client";

import type React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Alert, Box, Skeleton } from "@mui/material";

interface Column {
  id: string;
  label: string;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  rows: any[];
  isLoading?: boolean;
  error?: string | null;
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  renderRow?: (row: any) => React.ReactNode;
}

export default function DataTable({ columns, rows, isLoading = false, error = null, page = 0, rowsPerPage = 10, totalRows = 0, onPageChange, onRowsPerPageChange, renderRow }: DataTableProps) {
  if (isLoading) {
    return (
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                {columns.map((column) => (
                  <TableCell key={column.id} sx={{ width: column.width }}>
                    <Skeleton width="60%" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column.id}`}>
                      <Skeleton width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    fontWeight: 600,
                    color: "#1a202c",
                    width: column.width,
                    backgroundColor: "#f8fafc",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) =>
                renderRow ? (
                  <Box key={index}>{renderRow(row)}</Box>
                ) : (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "#fafbfc" },
                      "&:hover": { backgroundColor: "#f0f4f8" },
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={`${index}-${column.id}`} sx={{ color: "#1a202c" }}>
                        {row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalRows > 0 && onPageChange && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          onRowsPerPageChange={(e) => onRowsPerPageChange?.(Number.parseInt(e.target.value, 10))}
          sx={{ borderTop: "1px solid #e2e8f0", backgroundColor: "#fafbfc" }}
        />
      )}
    </Paper>
  );
}
