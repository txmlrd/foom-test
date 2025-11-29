"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Skeleton } from "@mui/material";
import Navbar from "@/components/Navbar";
import CardSection from "@/components/CardSection";
import StorageIcon from "@mui/icons-material/Storage";

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Warehouse {
  id: number;
  name: string;
}

interface Stock {
  id: number;
  quantity: number;
  Product: Product;
  Warehouse: Warehouse;
}

interface StockResponse {
  status: string;
  page: number;
  totalPages: number;
  data: Stock[];
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:5000/stocks");
        setStocks(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load stocks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, []);

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
              Stock Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: (theme) => theme.palette.text.secondary }}>
              View and monitor your inventory levels across all warehouses
            </Typography>
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

          {/* Stocks Table */}
          {!isLoading && !error && (
            <CardSection icon={<StorageIcon sx={{ color: "#0066cc" }} />}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      <TableCell sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary }}>Warehouse Name</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
                        Quantity
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stocks?.data?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4, color: (theme) => theme.palette.text.secondary }}>
                          No stocks available
                        </TableCell>
                      </TableRow>
                    ) : (
                      stocks?.data?.map((stock, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(even)": { backgroundColor: "#fafbfc" },
                            "&:hover": { backgroundColor: "#f0f4f8" },
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          <TableCell sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 500 }}>{stock.Product?.name}</TableCell>

                          <TableCell sx={{ color: (theme) => theme.palette.text.primary }}>{stock.Warehouse?.name}</TableCell>

                          <TableCell align="right" sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 500 }}>
                            {stock.quantity}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardSection>
          )}
        </Box>
      </Container>
    </>
  );
}
