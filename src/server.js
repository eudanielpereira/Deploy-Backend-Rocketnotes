//Ponto de entrada da aplicação

require("dotenv/config"); // dotenv
require("express-async-errors");

const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const cors = require("cors"); //importa o CORS
const express = require("express"); // Importa o express
const routes = require("./routes"); // importando do arquivo index, quando não fala o arquivo, é carregado por padrão o index

migrationsRun();

const app = express(); // inicializa o express
app.use(cors()); 
app.use(express.json()); //informa a api o padrão utilizado para receber as informações através do request.body

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes); // diz para usar na aplicação as rotas

app.use(( error, request, response, next ) => {
    if(error instanceof AppError) { // para erros do cliente
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.error(error);

    return response.status(500).json({ // para erros do servidor
        status: "error",
        message: "internal server error"
    });
});

const PORT = process.env.PORT || 3333; // cria uma constante que define o  endereço d aporta que a API aguarda por requisições
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));