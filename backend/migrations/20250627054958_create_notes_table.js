exports.up = function (knex) {
    return knex.schema.createTable('notes', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('appointment_id').notNullable().references('id').inTable('appointments').onDelete('CASCADE').unique();
        table.uuid('therapist_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.text('content').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('notes');
};
