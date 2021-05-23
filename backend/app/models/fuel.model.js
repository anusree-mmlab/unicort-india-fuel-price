const sql = require("./db.js");

const FuelPrice = {};

FuelPrice.create = (newFuelPrice, result) => {
  sql.query(
    "INSERT INTO fuel_price  (fuel_type, city_id, price, date) VALUES ?",
    newFuelPrice,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created fuel price: ", {
        id: res.insertId,
        ...newFuelPrice,
      });
      result(null, { id: res.insertId, ...newFuelPrice });
    }
  );
};

FuelPrice.getBasicFuelPrice = (result) => {
  sql.query("SELECT * FROM base_fuel_cost", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("basic fuel price: ", res);
    result(null, res);
  });
};

FuelPrice.getFuelPriceByCity = (city, result) => {
  //Today is the default day
  const query = `(SELECT * FROM fuel_price WHERE fuel_type='petrol' AND city_id = ${city} ORDER BY ABS( DATEDIFF( date, (DATE(NOW())) ) ) limit 0,1)
  UNION
  (SELECT * FROM fuel_price WHERE fuel_type='diesel' AND city_id = ${city} ORDER BY ABS( DATEDIFF(date, (DATE(NOW())) ) ) limit 0,1)`;
  console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("basic fuel price: ", res);
    result(null, res);
  });
};

FuelPrice.getFuelPriceByCityWithDate = (city, date, result) => {
  const query = `(SELECT * FROM fuel_price WHERE fuel_type='petrol' AND city_id = ${city} ORDER BY ABS( DATEDIFF( date, ('${date}') ) ) LIMIT 0, 1) 
  UNION
  (SELECT * FROM fuel_price WHERE fuel_type='diesel' AND city_id = ${city} ORDER BY ABS( DATEDIFF( date, ('${date}') ) ) LIMIT 0, 1)
  `;
  console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("basic fuel price: ", res);
    result(null, res);
  });
};

FuelPrice.storedprocTest = (result) => {
  const paramString = ["?", "?"];
  const query = `CALL procedure_get_fuel_price_by_date(${paramString})`;
  /*sql.query(query, [1],(err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("basic fuel price: ", res);
    result(null, res);
  });*/

  sql.query(query, [1, "2021-10-05"], (error, results, fields) => {
    if (error) {
      console.log(error);
      var err = new Error(error);
      //closeDbConnection(res);
      result(err);
    } else {
      //closeDbConnection(res);
      console.log("Model res", results);

      result(null, { data: results });
    }
  });
};

module.exports = FuelPrice;
