const { createClient } = require("@supabase/supabase-js");

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required."
            });
        }

        const token = authHeader.split(" ")[1];

        const userSupabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_PUBLISHABLE_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );

        const {
            data: { user },
            error
        } = await userSupabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        req.user = user;
        req.supabase = userSupabase;

        next();

    } catch (error) {
        console.error("Authentication middleware error:", error);

        return res.status(500).json({
            success: false,
            message: "Authentication failed.",
            error: error.message
        });
    }
};

module.exports = authenticateUser;