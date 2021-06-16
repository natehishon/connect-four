const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/in-progress/:id", authorization, async (req, res) => {
    try {

        const newGames = await pool.query("" +
            "SELECT * FROM games WHERE " +
            "status = 'NEW_GAME' and " +
            "player_one_id <> $1"
            , [req.params.id]);

        return res.json({
            newGames: newGames.rows,
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
            "(status = 'IN_PROGRESS' OR status = 'WON') and " +
            "(player_one_id = $1 OR player_two_id = $1)"
            , [req.params.id]);

        return res.json(resumeGames.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

router.post("/new", authorization, async (req, res) => {
    try {
        const {user_id, name} = req.body;

        await pool.query("INSERT into games (status, player_one_id, name, current_turn) VALUES ($1, $2, $3, false)", ["NEW_GAME", user_id, name])
        const newGame = await pool.query("SELECT * FROM games ORDER BY game_id DESC LIMIT 1")

        return res.json(newGame.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

});

router.post("/join/:id", authorization, async (req, res) => {

    try {
        const {user_id} = req.body;
        const gameId = req.params.id;
        await pool.query("UPDATE games set STATUS = 'IN_PROGRESS', player_two_id = $1 WHERE game_id = $2", [user_id, gameId])

        return res.json({success: true});

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

});

router.post("/save/:id", authorization, async (req, res) => {
    try {

        const {board, turn, status} = req.body;
        const gameId = req.params.id;

        await pool.query("UPDATE games set saved_game = $1, current_turn = $2, status = $3 WHERE game_id = $4", [JSON.stringify(board), !!turn, status, gameId])
        const savedGame = await pool.query("select * from games where game_id = $1", [gameId])
        return res.json(savedGame.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

router.post("/players/:id", authorization, async (req, res) => {
    try {

        const game = await pool.query("SELECT * FROM games WHERE game_id = $1", [req.params.id]);
        const playerOne = await pool.query("SELECT * FROM users WHERE user_id = $1", [game.rows[0].player_one_id]);
        const playerTwo = await pool.query("SELECT * FROM users WHERE user_id = $1", [game.rows[0].player_two_id]);

        return res.json({
            playerOne: playerOne.rows[0],
            playerTwo: playerTwo.rows[0],
            user: req.user
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

router.post("/:id", authorization, async (req, res) => {
    try {

        const game = await pool.query("" +
            "SELECT * FROM games WHERE " +
            "game_id = $1"
            , [req.params.id]);

        if((game.rows[0].player_one_id !== req.user) && (game.rows[0].player_two_id !== req.user)){
            throw new Error('Not your game!');
        }

        return res.json({
            game: game.rows[0],
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message)
    }
});

module.exports = router;