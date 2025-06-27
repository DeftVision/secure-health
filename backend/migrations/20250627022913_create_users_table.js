exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()')); // Requires pgcrypto
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.enum('role', ['platform_owner', 'therapist', 'client']).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users');
};

