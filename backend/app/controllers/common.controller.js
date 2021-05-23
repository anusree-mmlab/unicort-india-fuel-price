const bcrypt = require("bcrypt");
const _ = require("lodash");
const CommonModel = require("../models/common.model");

exports.states = (req, res) => {
  CommonModel.getStates((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving states.",
      });
    else res.send(data);
  });
};

exports.districts = (req, res) => {
  const state_id = req.params.state_id ? req.params.state_id : null;

  CommonModel.getDistricts(state_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving districts.",
      });
    else res.send(data);
  });
};

exports.citites = (req, res) => {
  const district_id = req.params.district_id ? req.params.district_id : null;

  CommonModel.getCities(district_id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving citites.",
      });
    else res.send(data);
  });
};

exports.taxrates = (req, res) => {
  const state_id = req.params.state_id ? req.params.state_id : null;
  const district_id = req.params.district_id ? req.params.district_id : null;

  CommonModel.getTaxRates(state_id, district_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving fuel prices of today.",
      });
    else {
      //res.send(data);
      const data = [
        {
          id: 1,
          fuel_type: "petrol",
          tax: "central",
          rate: 10,
          state_id: null,
          district_id: null,
        },
        {
          id: 2,
          fuel_type: "petrol",
          tax: "state",
          rate: 5,
          state_id: 1,
          district_id: null,
        },
        {
          id: 4,
          fuel_type: "petrol",
          tax: "local",
          rate: 3,
          state_id: 1,
          district_id: 1,
        },
        {
          id: 5,
          fuel_type: "diesel",
          tax: "central",
          rate: 10,
          state_id: null,
          district_id: null,
        },
        {
          id: 6,
          fuel_type: "diesel",
          tax: "state",
          rate: 5,
          state_id: 1,
          district_id: null,
        },
        {
          id: 8,
          fuel_type: "diesel",
          tax: "local",
          rate: 3,
          state_id: 1,
          district_id: 1,
        },
      ];

      const petrolData = _.filter(data, { fuel_type: "petrol" });
      const dieselData = _.filter(data, { fuel_type: "diesel" });

      const resData = { petrol: petrolData, diesel: dieselData };

      res.send(resData);
    }
  });
};

exports.login = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const userQueryObj = {
    email: req.body.email ? req.body.email : null,
    password: req.body.password ? req.body.password : null,
  };

  if (userQueryObj.email == null || userQueryObj.password == null) {
    res.status(501).send({
      message: "Required parameters are not available.",
    });
  }

  console.log(userQueryObj);

  /*let hashedPasswd = "";
  bcrypt.hash(userQueryObj.password, 10, (err, hash) => {
    hashedPasswd = hash;
    console.log("hashedPasswd", hashedPasswd);
  });*/

  CommonModel.makeLogin(userQueryObj.email, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred during login.",
      });
    else {
      if (data.length > 0 && data[0].password) {
        bcrypt.compare(userQueryObj.password, data[0].password, (err, cRes) => {
          if (err) {
            res.status(400).send({
              message: err.message || "Some error occurred during login.",
            });
          }
          if (!cRes) {
            res.status(400).send({
              message: "Wrong password!!",
            });
          } else {
            if (data[0].status == "BLOCKED") {
              res.status(400).send({
                message: "User is Blocked",
              });
            } else {
              delete data[0].password;
              res.send(data);
            }
          }
        });
      } else {
        res.status(400).send({
          message: "Invalid credentials",
        });
      }
    }
  });
};

exports.users = (req, res) => {
  CommonModel.getUsers((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else res.send(data);
  });
};

exports.checkUserActive = (req, res, cb) => {
  CommonModel.checkUserActive(req.params.user_id, (err, data) => {
    if (err) cb(err, false);
    // else res.send(data);
    else cb(null, data);
  });
};

exports.blockUser = (req, res, cb) => {
  CommonModel.blockUser(req.params.user_id, (err, data) => {
    if (err) cb(err, false);
    // else res.send(data);
    else cb(null, data);
  });
};

exports.logReport = (req, res) => {
  const user_id = req.params.user_id;
  const date = req.params.date;

  CommonModel.logReport(user_id, date, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving report.",
      });
    else res.send(data);
  });
};
