FROM mongo:7.0

COPY init-db.js /docker-entrypoint-initdb.d/init-db.js:ro

ENV MONGO_INITDB_DATABASE=db_sn_etml

EXPOSE 27017
