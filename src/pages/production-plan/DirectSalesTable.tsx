import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext.tsx";

type DirectSalesData = {
  product: string;
  quantity: number;
  price: number;
  penalty: number;
}[];

const productToArticleId: Record<string, number> = {
  p1ChildrenBike: 1,
  p2WomenBike: 2,
  p3MenBike: 3,
};

export default function DirectSalesTable(props: {
  directSalesData: DirectSalesData;
}) {
  const [directSalesData, setDirectSalesData] = useState<DirectSalesData>([]);

  useEffect(() => {
    setDirectSalesData(props.directSalesData);
  }, [props.directSalesData]);

  const handleChange = (
    index: number,
    key: "quantity" | "price" | "penalty",
    value: string
  ) => {
    const updated = [...directSalesData];
    updated[index][key] = Number(value) || 0;
    setDirectSalesData(updated);
    saveToLocalStorage(updated);
  };

  const saveToLocalStorage = (data: DirectSalesData) => {
    const xmlData = `<selldirect>\n${data
      .map((row) => {
        const articleId = productToArticleId[row.product];
        return `  <item article="${articleId}" quantity="${row.quantity}" price="${row.price}" penalty="${row.penalty}"/>`;
      })
      .join("\n")}\n</selldirect>`;
    localStorage.setItem("selldirect", xmlData);
  };

  const total = directSalesData.reduce(
    (acc, row) => ({
      quantity: acc.quantity + row.quantity,
      price: acc.price + row.price,
      penalty: acc.penalty + row.penalty,
    }),
    { quantity: 0, price: 0, penalty: 0 }
  );

  const { t } = useLanguage();

  return (
    <div style={{ marginTop: "3rem", padding: "1rem" }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
      >
        {t("directSales")}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          maxWidth: 700,
          margin: "0 auto",
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell sx={{ fontWeight: "bold" }}>{t("product")}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {t("quantity")}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {t("price")}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {t("penalty")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {directSalesData.map((row, idx) => (
              <TableRow
                key={idx}
                hover
                sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell>{t(row.product)}</TableCell>
                {["quantity", "price", "penalty"].map((key) => (
                  <TableCell key={key} align="center">
                    <TextField
                      type="number"
                      value={row[key as keyof typeof row]}
                      onChange={(e) =>
                        handleChange(
                          idx,
                          key as "quantity" | "price" | "penalty",
                          e.target.value
                        )
                      }
                      variant="outlined"
                      size="small"
                      sx={{
                        width: "5rem",
                        input: {
                          textAlign: "center",
                          padding: "6px",
                          borderRadius: "8px",
                          backgroundColor: "#fdfdfd",
                          border: "1px solid #ccc",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>{t("sum")}:</strong>
              </TableCell>
              <TableCell align="center">
                <strong>{total.quantity}</strong>
              </TableCell>
              <TableCell align="center">
                <strong>{total.price.toFixed(2)}</strong>
              </TableCell>
              <TableCell align="center">
                <strong>{total.penalty.toFixed(2)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
