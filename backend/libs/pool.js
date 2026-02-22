const { Pool } = require("pg");
const { is_prod_env } = require("../utils/helpers");

const pool = new Pool({
	connectionString:
		process.env.POSTGRES_URL,
});

module.exports = pool;
