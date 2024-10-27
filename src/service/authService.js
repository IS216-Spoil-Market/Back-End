const dotenv = require("dotenv");
const { auth } = require("express-oauth2-jwt-bearer");
const axios = require("axios");

dotenv.config();

/**
 * Type: Middleware
 *
 * Purpose: Validate JWT Token to protect routes
 *
 * @returns {e.Handler}
 */
const checkJwt = (req, res, next) =>
    auth({
        audience: process.env.AUDIENCE,
        issuerBaseURL: process.env.AUTH0_DOMAIN,
    })(req, res, next);

/**
 * Type: Middleware
 *
 * Purpose: Fetch user info based on token from Auth0
 *
 * Pre-requisite: Must call checkJwt middleware first
 *
 * @returns {Promise<void>}
 */
const fetchUserInfo = async (req, res, next) => {
    try {
        const { data } = await axios.get(
            `${process.env.AUTH0_DOMAIN}/userinfo`,
            {
                headers: {
                    Authorization: `Bearer ${req.auth.token}`,
                },
            }
        );

        req.user = data;

        next();
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            code: 500,
            error: "Internal Server Error",
            message: "Unable to retrieve user info from Auth0",
        });
    }
};

module.exports = {
    checkJwt,
    fetchUserInfo,
};
