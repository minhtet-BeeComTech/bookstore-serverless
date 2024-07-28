const productRouter = require("./product");

const APP_V = "/api/v1";
const routes = [
  {
    path: `${APP_V}/product`,
    router: productRouter,
  },
];

module.exports = routes;
