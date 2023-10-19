const path = require("path");
const multer = require("multer");
const crypto = require("crypto")

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER, // para onde será enviado o arquivo
    filename(request, file, callback){
      const fileHash = crypto.randomBytes(10).toString("hex"); // gera um número aleatório para compor o nome do arquivo
      const fileName = `${fileHash}-${file.originalname}`; // dá o nome do arquivo

      return callback(null, fileName);
    },
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
}