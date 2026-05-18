import { QRCodeCanvas } from "qrcode.react";

export default function Student({ user }) {
  const student = user?.student || user;

  if (!student) {
    return (
      <div className="card">
        <h2>Student Dashboard</h2>
        <p>No student record found. Please logout and login again.</p>
      </div>
    );
  }

  const qrPayload = JSON.stringify({
    fileHash: student.fileHash,
    matric: student.matric,
  });

  return (
    <div className="student-page">
      <div className="student-hero">
        <div>
          <span className="badge">Student Portal</span>
          <h1>Welcome, {student.name}</h1>
          <p>
            Your academic credential is protected with blockchain hash
            verification and instant QR authentication.
          </p>
        </div>

        <div className="student-avatar">
          {student.name?.charAt(0)}
        </div>
      </div>

      <div className="student-grid">
        <div className="student-card profile-card">
          <h2>Credential Profile</h2>

          <div className="info-grid">
            <div>
              <small>Full Name</small>
              <strong>{student.name}</strong>
            </div>

            <div>
              <small>Matric Number</small>
              <strong>{student.matric}</strong>
            </div>

            <div>
              <small>Email</small>
              <strong>{student.email}</strong>
            </div>

            <div>
              <small>Phone</small>
              <strong>{student.phone}</strong>
            </div>

            <div>
              <small>Gender</small>
              <strong>{student.gender}</strong>
            </div>

            <div>
              <small>Department</small>
              <strong>{student.department}</strong>
            </div>

            <div>
              <small>Level</small>
              <strong>{student.level}</strong>
            </div>

            <div>
              <small>Credential Type</small>
              <strong>{student.credentialType}</strong>
            </div>
          </div>
        </div>

        <div className="student-card qr-modern-card">
          <div className="qr-header">
            <h2>Verification QR</h2>
            <span>Secure</span>
          </div>

          <p>
            Present this QR code to any verifier to confirm the authenticity of
            your credential.
          </p>

          <div className="qr-frame">
            <QRCodeCanvas
              value={qrPayload}
              size={250}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="hash-box">
            <small>Blockchain Hash</small>
            <span>{student.fileHash}</span>
          </div>
        </div>
      </div>
    </div>
  );
}