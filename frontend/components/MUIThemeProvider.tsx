"use client"

import type React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { createContext, useState, useMemo } from "react"
import EmotionCache from "./EmotionCache"

export const ThemeContext = createContext({ toggleTheme: () => {} })

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0066cc",
      light: "#e6f2ff",
      dark: "#0052a3",
    },
    secondary: {
      main: "#6366f1",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a202c",
      secondary: "#64748b",
    },
    success: {
      main: "#10b981",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
    divider: "#e2e8f0",
  },
  typography: {
    fontFamily: '"Geist", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", sans-serif',
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.1rem",
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      color: "#64748b",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.875rem",
      color: "#64748b",
    },
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 2px 10px rgba(0, 0, 0, 0.06)",
    "0 4px 12px rgba(0, 0, 0, 0.08)",
    "0 8px 20px rgba(0, 0, 0, 0.1)",
    ...Array(21).fill("0 8px 20px rgba(0, 0, 0, 0.1)"),
  ] as any,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#f8fafc",
          "& .MuiTableCell-head": {
            fontWeight: 600,
            color: "#1a202c",
            backgroundColor: "#f8fafc",
            borderColor: "#e2e8f0",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-root": {
            "&:nth-of-type(even)": {
              backgroundColor: "#fafbfc",
            },
            "&:hover": {
              backgroundColor: "#f0f4f8",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
        contained: {
          boxShadow: "0 2px 10px rgba(0, 102, 204, 0.2)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #e2e8f0",
        },
      },
    },
  },
})

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      light: "#1e3a8a",
      dark: "#60a5fa",
    },
    secondary: {
      main: "#8b5cf6",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
    success: {
      main: "#10b981",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
    divider: "#334155",
  },
  typography: {
    fontFamily: '"Geist", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", sans-serif',
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.1rem",
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      color: "#94a3b8",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.875rem",
      color: "#94a3b8",
    },
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 2px 10px rgba(0, 0, 0, 0.3)",
    "0 4px 12px rgba(0, 0, 0, 0.4)",
    "0 8px 20px rgba(0, 0, 0, 0.5)",
    ...Array(21).fill("0 8px 20px rgba(0, 0, 0, 0.5)"),
  ] as any,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          border: "1px solid #334155",
          backgroundColor: "#1e293b",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#0f172a",
          "& .MuiTableCell-head": {
            fontWeight: 600,
            color: "#f1f5f9",
            backgroundColor: "#0f172a",
            borderColor: "#334155",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-root": {
            "&:nth-of-type(even)": {
              backgroundColor: "rgba(30, 41, 59, 0.5)",
            },
            "&:hover": {
              backgroundColor: "rgba(71, 85, 105, 0.2)",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
        contained: {
          boxShadow: "0 2px 10px rgba(59, 130, 246, 0.3)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #334155",
          backgroundColor: "#1e293b",
        },
      },
    },
  },
})

export default function MUIThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)

  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  return (
    <EmotionCache>
      <ThemeContext.Provider value={{ toggleTheme }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeContext.Provider>
    </EmotionCache>
  )
}
