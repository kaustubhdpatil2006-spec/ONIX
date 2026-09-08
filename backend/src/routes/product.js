const express = require("express");
const supabase = require("../supabase");

const router = express.Router();


// POST /api/products
router.post("/", async (req, res) => {

    try {

        const {
            product_name,
            brand_name,
            category,
            manufacturer_name,
            manufacturer_address,
            country_of_origin
        } = req.body;


        // Check required field
        if (!product_name) {
            return res.status(400).json({
                success: false,
                message: "Product name is required."
            });
        }


        // Insert product into Supabase
        const { data: productData, error: productError } = await supabase
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


        // Handle database error
        if (productError) {

            console.error("Product creation error:", productError);

            return res.status(500).json({
                success: false,
                message: "Failed to create product.",
                error: productError.message
            });
        }


        // Success
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