const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { email, password } = req.body;
  db.query("select * from users where email = ?",[email],(err,result) => {
    if(result.length) return res.json({ message: "Email already exists" }); 
  })
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query("INSERT INTO users (email, password,role) VALUES (?, ?, ?)", [email, hashedPassword,2], (err) => {
    if (err) throw err;
    res.json({ message: "Registration successful" });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) throw err;
    if (result.length && bcrypt.compareSync(password, result[0].password)) {

      const token = jwt.sign({ id: result[0].id, email: result[0].email,role:result[0].role }, process.env.JWT_SECRET);
      res.json({ message: "Login successful", token });
    } else {
      res.json({ message: "Invalid email or password" });
    }
  });
};
