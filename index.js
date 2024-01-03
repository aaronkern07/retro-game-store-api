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
        const allGames = await pool.query('SELECT * FROM games');
        res.json(allGames.rows);
    } catch (err) {
        res.status(400).send(err.message);
    }
});


// POST endpoint to add a new game
app.post('/games', async (req, res) => {
try {
    const { name, price } = req.body;
    const newGame = await pool.query(
    'INSERT INTO games (name, price) VALUES ($1, $2) RETURNING *',
    [name, price]
    );
    res.status(201).json(newGame.rows[0]);
} catch (err) {
    res.status(400).send(err.message);
}
});
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));