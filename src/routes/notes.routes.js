const { Router } = require("express"); //importando o router

const NotesController = require("../controllers/NotesController") // importando o controller
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const notesRoutes = Router();

const notesController = new NotesController();

notesRoutes.use(ensureAuthenticated);

notesRoutes.get("/", notesController.index); 
notesRoutes.post("/", notesController.create); 
notesRoutes.get("/:id", notesController.show); 
notesRoutes.delete("/:id", notesController.delete); 

module.exports = notesRoutes; //exportando 