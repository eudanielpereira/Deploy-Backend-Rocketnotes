const { hash, compare } = require("bcryptjs"); // importando função que vai gerar a criptografia. 
//O hash é para criptografar. O compare é para comparar as senhas na hora da atualização de senha
const AppError = require("../utils/AppError");

const sqliteConnection = require('../database/sqlite')

class UsersController {
    // criação do usuário
    async create(request, response) {
        const { name, email, password } = request.body;

        const database = await sqliteConnection();

        // verifica se o email já está cadastrado
        const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email]) 
        // o (?) é substituído pelo oq ue está dentro das []. caso houvesse mais de uma (?), segue a sequência das []. [email, ..., ...]
        
        if(checkUserExist){ // caso o email já seja cadastrado:
            throw new AppError("Este e-mail já está em uso");
        }

        const hashedPassword = await hash(password, 8); // hash(password, fator de complexidade) 8 está de bom tamanho

        //cadastra o usuário
        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [ name, email, hashedPassword ]); 
        // Insere as informações no banco de dados. nome, email e senha. Os outros são colocados automaticamente (id, ...)

        return response.status(201).json(); // retorna um status de que algo foi criado com sucesso
    }

    // atualiza o usuário
    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]); // seleciona o usuário pelo id. Seleciona na tabela o usuário em que o id é igual ao id procurado.

        if(!user) { // caso o usuário não seja encontrado
            throw new AppError("Usuário não encontrado")
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]) // verifica se a pessoa está atualizando para um email que já está cadastrado

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) { // verifica se o id da pessoa que está atualizando o email é diferente do id da pessoa que tem o email cadastrado.
            throw new AppError("Este e-mail já está em uso") // caso o id seja diferente, esta mensagem será lançada
        }

        user.name = name ?? user.name; // caso tenha passado por todos os IFs, o nome será atualizado. 
        user.email = email ?? user.email; // caso tenha passado por todos os IFs, o email será atualizado.
        //(?? user.name/ ?? user.email) - caso o nome/email não seja informado o antigo será repetido. Caso não tenha conteúdo no name/ email, vai manter o que estava
        //Isso foi colocado porque quando atualizávamos a senha, por exemplo, e não colocávamos nome ou email, eles mudavam para NULL.

        if(password && !old_password){ // caso não digite a senha antiga será enviada a mensagem abaixo
            throw new AppError("Você precisa informar a senha antiga para definir uma nova")
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password); // verifica se a senha antiga é a mesma que a digitada.
            // o compare foi importado da criptografia. A senha é criptografada, então não conseguimos comprar apenas com o =, fazemos da forma acima

            if(!checkOldPassword) { // se a senha digitada for diferente da senha antiga, a mensagem será lançada
                throw new AppError("A senha antiga não confere")
            }

            user.password = await hash(password, 8); // caso a senha passe por todos os IFs, será aceita e criptografada a nova senha.
        }

        await database.run(`
        UPDATE users SET 
        name = ?,
        email = ?,
        password = ?,
        update_at = DATETIME('now')
        WHERE id = ?`, 
        [user.name, user.email, user.password, user_id]
        );
        // o DATETIME('now') é uma função do próprio banco de dados, que mostra a data e horário atual
        
        return response.json();
    }
}

module.exports = UsersController;