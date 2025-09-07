# mongo >= 6, this is not needed.  mount/use db-entrypoint.js instead
echo 'Creating application user and db'

mongosh ${DB_NAME} \
  --host ${MONGO_HOST} \
  --port ${MONGO_PORT} \
  -u ${MONGO_INITDB_ROOT_USERNAME} \
  -p ${MONGO_INITDB_ROOT_PASSWORD} \
  --authenticationDatabase ${MONGO_INITDB_DATABASE} \
  --eval "db.createUser({user: '${MONGO_USERNAME}', pwd: '${DB_PASSWORD}', roles:[{role:'dbOwner', db: '${MONGO_DB}'}]});"
