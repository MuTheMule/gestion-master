const { Pool, Client } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gestion',
  password: 'aaaa',
  port: 5432,
});

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'gestion',
  password: 'aaaa',
  port: 5432,
});

client.connect();

exports.query = (query) => {

return new Promise((resolve, reject) => {
      
      client.query(query, (err, res) => {
        
        if (err) {
          
          return reject(err);

        } else {
          
          return resolve(res.rows);

        }
      });

    });
}

  // promise
  /*client
    .query(query)
    .then(res => console.log(res.rows[0]))
    .catch(e => console.error(e.stack))*/