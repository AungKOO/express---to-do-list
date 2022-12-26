const app = require('./app');

const SERVER_PORT = process.env.SERVER_PORT
app.listen(SERVER_PORT, function() {
    console.log("Server started on port 3000");
  });