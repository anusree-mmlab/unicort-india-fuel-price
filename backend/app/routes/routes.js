var express = require("express");
var router = express.Router();
var moment = require("moment");
const rateLimit = require("express-rate-limit");

const fuel = require("../controllers/fuel.controller");
const common = require("../controllers/common.controller");
var mongoUtil = require("../mongo/mongoUtil");

//Rate limitting for per day call
const limiterPerDay = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100, // limit each IP to 100 requests per windowMs
  onLimitReached: (req, res, options) => {
    const { headers } = req;

    if (headers.user_type && headers.user_type == "user") {
      console.log("I am gonna block You", headers.user_id);
      req.params.user_id = headers.user_id;
      common.checkUserActive(req, res, (err, res) => {
        if (res) {
          //Block user
          common.blockUser(req, res, (err, res1) => {
            console.log(res1);
          });
        }
      });
    }
  },
  message: "Max 100 req per day is allowed",
});

const LimitMiddleWare = (req, res, next) => {
  limiterPerDay();

  next();
};

const AddLogs = (logObj) => {
  //Logging db
  mongoUtil.connectToServer(function (err, client) {
    if (err) console.log(err);

    const loggerDb = mongoUtil.getDb();
    loggerDb.collection("fuellogs").insertOne(logObj, (err, res) => {
      if (err) console.log(err);
      console.log("1 document inserted");
    });
  });
};

router.use(function timeLog(req, res, next) {
  const { httpVersion, method, socket, url, headers } = req;
  const logObj = {
    timestamp: moment().format("YYYY-MM-DD"),
    httpVersion,
    method,
    url,
    user_email: headers.user_email ? headers.user_email : "",
    user_id: headers.user_id ? headers.user_id : "",
  };
  console.log(logObj);

  if (logObj.user_id != "") {
    AddLogs(logObj);
  }

  next();
});

// Create new fuel price
router.post("/fuel", fuel.create);

// Retrieve fuel price by city
router.get("/fuel/:city", fuel.fuelPriceByCity);

// Retrieve fuel price by city and date
router.get("/fuel/:city/:date", limiterPerDay, fuel.fuelPriceByCityWithDate);

// Retrieve basic fuel price
router.get("/basicfuelprice", fuel.basicFuelPrice);

/***** Common Routes ******/
// Retrieve all states
router.get("/states", common.states);

// Retrieve all districts of a state
router.get("/districts/:state_id", common.districts);

// Retrieve all citites of a districts
router.get("/cities/:district_id", common.citites);

// Retrieve all citites of a districts
router.get("/taxrates/:state_id/:district_id", common.taxrates);

//Login
router.post("/login", common.login);

//Users
router.get("/users", common.users);

router.get("/user/status/:user_id", common.checkUserActive);

//Report
router.get("/report/:user_id/:date", common.logReport);

router.get("/storedproctest", fuel.storedprocTest);

module.exports = router;
