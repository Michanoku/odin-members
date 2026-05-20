const pool = require("./pool");

const createUser = async ({ firstName, lastName, email, hash }) => {
    const { rows } = await pool.query(`
        INSERT INTO users (first_name, last_name, email, hash) VALUES ($1, $2, $3, $4) RETURNING *;
        `, [firstName, lastName, email, hash]);
    return rows[0];
}

const findUserByEmail = async (email) => {
    const { rows } = await pool.query(`
        SELECT * FROM users WHERE email = $1;
        `, [email]);
    return rows[0];
}

const findUserById = async (userId) => {
    const { rows } = await pool.query(`
        SELECT * FROM users WHERE user_id = $1;
        `, [userId]);
    return rows[0];
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
}