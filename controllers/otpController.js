const db = require("../config/db");
const transporter = require("../config/nodemailer");

const sendOTP = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Email sent: " + info.response);
  });
};

exports.generateOTP = (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  db.query("SELECT * FROM otp_store WHERE email = ?", [email], (err, result) => {
    if (err) throw err;
    if (result.length) {
      db.query("UPDATE otp_store SET otp = ? WHERE email = ?", [otp, email], (err) => {
        if (err) throw err;
        sendOTP(email, otp);
        res.json({ message: "OTP updated and sent to email" });
      });
    } else {
      db.query("INSERT INTO otp_store (email, otp) VALUES (?, ?)", [email, otp], (err) => {
        if (err) throw err;
        sendOTP(email, otp);
        res.json({ message: "OTP sent to email" });
      });
    }
  });
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  db.query("SELECT * FROM otp_store WHERE email = ? AND otp = ?", [email, otp], (err, result) => {
    if (err) throw err;
    res.json(result.length ? { message: "OTP verified" } : { message: "Invalid OTP" });
  });
};
