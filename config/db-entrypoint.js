// config/db-entrypoint.js
// if this script is included as a volume in the
// mongo container descriptor in docker-compose.yml,
// then this script is run only if the /data/db directory is empty
// i.e. on first start.  that_s_pretty_neat.tiff
// https://gist.github.com/x-yuri/c229b3f9e8282ea12cecbbe923cc61c1

db.getSiblingDB(${MONGO_INITDB_DATABASE}).auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD
);

db.createUser({
  user: process.env.MONGO_USERNAME,
  pwd: process.env.MONGO_PASSWORD,
  roles: ['readWrite'],
});

// use process.env.MONGO_DB);  
// this command is useless here;
// the server will make the DB only when data
// is saved in a Collection in the DB.
