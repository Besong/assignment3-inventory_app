require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", { message: err.message });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
