// criar tabela
exports.up = knex => knex.schema.createTable("tags", table =>{ 
    table.increments("id"); // dentro da tabela terá um campo incremental chamado id
    table.text("name").notNullable();//Não aceita campo vazio //table.tipodocampo("nome do campo")
    
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE"); // O onDelete("CASCADE") é uma função que apaga a tag caso a nota seja excluída
    table.integer("user_id").references("id").inTable("users"); // o user_id faz uma referência ao id da tabela de usuário.  
});

// deletar tabela
exports.down = knex => knex.schema.dropTable("tags");