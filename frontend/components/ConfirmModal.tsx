"use client";

import { Box, Button, Typography } from "@mui/material";
import React from "react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  isDelete?: boolean;
  isSend?: boolean;
}

export default function ConfirmModal({ open, title = "Are you sure?", description = "This action cannot be undone.", onCancel, onConfirm, loading = false, isDelete = false, isSend = false }: ConfirmModalProps) {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          color: (theme) => theme.palette.text.primary,
          width: "90%",
          maxWidth: 420,
          borderRadius: 3,
          p: 3,
          boxShadow: "0 6px 30px rgba(0,0,0,0.2)",
          animation: "scaleIn 0.25s ease-out",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 3 }}>{description}</Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={onCancel}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              px: 2.5,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color={isDelete ? "error" : "success"}
            disabled={loading}
            onClick={onConfirm}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              color: "#fff",
            }}
          >
            {isDelete && <span>{loading ? "Deleting..." : "Delete"}</span>}

            {isSend && <span>{loading ? "Sending..." : "Send to Vendor"}</span>}
          </Button>
        </Box>
      </Box>

      {/* animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
}
