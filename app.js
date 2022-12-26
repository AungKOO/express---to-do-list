//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotEnv = require("dotEnv");
const items = [];
dotEnv.config();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// db connection

mongoose
  .connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true })
  .then(() => console.log("connected"));
const itemSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemSchema);
const Item1 = new Item({ name: "Welcome to your to do list" });
const Item2 = new Item({ name: "Press + to add new list" });
const Item3 = new Item({ name: "check if you want to delete the list" });
const defaultItems = [Item1, Item2, Item3];

// * GET method
app.get("/", function (req, res) {
  Item.find({}, (err, items) => {
    if (!err) {
      if (items.length === 0) {
        Item.insertMany(defaultItems, (err) => {
          if (err) {
            console.log(err)
          } else {
            console.log("Save Succcessfully")
            res.redirect('/')
          }
        });
      } else {
        res.render("list", { listTitle: "Today", newListItems: items });

      }
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

// * POST method
app.post("/", function (req, res) {
  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

module.exports = app;
