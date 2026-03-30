require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const categoryRouter = require("./routes/categories");
const itemRouter = require("./routes/items");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => res.redirect("/categories"));

app.use("/categories", categoryRouter);
app.use("/items", itemRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", { message: err.message });
});


const PORT =  3000;
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
