const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    user: 'aaronkern',
    host: 'localhost',
    database: 'retro_game_store',
    password: '1234',
    port: 5432,
});

app.get('/', (req, res) => {
    res.send('Welcome to the Retro Game Store API! Please use /games to access the games database.');
});

// GET endpoint to retrieve all games
app.get('/games', async (req, res) => {
    try {
        const allGames = await pool.query(
            'SELECT games.*, consoles.name AS console_name FROM games LEFT JOIN consoles ON games.console_id = consoles.id'
        );
        res.json(allGames.rows);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// GET endpoint to retrieve all consoles
app.get('/consoles', async (req, res) => {
    try {
        const allConsoles = await pool.query('SELECT * FROM consoles');
        res.json(allConsoles.rows);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// POST endpoint to add a new game
app.post('/games', async (req, res) => {
    try {
        const { name, price, console_id, for_sale, condition, is_boxed } = req.body;
        const newGame = await pool.query(
            'INSERT INTO games (name, price, console_id, for_sale, condition, is_boxed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, price, console_id, for_sale, condition, is_boxed]
        );
        res.status(201).json(newGame.rows[0]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// POST endpoint to add a new console 
app.post('/consoles', async (req, res) => {
    try {
        const { name, manufacturer, release_year, condition, is_working, is_boxed } = req.body;
        const newConsole = await pool.query(
            'INSERT INTO consoles (name, manufacturer, release_year, condition, is_working, is_boxed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, manufacturer, release_year, condition, is_working, is_boxed]
        );
        res.status(201).json(newConsole.rows[0]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// PUT endpoint to update a game
app.put('/games/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, console_id, for_sale, condition, is_boxed } = req.body;
        const updateGame = await pool.query(
            'UPDATE games SET name = $1, price = $2, console_id = $3, for_sale = $4, condition = $5, is_boxed = $6 WHERE id = $7 RETURNING *',
            [name, price, console_id, for_sale, condition, is_boxed, id]
        );
        res.json(updateGame.rows[0]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// PUT endpoint to update a console
app.put('/consoles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, manufacturer, release_year, condition, is_working, is_boxed } = req.body;
        const updateConsole = await pool.query(
            'UPDATE consoles SET name = $1, manufacturer = $2, release_year = $3, condition = $4, is_working = $5, is_boxed = $6 WHERE id = $7 RETURNING *',
            [name, manufacturer, release_year, condition, is_working, is_boxed, id]
        );
        res.json(updateConsole.rows[0]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// DELETE endpoint to delete a game
app.delete('/games/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteGame = await pool.query('DELETE FROM games WHERE id = $1', [id]);
        res.json(deleteGame.rows[0]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// DELETE endpoint to delete a console
app.delete('/consoles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteConsole = await pool.query('DELETE FROM consoles WHERE id = $1', [id]);
        res.json(deleteConsole.rows[0]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));