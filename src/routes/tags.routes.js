const { Router } = require("express"); //importando o router

const TagsController = require("../controllers/TagsController") // importando o controller
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const tagsRoutes = Router();

const tagsController = new TagsController();

tagsRoutes.get("/", ensureAuthenticated, tagsController.index); 

module.exports = tagsRoutes; //exportando 