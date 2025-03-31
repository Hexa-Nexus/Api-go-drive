const Express = require("express");
const app = Express();
const port = 3000;

const carroRouter = require("./routes/Carro/carroRouter");

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use("/api", carroRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("http://localhost:3000");
});
