const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const uuid = require("uuid")


router.post("/:id", authorization, async (req, res) => {
    try {

        console.log(req.params.id);
        const game = await pool.query("" +
            "SELECT * FROM games WHERE " +
            "game_id = $1"
            , [req.params.id]);


        return res.json({
            game: game.rows[0],
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

router.get("/in-progress/:id", authorization, async (req, res) => {
    try {

        const newGames = await pool.query("" +
            "SELECT * FROM games WHERE " +
            "status = 'NEW_GAME' and " +
            "player_one_id <> $1"
            , [req.params.id]);
        // const progGames = await pool.query("SELECT * FROM games WHERE status = 'IN_PROGRESS' and (player_one_id = $1)", [req.params.id]);

        console.log(newGames.rows);

        return res.json({
            newGames: newGames.rows,
            // progGames: progGames.rows
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});


router.get("/resume/:id", authorization, async (req, res) => {
    try {

        const resumeGames = await pool.query("" +
            "SELECT * FROM games WHERE " +
            "status = 'IN_PROGRESS' and " +
            "(player_one_id = $1 OR player_two_id = $1)"
            , [req.params.id]);
        // const progGames = await pool.query("SELECT * FROM games WHERE status = 'IN_PROGRESS' and (player_one_id = $1)", [req.params.id]);


        return res.json(resumeGames.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

router.post("/new", authorization, async (req, res) => {

    try {

        const {user_id} = req.body;
        const uu = uuid.v4()

        const newGame = await pool.query("INSERT into games (unique_id, status, player_one_id, current_turn) VALUES ($1, $2, $3, false)", [uu, "NEW_GAME", user_id])

        return res.json({ newGame: newGame.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

});

router.post("/join/:id", authorization, async (req, res) => {

    try {

        const {user_id} = req.body;
        const gameId = req.params.id;

        const joinGame = await pool.query("UPDATE games set STATUS = 'IN_PROGRESS', player_two_id = $1 WHERE game_id = $2", [user_id, gameId])

        return res.json({ success: true });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

});

router.post("/save/:id", authorization, async (req, res) => {
    try {

        const {board, turn} = req.body;
        const gameId = req.params.id;

        const update = await pool.query("UPDATE games set saved_game = $1, current_turn = $2 WHERE game_id = $3", [JSON.stringify(board), !!turn, gameId])
        const savedGame = await pool.query("select * from games where game_id = $1", [gameId])
        return res.json(savedGame.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

module.exports = router;