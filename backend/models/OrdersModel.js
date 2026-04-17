const {model} = require("mongoose");

// const {HoldingSchema} = require('../schemas/HJoldingSchema');
const { OrdersSchema } = require("../schemas/OrdersSchema");

const OrdersModel = new model("order", OrdersSchema);

module.exports = {OrdersModel};