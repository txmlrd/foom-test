"use client";

import type React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  InputLabel,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  Button,
  Chip,
  TextField,
  Skeleton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CardSection from "@/components/CardSection";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

interface PurchaseRequest {
  id: number;
  reference: string;
  quantity_total: number;
  Warehouse: {
    id: number;
    name: string;
  };
  status: string;
  createdAt: string;
}

export default function PurchaseRequestListPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchRequests = async (pageNum: number, limit: number, searchTerm: string, status: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/purchase", {
        params: {
          search: searchTerm,
          page: pageNum,
          limit: limit,
          status: status,
        },
      });
      const result = response.data.data;

      setRequests(result.data);
      setTotalRows(result.total_data);
      setPage(result.page);
    } catch (err: any) {
      setError(err.message || "Failed to load purchase requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(page, rowsPerPage, search, status);
  }, [page, rowsPerPage, search, status]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(1);
  };

  const getStatusChipColor = (status: string): any => {
    switch (status?.toUpperCase()) {
      case "DRAFT":
        return "default";
      case "PENDING":
        return "warning";
      case "COMPLETED":
        return "success";
      default:
        return "default";
    }
  };

  console.log("page:", page, "totalRows:", totalRows, "rowsPerPage:", rowsPerPage);

  console.log("requests:", requests);
  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 3, md: 4 } }}>
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                color: (theme) => theme.palette.text.primary,
                mb: 1,
              }}
            >
              Purchase Requests
            </Typography>
            <Typography variant="body1" sx={{ color: (theme) => theme.palette.text.secondary }}>
              Manage all your purchase requests and track their status
            </Typography>
          </Box>

          {/* Search and Create Button */}
          <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              placeholder="Search by reference..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              size="small"
              sx={{
                color: (theme) => theme.palette.text.primary,
                flex: 1,
                minWidth: 250,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748b", mr: 1 }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1); // reset page biar ga error pagination
                }}
                sx={{ color: (theme) => theme.palette.text.primary }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>

            <Link href="/purchase-request/new" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: "#0066cc",
                  fontWeight: 500,
                  boxShadow: "0 2px 10px rgba(0, 102, 204, 0.2)",
                }}
              >
                New PR
              </Button>
            </Link>
          </Box>

          {/* Loading State */}
          {isLoading && (
            <CardSection>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={48} />
                ))}
              </Box>
            </CardSection>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Requests Table */}
          {!isLoading && !error && (
            <CardSection>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={(theme) => ({
                        backgroundColor: theme.palette.background.default,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      })}
                    >
                      <TableCell sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}>Reference</TableCell>
                      <TableCell sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}>Warehouse</TableCell>
                      <TableCell sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}>Status</TableCell>
                      <TableCell sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}>Created</TableCell>
                      <TableCell align="center" sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {requests.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                          sx={(theme) => ({
                            py: 4,
                            color: theme.palette.text.secondary,
                          })}
                        >
                          No purchase requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      requests.map((req) => (
                        <TableRow
                          key={req.id}
                          sx={(theme) => ({
                            "&:nth-of-type(even)": {
                              backgroundColor: theme.palette.action.hover,
                            },
                            "&:hover": {
                              backgroundColor: theme.palette.action.selected,
                            },
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          })}
                        >
                          <TableCell sx={(theme) => ({ color: theme.palette.text.primary, fontWeight: 500 })}>{req.reference}</TableCell>

                          <TableCell sx={(theme) => ({ color: theme.palette.text.primary })}>{req.Warehouse.name}</TableCell>

                          <TableCell>
                            <Chip label={req.status} color={getStatusChipColor(req.status)} size="small" sx={{ fontWeight: 500 }} />
                          </TableCell>

                          <TableCell
                            sx={(theme) => ({
                              color: theme.palette.text.secondary,
                              fontSize: "0.9rem",
                            })}
                          >
                            {new Date(req.createdAt).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>

                          <TableCell align="center">
                            <Link href={`/purchase-request/${req.id}`} style={{ textDecoration: "none" }}>
                              <Button
                                size="small"
                                variant="outlined"
                                sx={(theme) => ({
                                  borderColor: theme.palette.primary.main,
                                  color: theme.palette.primary.main,
                                  fontWeight: 500,
                                  "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                    borderColor: theme.palette.primary.main,
                                  },
                                })}
                              >
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                sx={(theme) => ({
                  borderTop: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.default,
                })}
              />
            </CardSection>
          )}
        </Box>
      </Container>
    </>
  );
}
