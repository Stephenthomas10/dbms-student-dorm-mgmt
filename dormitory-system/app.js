const express = require('express'); 
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dormitory_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Routes
app.post('/register_student', (req, res) => {
    const { name, email, phone, dormitory_id } = req.body;
    const sql = 'INSERT INTO Student (name, email, phone, dormitory_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, phone, dormitory_id], (err, result) => {
        if (err) throw err;
        res.send('Student registered with ID: ' + result.insertId);
    });
});

app.post('/assign_room', (req, res) => {
    const { student_id, room_id, move_in_date } = req.body;
    const checkAvailabilitySql = 'SELECT availability FROM Room WHERE room_id = ?';
    db.query(checkAvailabilitySql, [room_id], (err, results) => {
        if (err) throw err;

        if (results.length > 0 && results[0].availability) {
            const assignSql = 'INSERT INTO Assignment (student_id, room_id, move_in_date) VALUES (?, ?, ?)';
            db.query(assignSql, [student_id, room_id, move_in_date], (err) => {
                if (err) throw err;

                const updateSql = 'UPDATE Room SET availability = FALSE WHERE room_id = ?';
                db.query(updateSql, [room_id], (err) => {
                    if (err) throw err;
                    res.send('Room assigned successfully.');
                });
            });
        } else {
            res.send('Sorry, the room is not available.');
        }
    });
});

// Route to add new room
app.post('/add_room', (req, res) => {
    const { room_number, availability } = req.body;
    const sql = 'INSERT INTO Room (room_number, availability) VALUES (?, ?)';
    db.query(sql, [room_number, availability], (err, result) => {
        if (err) throw err;
        res.send('Room added successfully with ID: ' + result.insertId);
    });
});

app.get('/check_availability', (req, res) => {
    const sql = 'SELECT room_id, room_number, availability FROM Room';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
