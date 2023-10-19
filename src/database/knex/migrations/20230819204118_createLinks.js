// criar tabela
exports.up = knex => knex.schema.createTable("links", table =>{ 
    table.increments("id"); // dentro da tabela terá um campo incremental chamado id
    table.text("url").notNullable();
    
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE"); // O onDelete("CASCADE") é uma função que apaga a tag caso a nota seja excluída
    table.timestamp("created_at").default(knex.fn.now());  

});

// deletar tabela
exports.down = knex => knex.schema.dropTable("links");