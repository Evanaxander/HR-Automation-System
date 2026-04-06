# HR Forge

AI-powered HR operations and hiring automation platform built with Python, Flask, SQLite, and a modern web interface.

HR Forge combines two production-oriented modules in one system:

- Workforce Hub: employee records, document management, letter generation, WhatsApp group coordination, and audit logs.
- Hiring Portal: AI-assisted job posting generation and social publishing workflows for LinkedIn and Facebook.

## Why This Project Stands Out

- End-to-end workflow coverage from candidate-facing job posts to employee lifecycle operations.
- Practical architecture with persistent storage, API-driven frontend, and operational auditability.
- Real integration mindset with OpenAI, LinkedIn, Facebook, and document handling.
- Clean separation of concerns: UI, API, and terminal tools all share a single source of truth.

## Core Features

### Workforce Hub
- Add, update, search, and deactivate employee records.
- Create and manage employee groups for WhatsApp operations.
- Upload and retrieve employee documents by type.
- Generate formal HR letters from reusable templates.
- Track actions through an audit log.

### Hiring Portal
- Generate realistic, role-specific job postings with AI.
- Customize role details, compensation style, job type, and tone.
- Save and manage posting history.
- Publish directly to LinkedIn and Facebook APIs.
- Validate service health and integration readiness from backend status checks.

## Tech Stack

- Backend: Python, Flask, Flask-CORS, SQLite
- Frontend: HTML, CSS, JavaScript
- AI: OpenAI Chat Completions API
- Integrations: LinkedIn UGC API, Facebook Graph API
- Runtime: Windows-friendly local environment with optional .env configuration

## Project Structure

```text
HR-Automation-System/
├── app.js
├── company_settings.json
├── employee_hub.py
├── index.html
├── jd_portal.html
├── landing.html
├── requirements.txt
├── server.py
├── styles.css
├── data/
│   └── employees.db
├── employee_docs/
└── logs/
```

## Quick Start

### 1. Create or activate a virtual environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2. Install dependencies

```powershell
pip install -r requirements.txt
```

### 3. Configure environment variables (optional for social and AI features)

Create a `.env` file in the project root when needed:

```env
OPENAI_API_KEY=your_openai_key
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_PERSON_URN=urn:li:person:xxxx
LINKEDIN_ORG_URN=urn:li:organization:xxxx
FACEBOOK_ACCESS_TOKEN=your_facebook_page_token
FACEBOOK_PAGE_ID=your_page_id
HUB_PORT=5051
```

### 4. Run the application

```powershell
python server.py
```

Open:

- `http://127.0.0.1:5051/` for the portal selector
- `http://127.0.0.1:5051/employee-hub` for Workforce Hub
- `http://127.0.0.1:5051/hiring-portal` for Hiring Portal

## Optional Terminal Mode

The terminal application is still available:

```powershell
python employee_hub.py
```

Both web and terminal flows use the same SQLite database.

## API Snapshot

- `GET /api/health` integration and service status
- `GET|POST /api/employees` employee listing and onboarding
- `PUT /api/employees/<id>` employee updates
- `POST /api/employees/<id>/deactivate` lifecycle status control
- `GET|POST /api/groups` WhatsApp group operations
- `GET|POST /api/employees/<id>/documents` document handling
- `POST /api/employees/<id>/letters` letter generation
- `GET /api/audit` operational audit events
- `POST /api/generate` AI posting generation
- `POST /api/post/linkedin` publish to LinkedIn
- `POST /api/post/facebook` publish to Facebook

## Engineering Notes

- Data and document paths are created automatically when missing.
- Safe filename handling is applied on uploads.
- Duplicate employee IDs and duplicate group memberships are guarded in DB constraints.
- API routes return structured JSON responses for frontend reliability.

## Recruiter-Focused Highlights

- Demonstrates product thinking, not just coding: solves business-critical HR workflows.
- Shows practical AI implementation with controlled output formatting and domain prompts.
- Includes integration readiness for enterprise channels and extensible architecture.
- Balances UX, backend reliability, and operational traceability.

## Future Improvements

- Role-based access control and authentication.
- Async background jobs for social publishing retries.
- PDF letter export and e-signature workflow.
- Dashboard analytics for hiring funnel and workforce metrics.

## License

This project is provided for educational and portfolio use. Add a formal license if you plan to distribute commercially.
