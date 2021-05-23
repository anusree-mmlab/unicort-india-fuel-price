const sql = require("./db.js");
var mongoUtil = require("../mongo/mongoUtil");

const CommonModel = {};

CommonModel.getStates = (result) => {
  sql.query(`SELECT * FROM states`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("states: ", res);
    result(null, res);
  });
};

CommonModel.getDistricts = (state_id, result) => {
  sql.query(
    `SELECT * FROM districts WHERE state_id=${state_id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("districts: ", res);
      result(null, res);
    }
  );
};

CommonModel.getCities = (district_id, result) => {
  sql.query(
    `SELECT * FROM cities WHERE district_id=${district_id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("districts: ", res);
      result(null, res);
    }
  );
};

CommonModel.getTaxRates = (state_id, district_id, result) => {
  sql.query(
    `SELECT * FROM tax_rates WHERE tax = 'central' OR (tax ='state' AND state_id=${state_id})  OR (tax='local' AND district_id=${district_id})`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("districts: ", res);
      result(null, res);
    }
  );
};

//SELECT u.email, u.usertype, u.password, u.district_id, u.status, d.state_id FROM users u INNER JOIN districts d ON d.id = u.district_id
// `SELECT email, usertype, password, district_id, status FROM users `
CommonModel.makeLogin = (email_id, result) => {
  sql.query(
    `SELECT u.id, u.name, u.email, u.usertype, u.password, u.district_id, u.status, d.state_id FROM users u INNER JOIN districts d ON d.id = u.district_id WHERE u.email='${email_id}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("user: ", res);
      result(null, res);
    }
  );
};

CommonModel.getUsers = (result) => {
  sql.query(
    `SELECT name, id, district_id FROM users where usertype='user' and status='ACTIVE'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("users: ", res);
      result(null, res);
    }
  );
};

CommonModel.checkUserActive = (user_id, result) => {
  sql.query(
    `SELECT  u.status FROM users u WHERE u.id='${user_id}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("user status: ", res);
      let isUserActive = false;
      if (res.length > 0 && res[0].status == "ACTIVE") {
        isUserActive = true;
      }
      result(null, isUserActive);
    }
  );
};

CommonModel.blockUser = (user_id, result) => {
  sql.query(
    `UPDATE users set status='BLOCKED' WHERE id='${user_id}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      result(null, res);
    }
  );
};

CommonModel.logReport = (user_id, date, result) => {
  mongoUtil.connectToServer(function (err, client) {
    if (err) result(null, err);

    const loggerDb = mongoUtil.getDb();

    //{"timestamp":{$gte: "2016-03-07 11:33:48", $lt: "2016-03-07 11:34:48"}}

    loggerDb
      .collection("fuellogs")
      .find({ user_id: user_id.toString(), timestamp: date })
      .toArray((error, documents) => {
        if (error) {
          console.log(error);
          result(null, error);
        }

        console.log("Log Res: ", documents);

        let mDoc = {};

        documents.forEach((v) => {
          mDoc[v.url] = (mDoc[v.url] || 0) + 1;
        });

        let docArr = [];
        Object.keys(mDoc).forEach((key) => {
          docArr.push({ url: key, count: mDoc[key] });
        });

        result(null, docArr);
      });
    /*loggerDb
      .collection("fuellogs")
      .aggregate([
        {
          $group: {
            url: "$url",
            counter: { $sum: 1 },
          },
        },
      ])
      .toArray((error, documents) => {
        if (error) {
          console.log(error);
          result(null, error);
        }

        console.log("Log Res: ", documents);
        result(null, documents);
      });*/
  });
};

module.exports = CommonModel;
