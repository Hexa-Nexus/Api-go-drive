const Express = require("express");
const app = Express();
const port = 3000;

// Add cors middleware
const cors = require("cors");

//swaigger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Import all routers from the index file
const {
  carroRouter,
  eventoRouter,
  motoristaRouter,
  gestorRouter,
  pagamentoRouter,
  relatorioRouter
} = require("./routes/index");

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
app.use("/api/relatorios", relatorioRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("http://localhost:3000"); // Updated to correct port
});
