const pool = require("./pool");

const createMessage = async ({ title, message, userId }) => {
  await pool.query(
    `
        INSERT INTO clubhouse_messages (title, message, user_id) VALUES ($1, $2, $3);
        `,
    [title, message, userId],
  );
};

const getAllMessages = async () => {
  const { rows } = await pool.query(`
        SELECT 
        clubhouse_messages.message_id, 
        clubhouse_messages.title, 
        clubhouse_messages.message, 
        clubhouse_messages.created_at, 
        clubhouse_users.first_name, 
        clubhouse_users.last_name 
        FROM clubhouse_messages 
        JOIN clubhouse_users 
        ON clubhouse_messages.user_id = clubhouse_users.user_id;
        `);
  return rows;
};

const deleteMessage = async (messageId) => {
  await pool.query(
    `
        DELETE FROM clubhouse_messages WHERE message_id = $1;
        `,
    [messageId],
  );
};

module.exports = {
  createMessage,
  getAllMessages,
  deleteMessage,
};
