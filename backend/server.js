const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const rateLimit = require("express-rate-limit");
var routes = require("./app/routes/routes.js");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Rate limitting for per second call
const limiterPerSecond = rateLimit({
  windowMs: 1000, // 1 second
  max: 2, // limit each IP to 2 requests per windowMs
});
//  apply to all requests
app.use(limiterPerSecond);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to fuel india application." });
});

app.use("/", routes);

// set port, listen for requests
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

/*
//Directly run this to generate a hashcode value for password
bcrypt.hash(body.password, 10, (err, hash) => {

 bcrypt.compare(userParams.password, result.data[0].password, (err, cRes) => {
                if (err) {
                    cb({ status: "failed", message: "Auth Failed!" });
                }

                if (cRes === true) {
*/
