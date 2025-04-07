const Express = require("express");
const app = Express();
const port = 3000;

const carroRouter = require("./routes/Carro/carroRouter");
const eventoRouter = require("./routes/Evento/eventoRouter");
const motoristaRouter = require("./routes/Motorista/motoristaRouter");
const gestorRouter = require("./routes/gestor/GestorRoutes")

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use("/api", carroRouter);
app.use("/api", eventoRouter);
app.use("/api", motoristaRouter);
app.use("/api", gestorRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("http://localhost:3000");
});
