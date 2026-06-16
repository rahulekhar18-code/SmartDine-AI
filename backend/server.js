const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");

const reservationRoutes = require("./routes/reservationRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");
const tableRoutes = require("./routes/tableRoutes");

const staffRoutes =require("./routes/staffRoutes");
const feedbackRoutes =require("./routes/feedbackRoutes");

const activityRoutes =require("./routes/activityRoutes");
const notificationRoutes =require("./routes/notificationRoutes");


const app = express();

app.use(cors());
app.use(express.json({
  limit: "50mb"
}));
app.use(
  "/api/activity",
  activityRoutes
);
app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(express.urlencoded({
  extended: true,
  limit: "50mb"
}));
app.use("/api/staff", staffRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tables", tableRoutes);

app.get("/", (req, res) => {
  res.send("SmartDine API Running 🚀");
});

const PORT = 5000;
const http = require("http");
const { initSocket } = require("./socket");

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});