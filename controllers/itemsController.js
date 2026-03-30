const db = require("../db/queries");

exports.index = async (req, res, next) => {
  try {
    const items = await db.getAllItems();
    res.render("items/index", { items });
  } catch (err) { next(err); }
};

exports.show = async (req, res, next) => {
  try {
    const item = await db.getItemById(req.params.id);
    if (!item) return res.status(404).render("error", { message: "Item not found" });
    res.render("items/show", { item });
  } catch (err) { next(err); }
};

exports.createForm = async (req, res, next) => {
  try {
    const categories = await db.getAllCategories();
    res.render("items/form", { item: null, categories, error: null });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, quantity, category_id } = req.body;
    if (!name?.trim() || !price || !category_id) {
      const categories = await db.getAllCategories();
      return res.render("items/form", { item: req.body, categories, error: "Name, price, and category are required" });
    }
    await db.insertItem(name.trim(), description?.trim() || null, parseFloat(price), parseInt(quantity) || 0, parseInt(category_id));
    res.redirect("/items");
  } catch (err) { next(err); }
};

exports.editForm = async (req, res, next) => {
  try {
    const [item, categories] = await Promise.all([
      db.getItemById(req.params.id),
      db.getAllCategories(),
    ]);
    if (!item) return res.status(404).render("error", { message: "Item not found" });
    res.render("items/form", { item, categories, error: null });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { name, description, price, quantity, category_id, admin_password } = req.body;
    if (admin_password !== process.env.ADMIN_PASSWORD) {
      const categories = await db.getAllCategories();
      return res.render("items/form", { item: { id: req.params.id, ...req.body }, categories, error: "Incorrect admin password" });
    }
    if (!name?.trim() || !price || !category_id) {
      const categories = await db.getAllCategories();
      return res.render("items/form", { item: { id: req.params.id, ...req.body }, categories, error: "Name, price, and category are required" });
    }
    await db.updateItem(req.params.id, name.trim(), description?.trim() || null, parseFloat(price), parseInt(quantity) || 0, parseInt(category_id));
    res.redirect(`/items/${req.params.id}`);
  } catch (err) { next(err); }
};

exports.destroy = async (req, res, next) => {
  try {
    const { admin_password } = req.body;
    if (admin_password !== process.env.ADMIN_PASSWORD) {
      const item = await db.getItemById(req.params.id);
      return res.render("items/show", { item, error: "Incorrect admin password" });
    }
    await db.deleteItem(req.params.id);
    res.redirect("/items");
  } catch (err) { next(err); }
};