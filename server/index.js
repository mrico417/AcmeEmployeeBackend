// imports here for express and pg
const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_hr_db')

// static routes here (you only need these for deployment)
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use(express.static(path.join(__dirname, '../client/dist')));


// app routes here
app.get('/api/employees', async (req,res,next) => {
    try {

        const getSQL = `SELECT * FROM employee;`;
        const response = await client.query(getSQL);
        res.send(response.rows);

    } catch (error) {
        next(error);
    }
})


// create your init function
const init = async() => {
    await client.connect();
    const SQL= `
        DROP TABLE IF EXISTS employee;
        CREATE TABLE employee(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            is_admin BOOLEAN DEFAULT FALSE
        );

        INSERT INTO employee(name,is_admin) VALUES('mario show',true);
        INSERT INTO employee(name,is_admin) VALUES('pepe moom',false);
        INSERT INTO employee(name) VALUES('kodac dog');
    `;

    await client.query(SQL);
    console.log('tables created and inserted dummy data');
    const PORT = process.env.PORT || 3000
    app.listen(PORT, ()=> console.log(`App listening on ${PORT}`));

}

// init function invocation
init();
