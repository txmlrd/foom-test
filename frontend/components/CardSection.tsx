import * as React from "react";
import { Box, Paper, Typography, type PaperProps } from "@mui/material";

interface CardSectionProps extends PaperProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function CardSection({ title, icon, children, sx, ...rest }: CardSectionProps) {
  return (
    <Paper
      {...rest}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) => theme.palette.background.paper,
        boxShadow: (theme) => theme.shadows[1],
        ...sx,
      }}
    >
      {title && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          {icon}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: (theme) => theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
        </Box>
      )}

      {children}
    </Paper>
  );
}
