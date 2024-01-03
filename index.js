const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'retro_game_store',
    password: '1234',
    port: 5432,
});

app.get('/', (req, res) => {
    res.send('Welcome to the Retro Game Store API! Please use /games to access the games database.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));