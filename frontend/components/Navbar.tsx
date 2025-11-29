"use client";

import Link from "next/link";
import { AppBar, Toolbar, Container, Button, Box, IconButton, Tooltip } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useContext, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { ThemeContext } from "./MUIThemeProvider";

export default function Navbar() {
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);
  const isDark = theme.palette.mode === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppBar
      position="sticky"
      sx={{
        mb: 4,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 }, py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 1,
                background: isDark ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #0066cc 0%, #6366f1 100%)",
                color: "white",
                transition: "all 0.3s ease",
              }}
            >
              <InventoryIcon fontSize="small" />
            </Box>
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Box
                sx={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: theme.palette.text.primary,
                  transition: "color 0.3s ease",
                }}
              >
                Inventory Allocation System
              </Box>
            </Link>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <Link href="/stocks" style={{ textDecoration: "none" }}>
              <Button
                color="inherit"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: "transparent",
                  },
                }}
              >
                Stocks
              </Button>
            </Link>
            <Link href="/purchase-request" style={{ textDecoration: "none" }}>
              <Button
                color="inherit"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: "transparent",
                  },
                }}
              >
                Requests
              </Button>
            </Link>

            <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
              <IconButton
                onClick={toggleTheme}
                disabled={!mounted}
                sx={{
                  ml: 1,
                  color: theme.palette.text.secondary,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isDark ? "rotate(180deg)" : "rotate(0deg)",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(0, 102, 204, 0.1)",
                  },
                }}
              >
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Link href="/purchase-request/new" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  ml: 1,
                  background: isDark ? "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)" : "linear-gradient(135deg, #0066cc 0%, #0052a3 100%)",
                  color: "white",
                  fontWeight: 500,
                  boxShadow: isDark ? "0 2px 10px rgba(59, 130, 246, 0.3)" : "0 2px 10px rgba(0, 102, 204, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: isDark ? "0 6px 20px rgba(59, 130, 246, 0.4)" : "0 6px 20px rgba(0, 102, 204, 0.3)",
                    transform: "translateY(-2px)",
                  },
                }}
                startIcon={<AddIcon />}
              >
                Create
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
