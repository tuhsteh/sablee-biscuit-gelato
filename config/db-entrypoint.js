// config/db-entrypoint.js
// if this script is included as a volume in the
// mongo container descriptor in docker-compose.yml,
// then this script is run only if the /data/db directory is empty
// i.e. on first start.  that_s_pretty_neat.tiff
// https://gist.github.com/x-yuri/c229b3f9e8282ea12cecbbe923cc61c1
// https://stackoverflow.com/a/68253550

// that's a lot of constants!
const logLine = '------------------------------------------------------------';
const authDb = process.env.MONGO_INITDB_DATABASE;
const adminUserName = process.env.MONGO_INITDB_ROOT_USERNAME;
const adminPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
const dbName = process.env.MONGODB_DB;
const dbUserName = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;
const collectionName = 'Invitations';
const startAdminEmail = process.env.start_admin_email;
const startInviteCode = process.env.start_invite_code;
//

// Logging Header for Docker Container Startup Logs
console.log(logLine);
console.log(logLine);
console.log('Starting DB-EntrypointJS...');
console.log(
  `DB-EntrypointJS:  Working with DB:  [${dbName}], Collection:  [${collectionName}]`,
);
console.log(logLine);

// Authenticate with an Admin user
let res = db.getSiblingDB(authDb).auth(adminUserName, adminPassword);
console.log(JSON.stringify(res));
console.log('DB-EntrypointJS:  Attempted Auth.');

// Create a new user for our Application DB
console.log(logLine);
console.log(`Creating new User:  ${dbUserName}@${dbName}`);
res = db.createUser({
  user: dbUserName,
  pwd: dbPassword,
  roles: [
    {
      role: 'readWrite',
      db: dbName,
    },
  ],
});
console.log(`Create User response:  ${JSON.stringify(res)}`);
console.log(db.stats());
console.log(logLine);

// Create the first InvitationCode, with known values.
console.log(logLine);
res = db.getSiblingDB(dbName).createCollection(collectionName);
console.log(JSON.stringify(res));
res = db.getSiblingDB(dbName).getCollection(collectionName).insertOne({
  created_at: new Date(),
  created_by: dbUserName,
  expires_at: '',
  invite_email: startAdminEmail,
  invite_code: startInviteCode,
  uses: 0,
});
console.log(JSON.stringify(res));

// Check our counts; we should have inserted 1 document.
console.log('DB-EntrypointJS:  Attempted Invitation Insert.');
console.log(
  `DB-EntrypointJS:  In [${dbName}/${collectionName}], Document Count:  ${db.getSiblingDB(dbName).getCollection(collectionName).countDocuments()}`,
);
console.log(logLine);
console.log(logLine);
