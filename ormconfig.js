const rootDir = process.env.NODE_ENV === 'development' ? './src' : './dist';

module.exports = {
  name: 'default',
  type: 'sqlite',
  database: './db.sqlite3',
  entities: [`${rootDir}/modules/**/infra/typeorm/entities/*{.ts,.js}`],
  migrations: [`${rootDir}/global/infra/typeorm/migrations/*{.ts,.js}`],
  cli: {
    migrationsDir: `${rootDir}/global/infra/typeorm/migrations`,
  },
};
