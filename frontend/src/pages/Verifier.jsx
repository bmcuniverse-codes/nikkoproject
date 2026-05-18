import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Verifier() {
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: {
          width: 260,
          height: 260
        }
      },
      false
    );

    let hasScanned = false;

    scanner.render(
      async (decodedText) => {
        if (hasScanned) return;
        hasScanned = true;

        try {
          const parsed = JSON.parse(decodedText);

          const res = await axios.post(`${API_BASE_URL}/verify`, {
            fileHash: parsed.fileHash,
            matric: parsed.matric
          });

          if (res.data.valid) {
            setResult({
              status: "valid",
              student: res.data.student
            });
          } else {
            setResult({
              status: "invalid",
              message: res.data.message || "Invalid credential"
            });
          }

          setScanning(false);
          await scanner.clear();
        } catch (error) {
          setResult({
            status: "invalid",
            message: "Invalid QR code format"
          });

          setScanning(false);
          await scanner.clear();
        }
      },
      () => {
        // Ignore camera scanning errors while searching for QR
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scanning]);

  const scanAgain = () => {
    setResult(null);
    setScanning(true);
  };

  return (
    <div className="card">
      <h2>Credential Verification</h2>
      <p className="muted">
        Place the QR code clearly inside the scanner box.
      </p>

      {scanning && <div id="reader"></div>}

      {result?.status === "valid" && (
        <div className="success-box">
          <h3>✅ Valid Credential</h3>
          <p><strong>Name:</strong> {result.student.name}</p>
          <p><strong>Matric:</strong> {result.student.matric}</p>
          <p><strong>Email:</strong> {result.student.email}</p>
          <p><strong>Phone:</strong> {result.student.phone}</p>
          <p><strong>Gender:</strong> {result.student.gender}</p>
          <p><strong>Department:</strong> {result.student.department}</p>
          <p><strong>Level:</strong> {result.student.level}</p>
          <p><strong>Credential:</strong> {result.student.credentialType}</p>

          <button className="btn" onClick={scanAgain}>
            Scan Another Credential
          </button>
        </div>
      )}

      {result?.status === "invalid" && (
        <div className="error-box">
          <h3>❌ Invalid Credential</h3>
          <p>{result.message}</p>

          <button className="btn" onClick={scanAgain}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}