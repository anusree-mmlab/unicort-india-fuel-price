const FuelPrice = require("../models/fuel.model");

// Create and Save new Fuel price
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  /*res.status(500).send({
    message: "Validating input data",
  });*/

  // Create a Fuel Price
  const fuelPriceArr = req.body.map((fpObj) => {
    return {
      fuel_type: fpObj.fuel_type ? fpObj.fuel_type : null,
      city_id: fpObj.city_id ? fpObj.city_id : null,
      price: fpObj.price ? fpObj.price : null,
      date: fpObj.date ? fpObj.date : null,
    };
  });
  console.log("fuelPriceArr//", fuelPriceArr);
  if (fuelPriceArr.length == 0) {
    res.status(501).send({
      message: "Invalid request",
    });
  }

  // Save Customer in the database
  const fuelPriceValueArr = fuelPriceArr.map((d) => [
    d.fuel_type,
    d.city_id,
    d.price,
    d.date,
  ]);

  FuelPrice.create([fuelPriceValueArr], (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer.",
      });
    else res.send(data);
  });
};

// Retrieve Fuel Basic price from the database.
exports.basicFuelPrice = (req, res) => {
  FuelPrice.getBasicFuelPrice((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving basic prices.",
      });
    else res.send(data);
  });
};

exports.fuelPriceByCity = (req, res) => {
  const city = req.params.city ? req.params.city : null;

  if (city == null) {
    res.status(501).send({
      message: "Required parameters are not available.",
    });
  }

  FuelPrice.getFuelPriceByCity(city, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving fuel prices of today.",
      });
    else res.send(data);
  });
};

exports.fuelPriceByCityWithDate = (req, res) => {
  const city = req.params.city ? req.params.city : null;
  const date = req.params.date ? req.params.date : null;

  if (city == null && date == null) {
    res.status(501).send({
      message: "Required parameters are not available.",
    });
  }

  FuelPrice.getFuelPriceByCityWithDate(city, date, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving fuel prices of today.",
      });
    else res.send(data);
  });
};

exports.storedprocTest = (req, res) => {
  FuelPrice.storedprocTest((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving fuel prices of today.",
      });
    else res.send(data);
  });
};
