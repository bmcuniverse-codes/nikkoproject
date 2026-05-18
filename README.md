# EduVerify V2

A responsive web-based academic credential verification system with three roles:

- Admin: creates student records and uploads credentials.
- Student: logs in with matric number and generates a QR code.
- Verifier: scans QR codes and verifies credentials.

The system stores credential file hashes in a simulated permissioned blockchain and keeps an audit trail of upload and verification activity.

## Demo Login

### Admin
- `admin1 / admin123`
- `registry / registry123`
- `ictadmin / lasustech`

### Verifier
- `verifier1 / verify123`
- `security / secure456`
- `external / external789`

### Student
Use a matric number after an admin uploads a student record.

## Local Setup

### Backend

```bash
cd backend
npm install
npm start
```

Backend runs on:

```txt
http://localhost:5001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Deployment

### Render Backend

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`

### Vercel Frontend

- Root Directory: `frontend`
- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Set this Vercel environment variable after Render deployment:

```txt
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```
