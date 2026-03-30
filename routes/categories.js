const { Router } = require("express");
const ctrl = require("../controllers/categoriesController");
const router = Router();

router.get("/", ctrl.index);
router.get("/new", ctrl.createForm);
router.post("/", ctrl.create);
router.get("/:id", ctrl.show);
router.get("/:id/edit", ctrl.editForm);
router.post("/:id/update", ctrl.update);
router.post("/:id/delete", ctrl.destroy);

module.exports = router;