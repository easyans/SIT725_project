// database.js - Real SQLite Database
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DeakinPayDatabase {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        // Use file database instead of memory for persistence
        this.db = new sqlite3.Database('./deakinpay.db', (err) => {
            if (err) {
                console.error('Error opening database:', err);
            } else {
                console.log('✅ Connected to SQLite database: deakinpay.db');
                this.createTables();
                this.insertSampleData();
            }
        });
    }

    createTables() {
        // Users table
        this.db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            student_id TEXT UNIQUE,
            course TEXT,
            semester TEXT,
            status TEXT,
            balance DECIMAL(10,2) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Feedback table
        this.db.run(`CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            wants_response BOOLEAN DEFAULT 1,
            status TEXT DEFAULT 'New',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Transactions table
        this.db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            transaction_id TEXT UNIQUE,
            description TEXT,
            amount DECIMAL(10,2),
            type TEXT,
            method TEXT,
            status TEXT,
            transaction_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Fees table
        this.db.run(`CREATE TABLE IF NOT EXISTS fees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            description TEXT,
            amount DECIMAL(10,2),
            due_date TEXT,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // User units table
        this.db.run(`CREATE TABLE IF NOT EXISTS user_units (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            unit_code TEXT,
            unit_name TEXT,
            status TEXT DEFAULT 'Enrolled',
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        console.log('✅ Database tables created');
    }

    async insertSampleData() {
        // Insert sample users
        const users = [
            {
                email: 's224967779@deakin.edu.au',
                password: 'Deakin2025',
                name: 'Valeh Moghaddam',
                student_id: 's224967779',
                course: 'Master of Information Technology',
                semester: 'Trimester 2, 2025',
                status: 'Active - Full Time',
                balance: 7503.00
            },
            {
                email: 'demo@deakin.edu.au',
                password: 'password123',
                name: 'Demo Student',
                student_id: 's123456789',
                course: 'Bachelor of Computer Science',
                semester: 'Trimester 1, 2025',
                status: 'Active - Full Time',
                balance: 6303.00
            }
        ];

        for (const user of users) {
            await this.createUser(user);
        }

        // Get user IDs
        this.db.get("SELECT id FROM users WHERE email = 's224967779@deakin.edu.au'", (err, row) => {
            if (row) {
                const userId = row.id;
                this.insertUserData(userId);
            }
        });
    }

    insertUserData(userId) {
        // Insert units
        const units = [
            ['SIT774', 'SIT774 - Applied Software Engineering'],
            ['SIT722', 'SIT722 - Software Deployment and Operation'],
            ['SIT753', 'SIT753 - Professional Practice in IT']
        ];

        units.forEach(unit => {
            this.db.run(
                'INSERT OR IGNORE INTO user_units (user_id, unit_code, unit_name) VALUES (?, ?, ?)',
                [userId, unit[0], unit[1]]
            );
        });

        // Insert fees
        const fees = [
            ['Tuition Fee (3 units)', 7200.00, '15/10/2025', 'Pending'],
            ['Student Services Fee', 303.00, '15/10/2025', 'Pending']
        ];

        fees.forEach(fee => {
            this.db.run(
                'INSERT OR IGNORE INTO fees (user_id, description, amount, due_date, status) VALUES (?, ?, ?, ?, ?)',
                [userId, ...fee]
            );
        });

        // Insert transactions
        const transactions = [
            ['DKN20250301', 'Library Fee', 125.00, 'payment', 'Credit Card', 'Completed', '01/03/2025'],
            ['DKN20250215', 'Student Services', 303.00, 'payment', 'PayPal', 'Completed', '15/02/2025'],
            ['DKN20250110', 'Tuition Payment', 3600.00, 'payment', 'Bank Transfer', 'Completed', '10/01/2025'],
            ['DKN20241205', 'Late Fee Refund', -50.00, 'refund', 'Bank Transfer', 'Completed', '05/12/2024']
        ];

        transactions.forEach(trans => {
            this.db.run(
                `INSERT OR IGNORE INTO transactions (user_id, transaction_id, description, amount, type, method, status, transaction_date) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, ...trans]
            );
        });

        console.log('✅ Sample data inserted');
    }

    // User methods
    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT * FROM users WHERE email = ?`,
                [email],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    createUser(userData) {
        return new Promise((resolve, reject) => {
            const { email, password, name, student_id, course, semester, status, balance } = userData;
            this.db.run(
                `INSERT INTO users (email, password, name, student_id, course, semester, status, balance) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [email, password, name, student_id, course, semester, status, balance],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    // Feedback methods
    saveFeedback(feedbackData) {
        return new Promise((resolve, reject) => {
            const { name, email, subject, message, wants_response } = feedbackData;
            this.db.run(
                `INSERT INTO feedback (name, email, subject, message, wants_response) 
                 VALUES (?, ?, ?, ?, ?)`,
                [name, email, subject, message, wants_response],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    getAllFeedback() {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM feedback ORDER BY created_at DESC`,
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    updateFeedbackStatus(id, status) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `UPDATE feedback SET status = ? WHERE id = ?`,
                [status, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    deleteFeedback(id) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `DELETE FROM feedback WHERE id = ?`,
                [id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    // Get complete user data with related records
    getCompleteUserData(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                // Get user basic info
                const user = await new Promise((res, rej) => {
                    this.db.get(
                        `SELECT id, email, name, student_id, course, semester, status, balance 
                         FROM users WHERE id = ?`,
                        [userId],
                        (err, row) => err ? rej(err) : res(row)
                    );
                });

                if (!user) {
                    resolve(null);
                    return;
                }

                // Get user units
                const units = await new Promise((res, rej) => {
                    this.db.all(
                        `SELECT unit_name FROM user_units WHERE user_id = ?`,
                        [userId],
                        (err, rows) => err ? rej(err) : res(rows.map(r => r.unit_name))
                    );
                });

                // Get user fees
                const fees = await new Promise((res, rej) => {
                    this.db.all(
                        `SELECT description, amount, due_date as dueDate, status 
                         FROM fees WHERE user_id = ?`,
                        [userId],
                        (err, rows) => err ? rej(err) : res(rows)
                    );
                });

                // Get user transactions
                const transactions = await new Promise((res, rej) => {
                    this.db.all(
                        `SELECT transaction_id as id, transaction_date as date, description, amount, type, method, status 
                         FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC`,
                        [userId],
                        (err, rows) => err ? rej(err) : res(rows)
                    );
                });

                resolve({
                    ...user,
                    units,
                    fees,
                    transactions
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    // Close database
    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = DeakinPayDatabase;