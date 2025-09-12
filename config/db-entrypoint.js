// config/db-entrypoint.js
// if this script is included as a volume in the
// mongo container descriptor in docker-compose.yml,
// then this script is run only if the /data/db directory is empty
// i.e. on first start.  that_s_pretty_neat.tiff
// https://gist.github.com/x-yuri/c229b3f9e8282ea12cecbbe923cc61c1

db.getSiblingDB(process.env.MONGODB_INITDB_DATABASE).auth(
  process.env.MONGODB_INITDB_ROOT_USERNAME,
  process.env.MONGODB_INITDB_ROOT_PASSWORD,
);

// Create the first InvitationCode, with
// known values.
db.getDatabase(process.env.MONGODB_DB);

db.getCollection(invitations).insertOne({
  invite_email: process.env.start_admin_email,
  invite_code: process.env.start_invite_code,
});
