exports.up = function (knex) {
    return knex.schema.createTable('appointments', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('client_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.uuid('therapist_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.uuid('availability_slot_id').notNullable().unique().references('id').inTable('availability_slots').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('appointments');
};
