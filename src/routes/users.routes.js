const { Router } = require("express"); //importando o router
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/UsersController") // importando o controller
const UserAvatarController = require("../controllers/UserAvatarController") // importando a atualização do avatar
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER)

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRoutes.post("/", usersController.create); 
usersRoutes.put("/", ensureAuthenticated, usersController.update); // para atualizar o usuário
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update); // atauliza o AVATAR

module.exports = usersRoutes; //exportando 