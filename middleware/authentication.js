const jwt = require('jsonwebtoken')
require('dotenv').config();

const authentication = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // Check if Authorization header is present
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token is missing or malformed" });
        }

        const token = authHeader.split(" ")[1];

        // Verify the token
        jwt.verify(token, process.env.secret_key, (err, auth) => {
            if (err) {
                // Handle token verification errors
                return res.status(401).json({ message: "Invalid or expired token", error: err.message });
            }

            // Attach user information to the request object
            req.user = {
                adminId: auth.id,
                role: auth.role,
                name: auth.name,
                userName: auth.userName,
            };

            next(); // Proceed to the next middleware
        });
    } catch (error) {
        // Catch any unexpected errors
        res.status(500).json({ message: "An error occurred during authentication", error: error.message });
    }
};

module.exports = authentication;
