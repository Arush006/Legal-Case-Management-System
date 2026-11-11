# Nyaya — Legal Case Management

A bilingual React and Node.js starter application for organizing Indian legal matters. Case notes and reminders are stored in a local SQLite database at `server/data/nyaya.db`.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal (usually `http://localhost:5173`). The development server proxies API requests to `http://localhost:3001`.

To run the production build and serve both the website and API from one process:

```bash
npm run build
npm start
```

Open `http://localhost:3001`.

## Included

- English and Hindi interface toggle.
- Case creation, search, case details, and deletion.
- Linked reminders and hearing dates, with completion tracking.
- A dashboard and practice summary.
- A local keyword-based legal-section finder with selected references from the Bharatiya Nyaya Sanhita, Bharatiya Nagarik Suraksha Sanhita, Bharatiya Sakshya Adhiniyam, and Constitution of India.
- A SQLite database created automatically on first server start.
- Account creation and sign-in. Passwords are stored as salted scrypt hashes; authenticated sessions use HTTP-only cookies and expire after seven days.
- Separate case and reminder records for each local account. Existing records are assigned to the existing account during database migration.
- Sign out, and no Ctrl+K search shortcut.

## Important limitations

The section finder is a small, illustrative keyword matcher—not an AI system, a complete legal database, or legal advice. Its results can be incomplete or incorrect and do not determine which law applies to a particular situation. Check current legislation on [India Code](https://www.indiacode.nic.in/) and consult a qualified Indian lawyer.

This starter runs as a local application and does not include password reset or cloud backup. Do not expose it to the public internet with real client data without additional security review, deployment hardening, backups, and appropriate privacy and professional safeguards. Case descriptions are not sent to an external AI service.

On first launch, create the device's local account. Later visits show the sign-in form. The account is stored locally with a salted scrypt password hash; sign out from the profile control in the sidebar. Existing case and reminder records remain in the same SQLite database.
