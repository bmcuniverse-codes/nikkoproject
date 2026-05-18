import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/history`).then((response) => {
      setHistory(response.data);
    });
  }, []);

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <span className="badge">Audit Trail</span>
          <h1>System Activity History</h1>
          <p>Uploads and verification attempts are listed for transparency.</p>
        </div>
      </div>

      <section className="panel">
        <div className="history-list">
          {history.length === 0 && <p className="muted">No activity yet.</p>}
          {history.map((item) => (
            <div className="history-row" key={item.id}>
              <div>
                <strong>{item.action}</strong>
                <span>{item.studentName} • {item.matric}</span>
              </div>
              <div className={`status-pill ${item.status}`}>{item.status}</div>
              <small>{new Date(item.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
