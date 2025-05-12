import { Paper, Typography } from "@mui/material";
import { SalesForecastData } from "../production-plan/SalesForecastTable";
import { DirectSalesData } from "../production-plan/DirectSalesTable";
import { modusOptions } from "../purchase-disposition/const";
import { useLanguage } from "../../context/LanguageContext";
import { OrderEntry } from "../purchase-disposition";

export default function ExportPage() {
  const { t } = useLanguage();
  // Load and parse saved data from localStorage
  const sellWish: SalesForecastData = JSON.parse(
    localStorage.getItem("sellwish") || "[]"
  );

  const sellDirect: DirectSalesData = JSON.parse(
    localStorage.getItem("selldirect") || "[]"
  );

  const orderList: OrderEntry[] = JSON.parse(
    localStorage.getItem("orderList") || "[]"
  );
  const productionOrders = JSON.parse(
    localStorage.getItem("productionOrders") || "[]"
  );

  const workingTimeList = JSON.parse(
    localStorage.getItem("workingtimelist") || "[]"
  );

  console.log("sellWish", sellWish);
  console.log("orderList", orderList);
  console.log("workingTimeList", workingTimeList);
  console.log("ProductionList", productionOrders);

  const exportXML = async () => {
    const xmlContent = `
<input>
  <qualitycontrol type="no" losequantity="0" delay="0"/>
  <sellwish>
    ${sellWish
      .map(
        (item, index) =>
          `<item article="${index + 1}" quantity="${item.current}"/>`
      )
      .join("\n    ")}
  </sellwish>
  <selldirect>
  ${sellDirect
    .map((entry, index) => {
      return `<item article="${index + 1}" quantity="${
        entry.quantity
      }" price="${entry.price}" penalty="${entry.penalty}"/>`;
    })
    .join("\n    ")}
  </selldirect>
  <orderlist>
    ${orderList
      .filter((order) => order.quantity !== 0 && order.modus != "")
      .map(
        (order) =>
          `<order article="${order.article}" quantity="${
            order.quantity
          }" modus="${
            modusOptions.find((option) => option.key == order.modus)?.modus
          }"/>`
      )
      .join("\n    ")}
  </orderlist>
 <productionlist>
  ${productionOrders
    .filter(([, qty]) => qty > 0)
    .map(([code, qty]) => {
      const article = code.replace(/^[A-Za-z]+/, "");
      return `<production article="${article}" quantity="${qty}" />`;
    })
    .join("\n    ")}
</productionlist>
  <workingtimelist>
  ${workingTimeList
    .map(
      (workingTime: { station: string; shift: number; overtime: number }) =>
        `<workingtime station="${workingTime.station}" shift="${workingTime.shift}" overtime="${workingTime.overtime}" />
        `
    )
    .join("\n    ")}
  </workingtimelist>
</input>`.trim();

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "Input_Data_For_Simulation.xml",
        types: [
          {
            description: "XML Files",
            accept: { "application/xml": [".xml"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(xmlContent);
      await writable.close();
    } catch (error) {
      console.error("File save cancelled or failed:", error);
    }
  };

  return (
    <div style={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={4}
        sx={{
          padding: "2rem",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "95vw",
          backgroundColor: "#fafafa",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: "bold", marginBottom: "1rem" }}
        >
          {t("export_xml_title")}
        </Typography>
        <button onClick={exportXML} className={`mt-4 mx-auto my-btn`}>
          {t("xml_download")}
        </button>
      </Paper>
    </div>
  );
}
