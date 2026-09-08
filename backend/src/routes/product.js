const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

router.post("/", authenticateUser, async (req, res) => {
    try {
        const {
            product_name,
            brand_name,
            category,
            manufacturer_name,
            manufacturer_address,
            country_of_origin
        } = req.body;

        if (!product_name) {
            return res.status(400).json({
                success: false,
                message: "Product name is required."
            });
        }

        const { data: productData, error: productError } = await req.supabase
            .from("products")
            .insert({
                product_name,
                brand_name,
                category,
                manufacturer_name,
                manufacturer_address,
                country_of_origin
            })
            .select()
            .single();

        if (productError) {
            console.error("Product creation error:", productError);

            return res.status(500).json({
                success: false,
                message: "Failed to create product.",
                error: productError.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Product created successfully!",
            product: productData
        });

    } catch (error) {
        console.error("Product route error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
});

module.exports = router;