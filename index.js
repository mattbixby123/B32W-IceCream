const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_ice_cream_shop_db');
const app = express();

// static routes here (you only need these for deployment)

// parse the body into JS Objects
app.use(express.json());

// Log the requests as they come in
app.use(require('morgan')('dev'));


// Read Flavors - READ / GET
app.get('/api/flavors', async (req, res, next) => {
  try {
    const SQL = /*sql*/
    `
    SELECT * from flavors ORDER BY id DESC;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error)
  }
});

// Read SINGLE Flavor - READ / GET
app.get('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = /*sql*/
    `
    SELECT * from flavors;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error)
  }
})  

// Create Notes - CREATE / POST
// app.post('/api/notes', async (req, res, next) => {
//   try {
//     const SQL = /*sql*/
//     `
//     INSERT INTO notes(txt)
//     VALUES($1)
//     RETURNING *
//     `;
//     const response = await client.query(SQL, [req.body.txt]);
//     res.send(response.rows[0]);
//   } catch (ex) {
//     next(ex);
//   }
// });

// Updates Notes - UPDATE / PUT
// app.put('/api/notes/:id', async (req, res, next) => {
//   try {
//     const SQL = /*sql*/
//     `
//     UPDATE notes 
//     SET txt=$1, ranking=$2, updated_at= now()
//     WHERE id=$3 RETURNING *
//     `;
//     const response = await client.query(SQL, [req.body.txt, req.body.ranking, req.params.id]);
//     res.send(response.rows[0]);
//   } catch (ex) {
//     next(ex);
//   }
// });

// Delete Notes - DELETE / DELETE
// app.delete('/api/notes/:id', async (req, res, next) => {
//   try {
//     const SQL = /*sql*/
//     `
//     DELETE from notes
//     WHERE id = $1
//     `;
//     const response = await client.query(SQL, [req.params.id]);
//     res.sendStatus(204);
//   } catch (ex) {
//     next(ex);
//   }
// });

// create your init function (create and run the express app)
const init =  async () => {
  await client.connect();
  console.log('connected to database');
  let SQL = /*sql*/
    `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors (
    id SERIAL PRIMARY KEY,
    name CHAR(55) NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    );
    `;
  await client.query(SQL);
  console.log('tables created');
  SQL = /*sql*/
    `
    INSERT INTO flavors(name) VALUES('Chocolate');
    INSERT INTO flavors(name, is_favorite) VALUES('Vanilla', true);
    INSERT INTO flavors(name) VALUES('Strawberry');
    INSERT INTO flavors(name, is_favorite) VALUES('Cookies N Cream', true);
    INSERT INTO flavors(name, is_favorite) VALUES('Cookie Dough', true); 
    `;
  await client.query(SQL);
  console.log('data seeded');
  const serverPort = process.env.PORT || 3000;
  app.listen(serverPort, () => console.log(`Listening on port ${serverPort}`));
};

// init function invocation
init();
