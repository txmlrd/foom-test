"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Snackbar, Skeleton } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CardSection from "@/components/CardSection";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DeleteOutline } from "@mui/icons-material";
import ConfirmModal from "@/components/ConfirmModal";

interface PRItem {
  product_id: number;
  product_name: string;
  quantity: number;
}

interface PurchaseRequest {
  id: number;
  reference: string;
  warehouse_id: number;
  warehouse_name: string;
  status: string;
  createdAt: string;
  items: PRItem[];
}

export default function PurchaseRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [pr, setPR] = useState<PurchaseRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSendingVendor, setIsSendingVendor] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editedItems, setEditedItems] = useState<PRItem[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openSend, setOpenSend] = useState(false);

  useEffect(() => {
    const fetchPR = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:5000/purchase/request/${id}`);
        setPR(response.data.data);
        setEditedItems(response.data.data.items || []);
      } catch (err: any) {
        setError(err.message || "Failed to load purchase request");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPR();
  }, [id]);

  const refresh = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/purchase/request/${id}`);
    setPR(response.data.data);
    setEditedItems(response.data.data.items);
  } catch (err) {
    console.log(err);
  }
};


  const handleDelete = async () => {
    try {
      setIsEditing(true);
      await axios.delete(`http://localhost:5000/purchase/request/${id}`);
      setSuccessMessage("Purchase request deleted successfully!");
      setTimeout(() => {
        router.push("/purchase-request");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete purchase request");
    } finally {
      setIsEditing(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsEditing(true);
      await axios.put(`http://localhost:5000/purchase/request/${id}`, {
        items: editedItems,
      });
      setSuccessMessage("Purchase request updated successfully!");
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update purchase request");
    } finally {
      setIsEditing(false);
    }
  };

  const handleSendToVendor = async () => {
    try {
      setIsSendingVendor(true);
      await axios.put(`http://localhost:5000/purchase/request/${id}`, {
        status: "PENDING",
      });
      setSuccessMessage("Purchase request sent to vendor!");
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send purchase request to vendor");
    } finally {
      setIsSendingVendor(false);
    }
  };

  const updateItemQuantity = (index: number, newQuantity: number) => {
    const newItems = [...editedItems];
    newItems[index].quantity = newQuantity;
    setEditedItems(newItems);
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

  if (isLoading || isEditing || isSendingVendor) {
    return (
      <>
        <Navbar />
        <Container maxWidth="lg">
          <Box sx={{ py: { xs: 3, md: 4 } }}>
            <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
            <CardSection>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={40} />
                ))}
              </Box>
            </CardSection>
          </Box>
        </Container>
      </>
    );
  }

  if (error || !pr) {
    return (
      <>
        <Navbar />
        <Container maxWidth="lg">
          <Box sx={{ py: { xs: 3, md: 4 } }}>
            <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError(null)}>
              {error || "Purchase request not found"}
            </Alert>
          </Box>
        </Container>
      </>
    );
  }

  const isDraft = pr.status?.toUpperCase() === "DRAFT";

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 3, md: 4 } }}>
          {/* Back Button and Header */}
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/purchase-request")}
              sx={{
                color: (theme) => theme.palette.text.primary,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { backgroundColor: "#f0f4f8" },
              }}
            >
              Back
            </Button>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                Purchase Request Details
              </Typography>
            </Box>
            {isDraft && (
              <Button
                variant="contained"
                onClick={() => setOpenDelete(true)}
                startIcon={<DeleteOutline />}
                sx={{
                  backgroundColor: "#ef4444",
                  fontWeight: 500,
                  boxShadow: "0 2px 10px rgba(239,68,68,0.25)",
                }}
              >
                Delete PR
              </Button>
            )}

            <Chip label={pr.status} color={getStatusChipColor(pr.status)} sx={{ fontWeight: 600 }} />
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* PR Overview */}
          <CardSection title="Request Information" sx={{ mb: 3 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: (theme) => theme.palette.text.secondary, mb: 0.5 }}>
                  Reference
                </Typography>
                <Typography variant="h6" sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 600 }}>
                  {pr.reference}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: (theme) => theme.palette.text.secondary, mb: 0.5 }}>
                  Warehouse
                </Typography>
                <Typography variant="h6" sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 600 }}>
                  {pr.warehouse_name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: (theme) => theme.palette.text.secondary, mb: 0.5 }}>
                  Status
                </Typography>
                <Chip label={pr.status} color={getStatusChipColor(pr.status)} size="small" sx={{ fontWeight: 600 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: (theme) => theme.palette.text.secondary, mb: 0.5 }}>
                  Created At
                </Typography>
                <Typography variant="h6" sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 600 }}>
                  {new Date(pr.createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </Box>
          </CardSection>

          {/* Items Table */}
          <CardSection title="Items" sx={{ mb: 3 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: (theme) => theme.palette.background.default, borderBottom: "1px solid #e2e8f0" }}>
                    <TableCell sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary }}>Product</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
                      Quantity
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {editedItems.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: (theme) => theme.palette.action.hover },
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <TableCell sx={{ color: (theme) => theme.palette.text.primary }}>{item.product_name}</TableCell>
                      <TableCell align="right">
                        {isDraft ? (
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateItemQuantity(index, isNaN(val) ? "" : val);
                            }}
                            style={{
                              border: "1px solid #e2e8f0",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              width: "70px",
                              fontSize: "0.95rem",
                              fontWeight: 500,
                            }}
                          />
                        ) : (
                          <span style={{ fontWeight: 500, color: (theme) => theme.palette.text.primary }}>{item.quantity}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardSection>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {isDraft && (
              <>
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  disabled={isEditing}
                  startIcon={<SaveIcon />}
                  sx={{
                    backgroundColor: "#0066cc",
                    fontWeight: 500,
                    boxShadow: "0 2px 10px rgba(0, 102, 204, 0.2)",
                  }}
                >
                  {isEditing ? "Updating..." : "Update PR"}
                </Button>

                <Button
                  variant="contained"
                  onClick={() => setOpenSend(true)}
                  disabled={isSendingVendor}
                  startIcon={<SendIcon />}
                  sx={{
                    backgroundColor: "#10b981",
                    fontWeight: 500,
                    boxShadow: "0 2px 10px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  {isSendingVendor ? "Sending..." : "Send to Vendor"}
                </Button>
              </>
            )}
          </Box>

          {/* Success Notification */}
          <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage("")}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              {successMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
      <ConfirmModal
        isDelete={true}
        open={openDelete}
        title="Delete Purchase Request"
        description="Are you sure you want to delete this PR? This action cannot be undone."
        loading={isEditing}
        onCancel={() => setOpenDelete(false)}
        onConfirm={async () => {
          await handleDelete();
          setOpenDelete(false);
        }}
      />
      <ConfirmModal
        isSend={true}
        open={openSend}
        title="Send Purchase Request to Vendor"
        description="Are you sure you want to send this PR to the vendor? This action cannot be undone."
        loading={isEditing}
        onCancel={() => setOpenSend(false)}
        onConfirm={async () => {
          await handleSendToVendor();
          setOpenSend(false);
        }}
      />
    </>
  );
}
