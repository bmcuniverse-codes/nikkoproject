import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Blockchain() {
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadChain() {
      const [chainResponse, statsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/chain`),
        axios.get(`${API_BASE_URL}/stats`)
      ]);
      setBlocks(chainResponse.data);
      setStats(statsResponse.data);
    }

    loadChain();
  }, []);

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <span className="badge">Blockchain Explorer</span>
          <h1>Permissioned Chain Records</h1>
          <p>Each credential upload produces a tamper-evident hash block.</p>
        </div>
        {stats && <div className="chain-status">Chain valid: <strong>{stats.chainValid ? "YES" : "NO"}</strong></div>}
      </div>

      <div className="chain-list">
        {blocks.map((block) => (
          <article className="block-card" key={block.index}>
            <div className="block-top">
              <h3>Block #{block.index}</h3>
              <span>{new Date(block.timestamp).toLocaleString()}</span>
            </div>

            <div className="block-data">
              <p><strong>Type:</strong> {block.data?.type || block.data?.message || "Genesis"}</p>
              {block.data?.studentName && <p><strong>Student:</strong> {block.data.studentName}</p>}
              {block.data?.matric && <p><strong>Matric:</strong> {block.data.matric}</p>}
              {block.data?.credentialType && <p><strong>Credential:</strong> {block.data.credentialType}</p>}
            </div>

            <p className="hash-label">Current Hash</p>
            <div className="hash-box">{block.hash}</div>
            <p className="hash-label">Previous Hash</p>
            <div className="hash-box">{block.previousHash}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
