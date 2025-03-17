const { unique } = require("next/dist/build/utils");

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      unique: true,
      primaryKey: true, 
      default: pgm.func('gen_random_uuid()'),
    },
    username: {
      type: 'varchar(30)',
      unique: true,
      notNull: true,
    },
    email:{
      type: 'varchar(254)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'varchar(72)',
      notNull: true,
    },
    created_at:{
      type: "timestamptz",
      default: pgm.func('now()'),
    },
    updated_at:{
      type: "timestamptz",
      default: pgm.func('now()'),
    }
  });
};

exports.down = false;