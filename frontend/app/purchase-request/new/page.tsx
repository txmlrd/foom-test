"use client";

import { useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PRForm from "@/components/PRForm";
import AddIcon from "@mui/icons-material/Add";

export default function CreatePurchaseRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await axios.post("http://localhost:5000/purchase/request", data);
      setSuccessMessage("Purchase request created successfully!");
      setTimeout(() => {
        router.push("/purchase-request");
      }, 2000);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to create purchase request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 3, md: 4 } }}>
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  backgroundColor: "#e6f2ff",
                  color: "#0066cc",
                }}
              >
                <AddIcon />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: (theme) => theme.palette.text.primary,
                  m: 0,
                }}
              >
                Create Purchase Request
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: "#64748b", ml: 7 }}>
              Fill in the details below to create a new purchase request
            </Typography>
          </Box>

          {/* Form */}
          <PRForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

          {/* Success Notification */}
          <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage("")}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              {successMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </>
  );
}
