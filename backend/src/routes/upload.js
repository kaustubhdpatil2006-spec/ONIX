const express = require("express");
const multer = require("multer");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.post(
    "/",
    authenticateUser,
    upload.fields([
        { name: "frontImage", maxCount: 1 },
        { name: "backImage", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const frontImage = req.files?.frontImage?.[0];
            const backImage = req.files?.backImage?.[0];

            if (!frontImage || !backImage) {
                return res.status(400).json({
                    success: false,
                    message: "Both front and back images are required."
                });
            }

            const { product_id } = req.body;

            const timestamp = Date.now();

            const frontFileName =
                `front_${timestamp}_${frontImage.originalname}`;

            const backFileName =
                `back_${timestamp}_${backImage.originalname}`;

            // Upload front image using authenticated Supabase client
            const { error: frontUploadError } = await req.supabase
                .storage
                .from("product-images")
                .upload(frontFileName, frontImage.buffer, {
                    contentType: frontImage.mimetype,
                    upsert: false
                });

            if (frontUploadError) {
                console.error(
                    "Front image upload error:",
                    frontUploadError
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to upload front image.",
                    error: frontUploadError.message
                });
            }

            // Upload back image using authenticated Supabase client
            const { error: backUploadError } = await req.supabase
                .storage
                .from("product-images")
                .upload(backFileName, backImage.buffer, {
                    contentType: backImage.mimetype,
                    upsert: false
                });

            if (backUploadError) {
                console.error(
                    "Back image upload error:",
                    backUploadError
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to upload back image.",
                    error: backUploadError.message
                });
            }

            // Generate public URLs
            const { data: frontUrlData } = req.supabase
                .storage
                .from("product-images")
                .getPublicUrl(frontFileName);

            const { data: backUrlData } = req.supabase
                .storage
                .from("product-images")
                .getPublicUrl(backFileName);

            const frontImageUrl = frontUrlData.publicUrl;
            const backImageUrl = backUrlData.publicUrl;

            // Create scan record in Supabase
            const { data: scanData, error: insertError } =
                await req.supabase
                    .from("scans")
                    .insert({
                        front_image_url: frontImageUrl,
                        back_image_url: backImageUrl,
                        status: "uploaded",
                        user_id: req.user.id,
                        product_id: product_id || null
                    })
                    .select()
                    .single();

            if (insertError) {
                console.error("Scan insert error:", insertError);

                return res.status(500).json({
                    success: false,
                    message:
                        "Images uploaded, but failed to create scan record.",
                    error: insertError.message
                });
            }

            return res.status(201).json({
                success: true,
                message: "Scan created successfully!",
                scan_id: scanData.id,
                front_image_url: frontImageUrl,
                back_image_url: backImageUrl,
                scan: scanData
            });

        } catch (error) {
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