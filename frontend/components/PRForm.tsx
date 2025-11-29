"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert, Snackbar, Autocomplete, Skeleton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CardSection from "./CardSection";

interface Warehouse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface WarehouseResponse {
  data: Warehouse[];
}

interface Product {
  id: number;
  name: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductResponse {
  data: Product[];
}

interface PRItem {
  product_id: number;
  quantity: number;
  product_name?: string;
}

interface PRFormProps {
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  initialData?: any;
  isReadOnly?: boolean;
}

export default function PRForm({ onSubmit, isSubmitting = false, initialData, isReadOnly = false }: PRFormProps) {
  const [warehouses, setWarehouses] = useState<WarehouseResponse>({ data: [] });
  const [products, setProducts] = useState<ProductResponse>({ data: [] });
  const [selectedWarehouse, setSelectedWarehouse] = useState<number>(initialData?.warehouse_id || 0);
  const [items, setItems] = useState<PRItem[]>(initialData?.items || []);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [warehousesRes, productsRes] = await Promise.all([axios.get("http://localhost:5000/warehouses"), axios.get("http://localhost:5000/products")]);
        setWarehouses(warehousesRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        setError("Failed to load warehouses and products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = () => {
    if (!selectedProduct || quantity <= 0) {
      setError("Please select a product and enter a valid quantity");
      return;
    }

    const newItem: PRItem = {
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      quantity,
    };

    setItems([...items, newItem]);
    setSelectedProduct(null);
    setQuantity(1);
    setError(null);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedWarehouse || items.length === 0) {
      setError("Please select a warehouse and add at least one item");
      return;
    }

    try {
      await onSubmit({
        warehouse_id: selectedWarehouse,
        items,
      });
      setSuccess(true);
      setItems([]);
      setSelectedWarehouse(0);
      setSelectedProduct(null);
    } catch (err: any) {
      setError(err.message || "Failed to submit purchase request");
    }
  };

  if (loading) {
    return (
      <CardSection>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
        </Box>
      </CardSection>
    );
  }

  return (
    <Box>
      {/* Warehouse Selection */}
      <CardSection title="Warehouse Selection" sx={{ mb: 3 }}>
        <FormControl fullWidth disabled={isReadOnly} size="small">
          <InputLabel>Select Warehouse</InputLabel>
          <Select value={selectedWarehouse} label="Select Warehouse" onChange={(e) => setSelectedWarehouse(e.target.value as number)}>
            <MenuItem value={0}>Choose warehouse...</MenuItem>
            {warehouses.data.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardSection>

      {/* Add Items Section */}
      {!isReadOnly && (
        <CardSection title="Add Items" sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Autocomplete
              options={products.data}
              getOptionLabel={(option) => `${option?.name ?? ""} (${option?.sku ?? ""})`}
              value={selectedProduct}
              onChange={(e, value) => setSelectedProduct(value)}
              renderInput={(params) => <TextField {...params} label="Select Product" size="small" />}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;

                  if (val === "") {
                    setQuantity("");
                    return;
                  }

                  const num = Number(val);
                  if (!isNaN(num) && num > 0) {
                    setQuantity(num);
                  }
                }}
                size="small"
                sx={{ width: 120 }}
                inputProps={{ min: 1 }}
              />

              <Button
                variant="contained"
                onClick={addItem}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: "#0066cc",
                  fontWeight: 500,
                  boxShadow: "0 2px 10px rgba(0, 102, 204, 0.2)",
                }}
              >
                Add Item
              </Button>
            </Box>
          </Box>
        </CardSection>
      )}

      {/* Items Table */}
      <CardSection title="Purchase Items" sx={{ mb: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: (theme) => theme.palette.background.default }}>
                <TableCell sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary }}>Product</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
                  Quantity
                </TableCell>
                {!isReadOnly && (
                  <TableCell align="center" sx={{ fontWeight: 600, color: "#1a202c" }}>
                    Action
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={!isReadOnly ? 3 : 2} align="center" sx={{ py: 2, color: "#64748b" }}>
                    No items added yet
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "#fafbfc" },
                      "&:hover": { backgroundColor: "#f0f4f8" },
                    }}
                  >
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell align="right">
                      {isReadOnly ? (
                        item.quantity
                      ) : (
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].quantity = Number.parseInt(e.target.value) || 1;
                            setItems(newItems);
                          }}
                          size="small"
                          sx={{ width: 80 }}
                          inputProps={{ min: 1 }}
                        />
                      )}
                    </TableCell>
                    {!isReadOnly && (
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => removeItem(index)} sx={{ color: "#ef4444" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardSection>

      {/* Action Buttons */}
      {!isReadOnly && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || items.length === 0}
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: "#0066cc",
              fontWeight: 500,
              boxShadow: "0 2px 10px rgba(0, 102, 204, 0.2)",
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit PR"}
          </Button>
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Success Notification */}
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          Purchase request submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
