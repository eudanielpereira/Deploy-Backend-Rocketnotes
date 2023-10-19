module.exports = {
  jwt: {
    secret: process.env.AUTH_SECRET || "default", // pega do .env, caso não encontre usará "default"
    expiresIn: "1d"
  }
}