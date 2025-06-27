exports.up = function (knex) {
    return knex.schema.createTable('availability_slots', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('therapist_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.timestamp('start_time').notNullable();
        table.timestamp('end_time').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('availability_slots');
};
