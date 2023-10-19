const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
  // função para salvar imagem
  async saveFile(file){ 
    await fs.promises.rename( // para mudar o arquivo de lugar, tira da pasta temporária (TMP_FOLDER) e manda p/ UPLOADS_FOLDER
      path.resolve(uploadConfig.TMP_FOLDER, file), // de onde
      path.resolve(uploadConfig.UPLOADS_FOLDER, file) // para onde
    );

    return file;
  }

  // função para deletar imagem
  async deleteFile(file){
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file); // busca pelo arquivo na pasta UPLOADS
    
    try {
      await fs.promises.stat(filePath); // verifica o estado do arquivo, se está sendo usado, corrompido, etc
    } catch {
      return;
    } 

    await fs.promises.unlink(filePath); // unlink remove/deleta o arquivo
  }
}

module.exports = DiskStorage;