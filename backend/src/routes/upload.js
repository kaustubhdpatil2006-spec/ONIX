const express = require("express");
const multer = require("multer");
const supabase = require("../supabase");

const router = express.Router();


// -----------------------------
// Multer configuration
// -----------------------------
const upload = multer({
    storage: multer.memoryStorage()
});


// -----------------------------
// POST /api/scans
// -----------------------------
router.post(
    "/",
    upload.fields([
        { name: "frontImage", maxCount: 1 },
        { name: "backImage", maxCount: 1 }
    ]),
    async (req, res) => {

        try {

            // -----------------------------
            // Get uploaded images
            // -----------------------------
            const frontImage = req.files?.frontImage?.[0];
            const backImage = req.files?.backImage?.[0];


            // -----------------------------
            // Check both images exist
            // -----------------------------
            if (!frontImage || !backImage) {

                return res.status(400).json({
                    success: false,
                    message: "Both front and back images are required."
                });

            }


            // -----------------------------
            // Create unique file names
            // -----------------------------
            const timestamp = Date.now();

            const frontFileName =
                `front_${timestamp}_${frontImage.originalname}`;

            const backFileName =
                `back_${timestamp}_${backImage.originalname}`;


            // -----------------------------
            // Upload FRONT image
            // -----------------------------
            const { error: frontUploadError } = await supabase
                .storage
                .from("product-images")
                .upload(
                    frontFileName,
                    frontImage.buffer,
                    {
                        contentType: frontImage.mimetype,
                        upsert: false
                    }
                );


            if (frontUploadError) {

                console.error("Front image upload error:", frontUploadError);

                return res.status(500).json({
                    success: false,
                    message: "Failed to upload front image.",
                    error: frontUploadError.message
                });

            }


            // -----------------------------
            // Upload BACK image
            // -----------------------------
            const { error: backUploadError } = await supabase
                .storage
                .from("product-images")
                .upload(
                    backFileName,
                    backImage.buffer,
                    {
                        contentType: backImage.mimetype,
                        upsert: false
                    }
                );


            if (backUploadError) {

                console.error("Back image upload error:", backUploadError);

                return res.status(500).json({
                    success: false,
                    message: "Failed to upload back image.",
                    error: backUploadError.message
                });

            }


            // -----------------------------
// Get PUBLIC URLs (bucket is public)
// -----------------------------
const { data: frontUrlData } = supabase
    .storage
    .from("product-images")
    .getPublicUrl(frontFileName);

const { data: backUrlData } = supabase
    .storage
    .from("product-images")
    .getPublicUrl(backFileName);

const frontImageUrl = frontUrlData.publicUrl;
const backImageUrl = backUrlData.publicUrl;


            // -----------------------------
            // Insert scan into database
            // -----------------------------
            const { data: scanData, error: insertError } = await supabase
                .from("scans")
                .insert({
                    front_image_url: frontImageUrl,
                    back_image_url: backImageUrl,
                    status: "uploaded"
                })
                .select()
                .single();


            // -----------------------------
            // Check database insertion
            // -----------------------------
            if (insertError) {

                console.error("Scan insert error:", insertError);

                return res.status(500).json({
                    success: false,
                    message: "Images uploaded, but failed to create scan record.",
                    error: insertError.message
                });

            }


            // -----------------------------
            // SUCCESS
            // -----------------------------
            return res.status(201).json({

                success: true,

                message: "Scan created successfully!",

                scan_id: scanData.id,

                front_image_url: frontImageUrl,

                back_image_url: backImageUrl,

                scan: scanData

            });

        }


        // -----------------------------
        // Catch unexpected errors
        // -----------------------------
        catch (error) {

            console.error("Upload route error:", error);

            return res.status(500).json({
                success: false,
                message: "Something went wrong.",
                error: error.message
            });

        }

    }
);


module.exports = router;