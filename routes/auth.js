const { Router } = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../utils/connect');
const jwt = require('jsonwebtoken');

module.exports = Router()
    .post("/signup", async (req, res, next) => {

        const { email, password } = req.body;

        // hash password
        const password_hash = await bcrypt.hash(password, +process.env.SALT_ROUNDS || 7);

        // insert email, password_hash into users table of db
        const { rows } = await pool.query(`
            INSERT INTO users (email, password_hash) 
            VALUES ($1, $2)
            RETURNING *;
        `, [email, password_hash])

        const user = rows[0];
        // create token
        // delete password_hash from user before encoding into token
        delete user.password_hash;

        const token = jwt.sign({ ...user }, process.env.APP_SECRET, {
            expiresIn: '24h'
        })
        // attach token as session cookie session: token
        const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

        res.cookie('session', token, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MILLISECONDS,
            sameSite: 'none',
            secure: true
        })

        // send back user to front end
        res.send(user);
    })

    .post("/login", (req, res, next) => {

    })

    .get("verify", (req, res, next) => {

    })