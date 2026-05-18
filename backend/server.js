const express = require("express");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { addBlock, getChain, isChainValid } = require("./blockchain");

const app = express();

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");
const UPLOADS_PATH = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH);
}

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(
      DB_PATH,
      JSON.stringify({ students: [], history: [] }, null, 2)
    );
  }

  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const upload = multer({
  dest: UPLOADS_PATH
});

const admins = [
  {
    username: "admin1",
    password: "admin123",
    role: "admin",
    name: "System Administrator"
  },
  {
    username: "registry",
    password: "registry123",
    role: "admin",
    name: "Registry Officer"
  },
  {
    username: "ictadmin",
    password: "lasustech",
    role: "admin",
    name: "ICT Administrator"
  }
];

const verifiers = [
  {
    username: "verifier1",
    password: "verify123",
    role: "verifier",
    name: "Credential Verifier"
  },
  {
    username: "security",
    password: "secure456",
    role: "verifier",
    name: "Security Unit"
  },
  {
    username: "external",
    password: "external789",
    role: "verifier",
    name: "External Verifier"
  }
];

function normalize(value) {
  return String(value || "").trim();
}

app.get("/", (req, res) => {
  res.send("EduVerify V2 Backend Running");
});

app.post("/login", (req, res) => {
  const role = normalize(req.body.role).toLowerCase();
  const username = normalize(req.body.username);
  const password = normalize(req.body.password);

  if (role === "admin") {
    const user = admins.find(
      (admin) => admin.username === username && admin.password === password
    );

    if (!user) {
      return res.json({ success: false, message: "Invalid admin credentials" });
    }

    return res.json({ success: true, user });
  }

  if (role === "verifier") {
    const user = verifiers.find(
      (verifier) => verifier.username === username && verifier.password === password
    );

    if (!user) {
      return res.json({ success: false, message: "Invalid verifier credentials" });
    }

    return res.json({ success: true, user });
  }

  if (role === "student") {
    const db = readDB();
    const student = db.students.find(
      (item) => item.matric.toLowerCase() === username.toLowerCase()
    );

    if (!student) {
      return res.json({ success: false, message: "Invalid matric number" });
    }

    return res.json({ success: true, user: { role: "student", ...student } });
  }

  res.json({ success: false, message: "Invalid role selected" });
});

app.post("/admin/upload", upload.single("file"), (req, res) => {
  try {
    const name = normalize(req.body.name);
    const matric = normalize(req.body.matric);
    const email = normalize(req.body.email);
    const phone = normalize(req.body.phone);
    const gender = normalize(req.body.gender);
    const department = normalize(req.body.department);
    const level = normalize(req.body.level);
    const credentialType = normalize(req.body.credentialType);
    const session = normalize(req.body.session);

    if (!name || !matric || !email || !phone || !gender || !department || !level || !credentialType || !session) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required student and credential fields"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a credential file"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    const db = readDB();

    const existingStudent = db.students.find(
      (student) => student.matric.toLowerCase() === matric.toLowerCase()
    );

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "A student with this matric number already exists"
      });
    }

    const file = fs.readFileSync(req.file.path);
    const fileHash = crypto.createHash("sha256").update(file).digest("hex");

    const block = addBlock({
      type: "credential_upload",
      studentName: name,
      matric,
      email,
      department,
      credentialType,
      session,
      fileHash
    });

    const student = {
      id: Date.now().toString(),
      name,
      matric,
      email,
      phone,
      gender,
      department,
      level,
      credentialType,
      session,
      fileHash,
      blockIndex: block.index,
      createdAt: new Date().toISOString()
    };

    db.students.push(student);
    db.history.push({
      id: Date.now().toString(),
      action: "Credential Uploaded",
      matric,
      studentName: name,
      status: "success",
      timestamp: new Date().toISOString()
    });

    writeDB(db);

    return res.json({
      success: true,
      message: "Student credential uploaded and stored on blockchain successfully",
      student,
      block
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Upload failed. Please check your backend terminal."
    });
  }
});

app.get("/students", (req, res) => {
  const db = readDB();
  res.json(db.students);
});

app.get("/student/:matric", (req, res) => {
  const db = readDB();
  const matric = normalize(req.params.matric);

  const student = db.students.find(
    (item) => item.matric.toLowerCase() === matric.toLowerCase()
  );

  res.json(student || null);
});

app.post("/verify", (req, res) => {
  const fileHash = normalize(req.body.fileHash);
  const matric = normalize(req.body.matric);

  const db = readDB();

  const student = db.students.find(
    (item) =>
      item.matric.toLowerCase() === matric.toLowerCase() &&
      item.fileHash === fileHash
  );

  const historyRecord = {
    id: Date.now().toString(),
    action: "Credential Verification",
    matric: matric || "Unknown",
    studentName: student ? student.name : "Unknown",
    status: student ? "valid" : "invalid",
    timestamp: new Date().toISOString()
  };

  db.history.push(historyRecord);
  writeDB(db);

  if (!student) {
    return res.json({
      valid: false,
      message: "Credential could not be verified"
    });
  }

  res.json({
    valid: true,
    message: "Credential verified successfully",
    student
  });
});

app.get("/chain", (req, res) => {
  res.json(getChain());
});

app.get("/history", (req, res) => {
  const db = readDB();
  res.json([...db.history].reverse());
});

app.get("/stats", (req, res) => {
  const db = readDB();

  res.json({
    students: db.students.length,
    history: db.history.length,
    blocks: getChain().length,
    chainValid: isChainValid(),
    validChecks: db.history.filter((item) => item.status === "valid").length,
    invalidChecks: db.history.filter((item) => item.status === "invalid").length
  });
});

app.delete("/reset-demo", (req, res) => {
  writeDB({ students: [], history: [] });
  res.json({ success: true, message: "Demo database reset successfully" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`EduVerify V2 backend running on port ${PORT}`);
});
