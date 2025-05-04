import { Paper, Typography } from "@mui/material";
import { OrderEntry } from "../purchase-disposition/PurchaseDispositionTable";
import { SalesForecastData } from "../production-plan/SalesForecastTable";
import { modusDictionary } from "../purchase-disposition/const";

export default function ExportPage() {
    // Load and parse saved data from localStorage
    const sellWish: SalesForecastData = JSON.parse(localStorage.getItem("sellwish") || "[]");
    //const sellDirect = JSON.parse(localStorage.getItem("sellDirect") || "[]");
    const orderList: OrderEntry[] = JSON.parse(localStorage.getItem("orderList") || "[]");
    // const productionList = JSON.parse(localStorage.getItem("productionList") || "[]");
    // const workingTimeList = JSON.parse(localStorage.getItem("workingTimeList") || "[]");

    console.log("sellWish", sellWish);
    console.log("orderList", orderList);

    const exportXML = async () => {
        const xmlContent = `
<input>
  <qualitycontrol type="no" losequantity="0" delay="0"/>
  <sellwish>
    ${sellWish.map((item, index) => `<item article="${index + 1}" quantity="${item.current}"/>`).join("\n    ")}
  </sellwish>
  <selldirect>
    
  </selldirect>
  <orderlist>
    ${orderList
                .filter(order => order.quantity !== 0 && order.modus != "")
                .map(order => `<order article="${order.article}" quantity="${order.quantity}" modus="${modusDictionary[order.modus].modus}"/>`)
                .join("\n    ")}
  </orderlist>
  <productionlist>
    
  </productionlist>
  <workingtimelist>
    
  </workingtimelist>
</input>`.trim();

        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: "simulation.xml",
                types: [{
                    description: 'XML Files',
                    accept: { 'application/xml': ['.xml'] },
                }],
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
                    Export XML Inputfile für Simulation
                </Typography>
                <button
                    onClick={exportXML}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 flex items-center gap-2 mx-auto "
                >
                    XML herunterladen
                </button>
            </Paper>
        </div>
    );
}
