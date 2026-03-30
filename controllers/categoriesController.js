const db = require("../db/queries");

exports.index = async (req, res, next) => {
  try {
    const categories = await db.getAllCategories();
    res.render("categories/index", { categories });
  } catch (err) { next(err); }
};

exports.show = async (req, res, next) => {
  try {
    const [category, items] = await Promise.all([
      db.getCategoryById(req.params.id),
      db.getCategoryItems(req.params.id),
    ]);
    if (!category) return res.status(404).render("error", { message: "Category not found" });
    res.render("categories/show", { category, items });
  } catch (err) { next(err); }
};

exports.createForm = (req, res) => {
  res.render("categories/form", { category: null, error: null });
};

exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.render("categories/form", { category: req.body, error: "Name is required" });
    }
    await db.insertCategory(name.trim(), description?.trim() || null);
    res.redirect("/categories");
  } catch (err) { next(err); }
};

exports.editForm = async (req, res, next) => {
  try {
    const category = await db.getCategoryById(req.params.id);
    if (!category) return res.status(404).render("error", { message: "Category not found" });
    res.render("categories/form", { category, error: null });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { name, description, admin_password } = req.body;
    if (admin_password !== process.env.ADMIN_PASSWORD) {
      const category = await db.getCategoryById(req.params.id);
      return res.render("categories/form", { category: { ...category, ...req.body }, error: "Incorrect admin password" });
    }
    if (!name || !name.trim()) {
      return res.render("categories/form", { category: { id: req.params.id, ...req.body }, error: "Name is required" });
    }
    await db.updateCategory(req.params.id, name.trim(), description?.trim() || null);
    res.redirect(`/categories/${req.params.id}`);
  } catch (err) { next(err); }
};

exports.destroy = async (req, res, next) => {
  try {
    const { admin_password } = req.body;
    if (admin_password !== process.env.ADMIN_PASSWORD) {
      const [category, items] = await Promise.all([
        db.getCategoryById(req.params.id),
        db.getCategoryItems(req.params.id),
      ]);
      return res.render("categories/show", { category, items, error: "Incorrect admin password" });
    }
    await db.deleteCategory(req.params.id);
    res.redirect("/categories");
  } catch (err) { next(err); }
};