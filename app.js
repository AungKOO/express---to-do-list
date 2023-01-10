//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const capitalize = require('lodash.capitalize'); // captilaize only first char

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// db connection
mongoose
  .connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true })
  .then(() => console.log("connected"));

// schema
const itemSchema = {
  name: String,
};
const listSchema = {
  name: String,
  items: [itemSchema],
};

// model
const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

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
            console.error(err);
          } else {
            res.redirect("/");
          }
        });
      } else {
        res.render("list", { listTitle: "Today", newListItems: items });
      }
    }
  });
});
// * dynamic route
app.get("/:id", (req, res) => {
  const id = capitalize(req.params.id);
  console.log(req.params)
  List.findOne({ name: id }, async (err, foundList) => {
    if (!err) {
      if (foundList) {

        res.render("list", { listTitle: id, newListItems: foundList.items });
      } else {
        const list = new List({
          name: id,
          items: defaultItems,
        });
        await list.save()
        
        res.redirect('/' + id);
      }
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

// * POST method (adding data)
app.post("/",  function (req, res) {
  const itemName = req.body.newItem;
  const listTitle = req.body.listName;
  
  const item = new Item({ name: itemName });
  if (listTitle === "Today") {
    item.save();
    res.redirect("/");
  } else {
     List.findOne({ name: listTitle }, (err, data) => {
      if (!err) {
        data.items.push(item);
        data.save()
        res.redirect('/' + listTitle)
      }
    });
  }
});

// * DELETE method
app.post("/delete", function (req, res) {
  const id = req.body.check;
  const listTitle = req.body.listTitle;
  if (listTitle === "Today")
  {Item.findByIdAndRemove(id, (err) => console.log("removed successfully"));
  res.redirect("/");}
  else {
    List.findOneAndUpdate({name: listTitle}, {$pull: {items: {_id: id} }}, function(err, foundList) {
      if (!err) {
        res.redirect('/' + listTitle)
      }
    })
  }
});

module.exports = app;
