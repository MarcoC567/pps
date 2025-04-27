import { Paper, Typography } from "@mui/material";
import { useDataContext } from "../../context/DataContext";


export default function ExportPage() {
    const { sellWish, sellDirect, orderList, productionList, workingTimeList } = useDataContext();

    const exportXML = async () => {
        const xmlContent = `
  <input>
    <qualitycontrol type="no" losequantity="0" delay="0"/>
    <sellwish>
      ${sellWish.map(item => `<item article="${item.article}" quantity="${item.quantity}"/>`).join("\n    ")}
    </sellwish>
    <selldirect>
      ${sellDirect.map(item => `<item article="${item.article}" quantity="${item.quantity}" price="${item.price}" penalty="${item.penalty}"/>`).join("\n    ")}
    </selldirect>
    <orderlist>
      ${orderList.map(order => `<order article="${order.article}" quantity="${order.quantity}" modus="${order.modus}"/>`).join("\n    ")}
    </orderlist>
    <productionlist>
      ${productionList.map(prod => `<production article="${prod.article}" quantity="${prod.quantity}"/>`).join("\n    ")}
    </productionlist>
    <workingtimelist>
      ${workingTimeList.map(wt => `<workingtime station="${wt.station}" shift="${wt.shift}" overtime="${wt.overtime}"/>`).join("\n    ")}
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
                    Export XML File for Simulation
                </Typography>
                <button
                    onClick={exportXML}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 flex items-center gap-2 mx-auto "
                >Generate XML</button>
            </Paper>
        </div>
    );
}