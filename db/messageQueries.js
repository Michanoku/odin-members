const pool = require("./pool");

const createMessage = async ({ title, message, userId }) => {
  await pool.query(
    `
        INSERT INTO messages (title, message, user_id) VALUES ($1, $2, $3);
        `,
    [title, message, userId],
  );
};

const getAllMessages = async () => {
  const { rows } = await pool.query(`
        SELECT 
        messages.message_id, 
        messages.title, 
        messages.message, 
        messages.created_at, 
        users.first_name, 
        users.last_name 
        FROM messages 
        JOIN users 
        ON messages.user_id = users.user_id;
        `);
  return rows;
};

const deleteMessage = async (messageId) => {
  await pool.query(
    `
        DELETE FROM messages WHERE message_id = $1;
        `,
    [messageId],
  );
};

module.exports = {
  createMessage,
  getAllMessages,
  deleteMessage,
};
