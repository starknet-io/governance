

### Get started

- Install dependencies: 
```shell
yarn install
```

- Create a MySQL database then setup a new file `.env` with the MySQL connection string (see .env.example):

```dotenv
DATABASE_URL=mysql://...
HUB_URL=https://hub.snapshot.org
SERVICE_EVENTS=1
```

- Run [this MySQL query](src/helpers/schema.sql) to create tables on the database.


- In schema _metadatas set
`last_mci` -> `75797275` (All events created by 24. Oct 15:53 Lisbon Time)

- Run the `dev` script to start the server
```shell
yarn dev
```



