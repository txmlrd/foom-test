"use client";

import { Container, Box, Typography, Card, CardContent, Grid, useTheme } from "@mui/material";
import { Inventory2Outlined, ShoppingCartOutlined, AddCircleOutlineOutlined } from "@mui/icons-material";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const theme = useTheme();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cards = [
    {
      id: "stocks",
      icon: Inventory2Outlined,
      title: "Stock Dashboard",
      subtitle: "Manage Inventory",
      description: "View and manage your current stock levels across all warehouses in real-time.",
      href: "/stocks",
      color: "#3b82f6",
      accentColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      id: "requests",
      icon: ShoppingCartOutlined,
      title: "Purchase Requests",
      subtitle: "Purchase Orders",
      description: "Track, manage, and monitor all your purchase requests and vendor orders.",
      href: "/purchase-request",
      color: "#8b5cf6",
      accentColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      id: "create",
      icon: AddCircleOutlineOutlined,
      title: "Create Request",
      subtitle: "New Purchase Order",
      description: "Quickly create a new purchase request for your inventory needs and requirements.",
      href: "/purchase-request/new",
      color: "#10b981",
      accentColor: "rgba(16, 185, 129, 0.1)",
    },
  ];

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
                background: theme.palette.mode === "dark" ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #0066cc 0%, #6366f1 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Inventory Allocation System
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "1.1rem",
              }}
            >
              Foom Lab Global Test Project Junior Software Engineer
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr",
              },
              gap: 3,
              alignItems: "stretch",
            }}
          >
            {cards.map((card) => {
              const IconComponent = card.icon;
              const isHovered = hoveredCard === card.id;

              return (
                <Grid key={card.id}>
                  <Link href={card.href} style={{ textDecoration: "none" }}>
                    <Card
                      onMouseEnter={() => setHoveredCard(card.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                        background: theme.palette.mode === "dark" ? (isHovered ? "rgba(30, 41, 59, 0.8)" : "#1e293b") : isHovered ? "#f8fafc" : "#ffffff",
                        border: `2px solid ${isHovered ? card.color : theme.palette.divider}`,
                        boxShadow: isHovered ? `0 12px 32px ${card.accentColor}` : theme.palette.mode === "dark" ? "0 2px 10px rgba(0, 0, 0, 0.3)" : "0 2px 10px rgba(0, 0, 0, 0.06)",
                        "&:hover": {
                          transform: "translateY(-8px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: isHovered ? card.accentColor : "transparent",
                            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          <IconComponent
                            sx={{
                              fontSize: 32,
                              color: card.color,
                              transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                              transform: isHovered ? "scale(1.1)" : "scale(1)",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: card.accentColor,
                            opacity: isHovered ? 1 : 0.6,
                            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          <AddCircleOutlineOutlined
                            sx={{
                              fontSize: 24,
                              color: card.color,
                              transform: isHovered ? "rotate(90deg) scale(1.1)" : "rotate(0deg)",
                              transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          />
                        </Box>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: card.color,
                            fontWeight: 600,
                            mb: 0.5,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {card.subtitle}
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {card.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: 1.6,
                            flex: 1,
                          }}
                        >
                          {card.description}
                        </Typography>
                      </CardContent>

                      <Box sx={{ p: 3, pt: 0 }}>
                        <Box
                          sx={{
                            py: 1.5,
                            px: 2,
                            borderRadius: 1,
                            background: isHovered ? card.color : theme.palette.mode === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(0, 102, 204, 0.08)",
                            color: isHovered ? "#ffffff" : card.color,
                            fontWeight: 600,
                            textAlign: "center",
                            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: "pointer",
                            fontSize: "0.95rem",
                          }}
                        >
                          Explore →
                        </Box>
                      </Box>
                    </Card>
                  </Link>
                </Grid>
              );
            })}
          </Box>

          <Box sx={{ mt: 6, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography sx={{ color: theme.palette.text.primary, textAlign: "left" }}>
              Made by <span className="font-bold">Adhi Sanjaya</span>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}
