const uploadRoutes = require("./src/routes/upload");
const productRoutes = require("./src/routes/product");
const express = require("express");
const supabase = require("./src/supabase");

const app = express();
app.use(express.json());
app.use("/api/scans", uploadRoutes);
app.use("/api/products", productRoutes);
console.log("UPLOAD ROUTE LOADED");
app.get("/", (req, res) => {
    res.send("Hello ONIX");
});

app.get("/test-supabase", async (req, res) => {
    const { data, error } = await supabase
        .from("scans")
        .select("*")
        .limit(1);

    if (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }

    res.json({
        success: true,
        message: "Supabase connected successfully!",
        data: data
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});