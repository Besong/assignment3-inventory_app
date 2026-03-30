const pool = require("./pool");

// Categories
exports.getAllCategories = async () => {
  const { rows } = await pool.query(
    `SELECT c.*, COUNT(i.id)::int AS item_count
     FROM categories c
     LEFT JOIN items i ON i.category_id = c.id
     GROUP BY c.id
     ORDER BY c.name`
  );
  return rows;
};

exports.getCategoryById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
  return rows[0];
};

exports.getCategoryItems = async (categoryId) => {
  const { rows } = await pool.query(
    "SELECT * FROM items WHERE category_id = $1 ORDER BY name",
    [categoryId]
  );
  return rows;
};

exports.insertCategory = async (name, description) => {
  const { rows } = await pool.query(
    "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
    [name, description]
  );
  return rows[0];
};

exports.updateCategory = async (id, name, description) => {
  const { rows } = await pool.query(
    "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
    [name, description, id]
  );
  return rows[0];
};

exports.deleteCategory = async (id) => {
  await pool.query("DELETE FROM categories WHERE id = $1", [id]);
};

// Items
exports.getAllItems = async () => {
  const { rows } = await pool.query(
    `SELECT i.*, c.name AS category_name
     FROM items i
     JOIN categories c ON c.id = i.category_id
     ORDER BY i.name`
  );
  return rows;
};

exports.getItemById = async (id) => {
  const { rows } = await pool.query(
    `SELECT i.*, c.name AS category_name
     FROM items i
     JOIN categories c ON c.id = i.category_id
     WHERE i.id = $1`,
    [id]
  );
  return rows[0];
};

exports.insertItem = async (name, description, price, quantity, categoryId) => {
  const { rows } = await pool.query(
    `INSERT INTO items (name, description, price, quantity, category_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, description, price, quantity, categoryId]
  );
  return rows[0];
};

exports.updateItem = async (id, name, description, price, quantity, categoryId) => {
  const { rows } = await pool.query(
    `UPDATE items SET name=$1, description=$2, price=$3, quantity=$4, category_id=$5
     WHERE id = $6 RETURNING *`,
    [name, description, price, quantity, categoryId, id]
  );
  return rows[0];
};

exports.deleteItem = async (id) => {
  await pool.query("DELETE FROM items WHERE id = $1", [id]);
};