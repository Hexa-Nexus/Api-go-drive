const Express = require("express");
const app = Express();
const port = 3000;

// Add cors middleware
const cors = require("cors");

//swaigger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const carroRouter = require("./routes/Carro/carroRouter");
const eventoRouter = require("./routes/Evento/eventoRouter");
const motoristaRouter = require("./routes/Motorista/motoristaRouter");
const gestorRouter = require("./routes/Gestor/GestorRoutes");
const pagamentoRouter = require("./routes/Pagamento/PagamentoRouter");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Go Drive",
      version: "1.0.0",
      description: "Documentação da API Go Drive",
    },
    servers: [
      {
        url: "http://localhost:3000", // Altere para o URL do seu servidor
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/docs/**/*.js"], // Caminho para os arquivos de documentação
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api", carroRouter);
app.use("/api", eventoRouter);
app.use("/api", motoristaRouter);
app.use("/api", gestorRouter);
app.use("/api", pagamentoRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("http://localhost:3000"); // Updated to correct port
});
