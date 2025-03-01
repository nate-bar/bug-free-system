const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = 3000

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydb'
})

db.connect()

app.get('/', (req, res) => {
    res.send('Hello World')
})


// RETURNS ALL MEMBERS
app.get('/api/members', (req,res) => {
    db.query('SELECT * FROM Members', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Error fetching users');
            return;
        }
        res.json(results);
    });
});

// RETURNS MEMBER ID, NAME, THEIR CLASSIFICATION, AND LENDING PRIVILEGES
app.get('/api/memberprivileges', (req, res) => {
    db.query('SELECT Members.MemberID, Members.MemberName, MemberClass.ClassName, MemberClass.LendingPeriod, MemberClass.ItemLimit, MemberClass.MediaItemLimit FROM Members INNER JOIN MemberClass ON Members.ClassID=MemberClass.ClassID', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Error fetching user privleges');
            return;
        }
        res.json(results);
    });
});

// RETURNS ALL ITEMS AND THEIR TYPE
app.get('/api/items', (req, res) => {
    db.query('SELECT Items.ItemID, Items.ItemTitle, ItemTypes.TypeName, Items.ItemStatus, Items.LastUpdated, Items.CreatedAt, Items.TimesBorrowed FROM Items INNER JOIN ItemTypes ON ItemTypes.ItemID=Items.ItemID', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Error fetching items');
            return;
        }
        res.json(results);
    });
});

// RETURNS ALL BOOKS
app.get('/api/books', (req, res) => {
    db.query('SELECT Items.ItemID, Items.ItemTitle, Books.BookAuthor, ItemTypes.BookISBN, Genres.GenreName FROM (((Items INNER JOIN ItemTypes ON ItemTypes.ItemID=Items.ItemID AND ItemTypes.TypeName="Book") INNER JOIN Books ON ItemTypes.BookISBN=Books.BookISBN) INNER JOIN Genres ON Books.GenreID=Genres.GenreID)', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Error fetching books');
            return;
        }
        res.json(results);
    });
});

// RETURNS ALL FILMS
app.get('/api/films', (req, res) => {
    db.query('SELECT Items.ItemID, Items.ItemTitle, Films.FilmYear, ItemTypes.FilmID, Genres.GenreName FROM (((Items INNER JOIN ItemTypes ON ItemTypes.ItemID=Items.ItemID AND ItemTypes.TypeName="Film") INNER JOIN Films ON ItemTypes.FilmID=Films.FilmID) INNER JOIN Genres ON Films.GenreID=Genres.GenreID)', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Error fetching films');
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})