const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {

    try {

        const user = await pool.query("SELECT user_name, user_id FROM users WHERE user_id = $1", [req.user])

        res.json(user.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

});

module.exports = router;