const express = require("express");
const supabase = require("../supabase");

const router = express.Router();


// -----------------------------
// SIGN UP
// POST /api/auth/signup
// -----------------------------
router.post("/signup", async (req, res) => {

    try {

        const { email, password, full_name } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            full_name
        }
    }
});
        

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Signup failed.",
                error: error.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Signup successful.",
            user: data.user,
            session: data.session
        });

    } catch (error) {

        console.error("Signup error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
});


// -----------------------------
// LOGIN
// POST /api/auth/login
// -----------------------------
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({
                success: false,
                message: "Login failed.",
                error: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: data.user,
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
        });

    } catch (error) {

        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
});


module.exports = router;