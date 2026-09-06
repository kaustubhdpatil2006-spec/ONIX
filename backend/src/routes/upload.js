const express = require("express");
const multer = require("multer");
const supabase = require("../supabase");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.post("/upload", upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 }
]), async (req, res) => {

    try {
        const frontImage = req.files?.frontImage?.[0];
        const backImage = req.files?.backImage?.[0];

        if (!frontImage || !backImage) {
            return res.status(400).json({
                success: false,
                message: "Both front and back images are required."
            });
        }

        res.json({
            success: true,
            message: "Images received successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;