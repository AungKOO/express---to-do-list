const app = require('./app');

const SERVER_PORT = process.env.SERVER_PORT
app.listen(SERVER_PORT, function() {
    console.log("Server is running at http://localhost:3000");
  });