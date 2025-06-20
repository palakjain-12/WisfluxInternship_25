const {Client} = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5432,
        });

client.connect()


// client.query('Select * from employees', (err, res) => {
//     if (err) {
//         console.error('Error executing query', err.stack);
//     } else {
//         console.log('Query result:', res.rows);
//     }
//     client.end();
// }
// );

client.query('INSERT INTO employees (id, first_name, last_name, email, hire_date, salary) VALUES ($1, $2, $3, $4, $5, $6)', 
    [1, 'John', 'Doe', 'john.doe@email.com', '2024-01-15', 50000.00], 
    (err, res) => {
        if (err) {
            console.error('Error executing insert query', err.stack);
        } else {
            console.log('Insert successful:', res.rowCount);
        }
        client.end();
    }
);