const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
  async update(request, response){
    const user_id = request.user.id;
    const avatarFileName = request.file.filename;

    const diskStorage = new DiskStorage();

    const user = await knex("users")
    .where({ id: user_id }).first();

    if(!user){ // verifica se usuário existe
      throw new AppError("Somente usuários autenticados podem mudar o avatar", 401);
    }

    if(user.avatar){ // apaga a foto antiga do usuário ao atualizar
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFileName); // salva a nova foto
    user.avatar =  filename; // coloca a nova foto no avatar

    await knex("users").update(user).where({ id: user_id }) // atualiza a foto

    return response.json(user);

  }

}

module.exports = UserAvatarController;