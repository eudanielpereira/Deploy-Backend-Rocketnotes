// criar tabela
exports.up = knex => knex.schema.createTable("notes", table =>{ 
    table.increments("id"); // dentro da tabela terá um campo incremental chamado id
    table.text("title"); //table.tipodocampo("nome do campo")
    table.text("description");
    table.integer("user_id").references("id").inTable("users"); // o user_id faz uma referência ao id da tabela de usuário. 
    // Ou seja, não dá pra criar uma nota se um usuário não existir. A nota é vinculada a um usuário

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("update_at").default(knex.fn.now());
});

// deletar tabela
exports.down = knex => knex.schema.dropTable("notes");