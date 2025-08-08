
const { verifyToken } = require("../middleware/authJwt");
const controller = require("../controllers/data.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // NEW route to get a list of users for filtering
  app.get("/api/data/users", [verifyToken], controller.getUsers);

  // Existing routes, now smarter with more filters
  app.get("/api/data/summary", [verifyToken], controller.getSummary);
  app.get("/api/data/charts/events-over-time", [verifyToken], controller.getEventsOverTime);
  app.get("/api/data/charts/event-category-distribution", [verifyToken], controller.getEventCategoryDistribution);
  app.get("/api/data/charts/metrics-by-user", [verifyToken], controller.getMetricsByUser);

  // POST route for creating data
  app.post("/api/data/events", [verifyToken], controller.createEvent);
};