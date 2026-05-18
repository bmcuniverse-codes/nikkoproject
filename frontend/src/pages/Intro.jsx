export default function Intro({ onProceed }) {
  return (
    <section className="intro-page">
      <div className="intro-hero">
        <div className="badge">Final Year Project • Computer Science</div>
        <h1>Blockchain-Based Academic Credential Verification System</h1>
        <p>
          EduVerify protects academic credentials by hashing uploaded documents,
          recording the hash on a simulated permissioned blockchain, and allowing
          instant QR-based verification by authorized verifiers.
        </p>
        <button className="primary-btn" onClick={onProceed}>Proceed to System</button>
      </div>

      <div className="feature-grid">
        <article>
          <h3>Admin Management</h3>
          <p>Create student records, validate details, upload credentials, and store credential hashes securely.</p>
        </article>
        <article>
          <h3>Student Access</h3>
          <p>Students log in with matric numbers, view credential information, and generate secure QR codes.</p>
        </article>
        <article>
          <h3>Verifier Portal</h3>
          <p>Verifiers scan QR codes and confirm authenticity against the blockchain-backed credential hash.</p>
        </article>
        <article>
          <h3>Audit Trail</h3>
          <p>Credential uploads and verification attempts are recorded for transparency and project demonstration.</p>
        </article>
      </div>
    </section>
  );
}
