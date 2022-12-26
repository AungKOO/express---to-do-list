const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todolistDB').then(() => console.log("connected"))
const itemSchema = {
    name: String
}
const Item = mongoose.model("Item", itemSchema)
const Item1 = new Item({name: 'Welcome to your to do list'})
const Item2 = new Item({name: "Press + to add new list"})
const Item3 = new Item({name: "check if you want to delete the list"})
const defaultItems = [Item1, Item2, Item3]

module.exports = mongoose;