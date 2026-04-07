"""
server.py — Lightweight Flask API bridge for HR Forge UI
Place this file in the same folder as employee_hub.py and run:
    python server.py
Then open index.html with VS Code Live Server.
"""

from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_cors import CORS
import sqlite3
import shutil
import os
import json
import uuid
import subprocess
import sys
import webbrowser
import threading
from pathlib import Path
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

_SCHEMA_READY = False

DB_PATH   = Path("data") / "employees.db"
DOCS_ROOT = Path("employee_docs")
BASE_DIR = Path(__file__).parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"
POSTINGS_FILE = BASE_DIR / "postings.json"
SETTINGS_FILE = BASE_DIR / "company_settings.json"

PUBLIC_FILES = {
    "index.html",
    "jd_portal.html",
    "app.js",
    "styles.css",
    "landing.html",
}

try:
    from dotenv import load_dotenv

    load_dotenv(BASE_DIR / ".env")
except ImportError:
    pass

DOC_TYPES = [
    "NID / Passport", "Resume / CV", "Offer Letter",
    "Appointment Letter", "Contract", "Tax Document",
    "Bank Details", "Photo", "Certificate", "Other",
]

LETTER_TEMPLATES = {
    "Offer Letter": """Dear {name},\n\nWe are pleased to offer you the position of {role} in our {department} department.\n\nYour joining date will be {join_date}. Please find attached the full terms of employment.\n\nWe look forward to welcoming you to the team.\n\nWarm regards,\nHR Department""",
    "Appointment Letter": """Dear {name},\n\nThis is to confirm your appointment as {role} in the {department} department, effective from {join_date}.\n\nYour Employee ID is: {employee_id}\n\nPlease report to HR on your first day to complete the onboarding formalities.\n\nSincerely,\nHR Department""",
    "Experience Letter": """To Whom It May Concern,\n\nThis is to certify that {name} (Employee ID: {employee_id}) was employed with our organization as {role} in the {department} department.\n\nDuring their tenure, they demonstrated professionalism and dedication.\n\nWe wish them the best in their future endeavors.\n\nHR Department\nDate: {today}""",
    "Warning Letter": """Dear {name},\n\nThis letter serves as a formal warning regarding your conduct/performance.\n\nPlease take this seriously and ensure improvement within the next 30 days. Failure to do so may result in further disciplinary action.\n\nHR Department\nDate: {today}""",
    "Salary Certificate": """To Whom It May Concern,\n\nThis is to certify that {name} (Employee ID: {employee_id}) is currently employed as {role} in the {department} department.\n\nThis certificate is issued upon request for official purposes.\n\nHR Department\nDate: {today}""",
}


@app.route("/", methods=["GET"])
def root():
    frontend_index = FRONTEND_DIST / "index.html"
    if frontend_index.exists():
        return send_from_directory(FRONTEND_DIST, "index.html")

    landing_path = BASE_DIR / "landing.html"
    if landing_path.exists():
        return send_from_directory(landing_path.parent, landing_path.name)

    return jsonify(
        {
            "service": "HR Forge API",
            "status": "ok",
            "message": "API server is running. Use /api/* endpoints.",
            "ui": "Open /employee-hub or /hiring-portal in your browser.",
            "health": "/health",
        }
    )


@app.route("/employee-hub", methods=["GET"])
def employee_hub_ui():
    frontend_index = FRONTEND_DIST / "index.html"
    if frontend_index.exists():
        return send_from_directory(FRONTEND_DIST, "index.html")
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/hiring-portal", methods=["GET"])
def hiring_portal_ui():
    frontend_index = FRONTEND_DIST / "index.html"
    if frontend_index.exists():
        return send_from_directory(FRONTEND_DIST, "index.html")
    return send_from_directory(BASE_DIR, "jd_portal.html")


@app.route("/assets/<path:filename>", methods=["GET"])
def public_assets(filename):
    dist_assets = FRONTEND_DIST / "assets"
    if dist_assets.exists():
        candidate = dist_assets / Path(filename).name
        if candidate.exists() and candidate.is_file():
            return send_from_directory(dist_assets, candidate.name)

    safe_name = Path(filename).name
    if safe_name not in PUBLIC_FILES:
        return jsonify({"error": "File not found"}), 404
    return send_from_directory(BASE_DIR, safe_name)


@app.route("/legacy/<path:filename>", methods=["GET"])
def legacy_assets(filename):
    legacy_dir = FRONTEND_DIST / "legacy"
    if legacy_dir.exists():
        candidate = legacy_dir / filename
        if candidate.exists() and candidate.is_file():
            return send_from_directory(legacy_dir, filename)

    src_legacy = BASE_DIR / "frontend" / "public" / "legacy"
    if src_legacy.exists():
        candidate = src_legacy / filename
        if candidate.exists() and candidate.is_file():
            return send_from_directory(src_legacy, filename)

    return jsonify({"error": "File not found"}), 404


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/health", methods=["GET"])
def api_health():
    openai_key = os.getenv("OPENAI_API_KEY", "")
    li_token = os.getenv("LINKEDIN_ACCESS_TOKEN", "")
    li_person = os.getenv("LINKEDIN_PERSON_URN", "")
    fb_token = os.getenv("FACEBOOK_ACCESS_TOKEN", "")
    fb_page = os.getenv("FACEBOOK_PAGE_ID", "")
    betopia_url = os.getenv("BETOPIA_JOBS_URL", "https://betopiagroup.com/career")
    job_portal_url = os.getenv("JOB_PORTAL_URL", "")
    return jsonify(
        {
            "status": "ok",
            "timestamp": datetime.now().isoformat(),
            "integrations": {
                "openai": bool(openai_key),
                "linkedin": bool(li_token and li_person),
                "facebook": bool(fb_token and fb_page),
                "betopia": bool(betopia_url),
                "betopia_url": betopia_url,
                "job_portal": bool(job_portal_url),
                "job_portal_url": job_portal_url,
            },
        }
    )


def get_conn():
    global _SCHEMA_READY
    if not _SCHEMA_READY:
        ensure_schema()
        _SCHEMA_READY = True
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def ensure_schema():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    cur = conn.cursor()

    cur.execute("PRAGMA table_info(employees)")
    cols = {row[1] for row in cur.fetchall()}
    if "leader_id" not in cols:
        cur.execute("ALTER TABLE employees ADD COLUMN leader_id INTEGER")

    conn.commit()
    conn.close()


def normalize_leader_id(raw, emp_id=None):
    if raw in (None, "", "null"):
        return None

    try:
        leader_id = int(raw)
    except (TypeError, ValueError):
        raise ValueError("Invalid leader_id")

    if emp_id is not None and leader_id == emp_id:
        raise ValueError("Employee cannot be their own leader")

    conn = get_conn()
    exists = conn.execute("SELECT id FROM employees WHERE id=?", (leader_id,)).fetchone()
    conn.close()
    if not exists:
        raise ValueError("Assigned leader not found")

    return leader_id


def audit(action, entity, detail):
    conn = get_conn()
    conn.execute(
        "INSERT INTO audit_log (action, entity, detail) VALUES (?,?,?)",
        (action, entity, detail),
    )
    conn.commit()
    conn.close()


# ── Employees ──────────────────────────────────────────────────────────────────

@app.route("/api/employees", methods=["GET"])
def get_employees():
    status = request.args.get("status", "active")
    search = request.args.get("search", "")
    conn = get_conn()
    if search:
        rows = conn.execute(
            "SELECT * FROM employees WHERE (full_name LIKE ? OR employee_id LIKE ?) AND status=? ORDER BY full_name",
            (f"%{search}%", f"%{search}%", status),
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM employees WHERE status=? ORDER BY full_name", (status,)
        ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/employees", methods=["POST"])
def add_employee():
    d = request.json
    try:
        leader_id = normalize_leader_id(d.get("leader_id"))
        conn = get_conn()
        conn.execute(
            """INSERT INTO employees
               (full_name, employee_id, department, role, email, phone, whatsapp, join_date, leader_id)
               VALUES (?,?,?,?,?,?,?,?,?)""",
            (d["full_name"], d["employee_id"], d.get("department",""),
             d.get("role",""), d.get("email",""), d.get("phone",""),
             d.get("whatsapp",""), d.get("join_date", datetime.now().strftime("%Y-%m-%d")), leader_id),
        )
        conn.commit()
        conn.close()
        emp_folder = DOCS_ROOT / d["employee_id"]
        emp_folder.mkdir(parents=True, exist_ok=True)
        audit("ADD_EMPLOYEE", d["employee_id"], d["full_name"])
        return jsonify({"success": True})
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "error": "Employee ID already exists"}), 400


@app.route("/api/employees/<int:emp_id>", methods=["GET"])
def get_employee(emp_id):
    conn = get_conn()
    emp = conn.execute("SELECT * FROM employees WHERE id=?", (emp_id,)).fetchone()
    if not emp:
        conn.close()
        return jsonify({"error": "Not found"}), 404

    groups = conn.execute(
        """SELECT wg.group_name, eg.joined_at FROM employee_groups eg
           JOIN whatsapp_groups wg ON eg.group_id=wg.id WHERE eg.employee_id=?""",
        (emp_id,),
    ).fetchall()
    docs = conn.execute(
        "SELECT * FROM employee_documents WHERE employee_id=? ORDER BY uploaded_at DESC",
        (emp_id,),
    ).fetchall()
    letters = conn.execute(
        "SELECT * FROM employee_letters WHERE employee_id=? ORDER BY created_at DESC",
        (emp_id,),
    ).fetchall()
    conn.close()

    result = dict(emp)
    result["groups"]  = [dict(g) for g in groups]
    result["docs"]    = [dict(d) for d in docs]
    result["letters"] = [dict(l) for l in letters]
    return jsonify(result)


@app.route("/api/employees/<int:emp_id>", methods=["PUT"])
def update_employee(emp_id):
    d = request.json
    allowed = ["full_name","department","role","email","phone","whatsapp","status", "leader_id"]
    updates = {k: v for k, v in d.items() if k in allowed}

    if "leader_id" in updates:
        try:
            updates["leader_id"] = normalize_leader_id(updates.get("leader_id"), emp_id=emp_id)
        except ValueError as e:
            return jsonify({"success": False, "error": str(e)}), 400

    if not updates:
        return jsonify({"success": False, "error": "Nothing to update"}), 400
    set_clause = ", ".join(f"{k}=?" for k in updates)
    conn = get_conn()
    conn.execute(f"UPDATE employees SET {set_clause} WHERE id=?", [*updates.values(), emp_id])
    conn.commit()
    conn.close()
    audit("UPDATE_EMPLOYEE", str(emp_id), str(updates))
    return jsonify({"success": True})


@app.route("/api/employees/<int:emp_id>/deactivate", methods=["POST"])
def deactivate_employee(emp_id):
    conn = get_conn()
    emp = conn.execute("SELECT employee_id FROM employees WHERE id=?", (emp_id,)).fetchone()
    conn.execute("UPDATE employees SET status='inactive' WHERE id=?", (emp_id,))
    conn.commit()
    conn.close()
    audit("DEACTIVATE", emp["employee_id"] if emp else str(emp_id), "")
    return jsonify({"success": True})


# ── Stats ──────────────────────────────────────────────────────────────────────

@app.route("/api/stats", methods=["GET"])
def get_stats():
    conn = get_conn()
    total     = conn.execute("SELECT COUNT(*) FROM employees WHERE status='active'").fetchone()[0]
    inactive  = conn.execute("SELECT COUNT(*) FROM employees WHERE status='inactive'").fetchone()[0]
    groups    = conn.execute("SELECT COUNT(*) FROM whatsapp_groups").fetchone()[0]
    docs      = conn.execute("SELECT COUNT(*) FROM employee_documents").fetchone()[0]
    letters   = conn.execute("SELECT COUNT(*) FROM employee_letters").fetchone()[0]
    conn.close()
    return jsonify({"active": total, "inactive": inactive, "groups": groups, "docs": docs, "letters": letters})


# ── WhatsApp Groups ────────────────────────────────────────────────────────────

@app.route("/api/groups", methods=["GET"])
def get_groups():
    conn = get_conn()
    rows = conn.execute(
        """SELECT wg.*, COUNT(eg.id) as member_count FROM whatsapp_groups wg
           LEFT JOIN employee_groups eg ON wg.id=eg.group_id
           GROUP BY wg.id ORDER BY wg.group_name"""
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/groups", methods=["POST"])
def add_group():
    d = request.json
    try:
        conn = get_conn()
        conn.execute(
            "INSERT INTO whatsapp_groups (group_name, description) VALUES (?,?)",
            (d["group_name"], d.get("description", "")),
        )
        conn.commit()
        conn.close()
        audit("ADD_GROUP", d["group_name"], "")
        return jsonify({"success": True})
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "error": "Group already exists"}), 400


@app.route("/api/groups/<int:group_id>/members", methods=["GET"])
def get_group_members(group_id):
    conn = get_conn()
    members = conn.execute(
        """SELECT e.id, e.full_name, e.employee_id, e.role, e.whatsapp, eg.joined_at
           FROM employee_groups eg JOIN employees e ON eg.employee_id=e.id
           WHERE eg.group_id=? ORDER BY e.full_name""",
        (group_id,),
    ).fetchall()
    conn.close()
    return jsonify([dict(m) for m in members])


@app.route("/api/employees/<int:emp_id>/groups", methods=["POST"])
def add_to_group(emp_id):
    group_id = request.json.get("group_id")
    try:
        conn = get_conn()
        conn.execute(
            "INSERT INTO employee_groups (employee_id, group_id) VALUES (?,?)",
            (emp_id, group_id),
        )
        conn.commit()
        conn.close()
        audit("ADD_TO_GROUP", str(emp_id), str(group_id))
        return jsonify({"success": True})
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "error": "Already in group"}), 400


@app.route("/api/employees/<int:emp_id>/groups/<int:group_id>", methods=["DELETE"])
def remove_from_group(emp_id, group_id):
    conn = get_conn()
    conn.execute(
        "DELETE FROM employee_groups WHERE employee_id=? AND group_id=?",
        (emp_id, group_id),
    )
    conn.commit()
    conn.close()
    audit("REMOVE_FROM_GROUP", str(emp_id), str(group_id))
    return jsonify({"success": True})


@app.route("/api/employees/<int:emp_id>/groups", methods=["DELETE"])
def remove_from_all_groups(emp_id):
    conn = get_conn()
    removed = conn.execute(
        "DELETE FROM employee_groups WHERE employee_id=?",
        (emp_id,),
    ).rowcount
    conn.commit()
    conn.close()
    audit("REMOVE_FROM_ALL_GROUPS", str(emp_id), str(removed))
    return jsonify({"success": True, "removed": removed})


@app.route("/api/whatsapp/open", methods=["POST"])
def open_whatsapp():
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]
    launched = False
    for path in chrome_paths:
        if Path(path).exists():
            subprocess.Popen([path, "https://web.whatsapp.com"])
            launched = True
            break
    if not launched:
        webbrowser.open("https://web.whatsapp.com")
    return jsonify({"success": True, "launched": launched})


# ── Documents ──────────────────────────────────────────────────────────────────

@app.route("/api/employees/<int:emp_id>/documents", methods=["GET"])
def get_documents(emp_id):
    conn = get_conn()
    docs = conn.execute(
        "SELECT * FROM employee_documents WHERE employee_id=? ORDER BY uploaded_at DESC",
        (emp_id,),
    ).fetchall()
    conn.close()
    return jsonify([dict(d) for d in docs])


@app.route("/api/employees/<int:emp_id>/documents", methods=["POST"])
def add_document(emp_id):
    doc_type = (request.form.get("doc_type") or "").strip()
    notes = (request.form.get("notes") or "").strip()
    file = request.files.get("file")

    if not doc_type:
        return jsonify({"success": False, "error": "Document type is required"}), 400
    if doc_type not in DOC_TYPES:
        return jsonify({"success": False, "error": "Invalid document type"}), 400
    if not file or not file.filename:
        return jsonify({"success": False, "error": "File is required"}), 400

    conn = get_conn()
    emp = conn.execute("SELECT employee_id FROM employees WHERE id=?", (emp_id,)).fetchone()
    if not emp:
        conn.close()
        return jsonify({"success": False, "error": "Employee not found"}), 404

    filename = secure_filename(file.filename)
    if not filename:
        conn.close()
        return jsonify({"success": False, "error": "Invalid filename"}), 400

    dest_dir = DOCS_ROOT / emp["employee_id"]
    dest_dir.mkdir(parents=True, exist_ok=True)

    base = Path(filename).stem
    ext = Path(filename).suffix
    dest = dest_dir / filename
    idx = 1
    while dest.exists():
        dest = dest_dir / f"{base}_{idx}{ext}"
        idx += 1

    file.save(dest)

    conn.execute(
        """INSERT INTO employee_documents
           (employee_id, doc_type, filename, filepath, notes)
           VALUES (?,?,?,?,?)""",
        (emp_id, doc_type, dest.name, str(dest), notes),
    )
    conn.commit()
    conn.close()

    audit("ADD_DOCUMENT", emp["employee_id"], f"{doc_type}: {dest.name}")
    return jsonify({"success": True, "file": str(dest)})


@app.route("/api/documents/<int:doc_id>/open", methods=["GET"])
def open_document(doc_id):
    conn = get_conn()
    doc = conn.execute(
        "SELECT filename, filepath FROM employee_documents WHERE id=?",
        (doc_id,),
    ).fetchone()
    conn.close()

    if not doc:
        return jsonify({"success": False, "error": "Document not found"}), 404

    file_path = Path(doc["filepath"])
    if not file_path.exists() or not file_path.is_file():
        return jsonify({"success": False, "error": "File missing on disk"}), 404

    return send_file(str(file_path), as_attachment=False, download_name=doc["filename"])


@app.route("/api/doc-types", methods=["GET"])
def doc_types():
    return jsonify(DOC_TYPES)


# ── Letters ────────────────────────────────────────────────────────────────────

@app.route("/api/letter-types", methods=["GET"])
def letter_types():
    return jsonify(list(LETTER_TEMPLATES.keys()))


@app.route("/api/employees/<int:emp_id>/letters", methods=["POST"])
def generate_letter(emp_id):
    letter_type = request.json.get("letter_type")
    template = LETTER_TEMPLATES.get(letter_type)
    if not template:
        return jsonify({"success": False, "error": "Invalid letter type"}), 400

    conn = get_conn()
    emp = conn.execute("SELECT * FROM employees WHERE id=?", (emp_id,)).fetchone()
    if not emp:
        conn.close()
        return jsonify({"success": False, "error": "Employee not found"}), 404

    content = template.format(
        name=emp["full_name"], employee_id=emp["employee_id"],
        department=emp["department"] or "—", role=emp["role"] or "—",
        join_date=emp["join_date"] or "—",
        today=datetime.now().strftime("%d %B %Y"),
    )
    conn.execute(
        "INSERT INTO employee_letters (employee_id, letter_type, content) VALUES (?,?,?)",
        (emp_id, letter_type, content),
    )
    conn.commit()

    letter_dir = DOCS_ROOT / emp["employee_id"] / "letters"
    letter_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out = letter_dir / f"{letter_type.replace(' ','_')}_{ts}.txt"
    out.write_text(content, encoding="utf-8")
    conn.close()

    audit("GENERATE_LETTER", emp["employee_id"], letter_type)
    return jsonify({"success": True, "content": content, "file": str(out)})


# ── Audit Log ──────────────────────────────────────────────────────────────────

@app.route("/api/audit", methods=["GET"])
def get_audit():
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 100"
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


# ── Hiring Portal helpers ─────────────────────────────────────────────────────

def _load_postings():
    if not POSTINGS_FILE.exists():
        return []
    try:
        return json.loads(POSTINGS_FILE.read_text(encoding="utf-8"))
    except Exception:
        return []


def _save_postings(items):
    POSTINGS_FILE.write_text(
        json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8"
    )


def _get_posting(pid):
    return next((p for p in _load_postings() if p["id"] == pid), None)


def _upsert_posting(posting):
    items = _load_postings()
    idx = next((i for i, x in enumerate(items) if x["id"] == posting["id"]), None)
    if idx is not None:
        items[idx] = posting
    else:
        items.append(posting)
    _save_postings(items)


def _ensure_social_status_shape(posting):
    current = posting.get("social_status") or {}
    posting["social_status"] = {
        "linkedin": current.get("linkedin"),
        "facebook": current.get("facebook"),
        "betopia": current.get("betopia"),
        "job_portal": current.get("job_portal"),
    }
    return posting


def _salary_string(state):
    mode = state.get("salaryMode", "range")
    s_min = state.get("salaryMin", "")
    s_max = state.get("salaryMax", "")
    cur = state.get("currency", "BDT")
    period = state.get("payPeriod", "Monthly")
    if mode == "negotiable":
        return "Negotiable (based on experience and skill level)"
    if mode == "competitive":
        return "Highly competitive and commensurate with experience"
    if mode == "skip":
        return "Undisclosed — discussed during the interview process"
    if s_min and s_max:
        return f"{cur} {int(s_min):,} - {int(s_max):,} / {period}"
    if s_min:
        return f"From {cur} {int(s_min):,} / {period}"
    return "Competitive (details shared at interview)"


# ── Hiring Portal API routes ──────────────────────────────────────────────────

@app.route("/api/settings", methods=["GET"])
def portal_get_settings():
    if SETTINGS_FILE.exists():
        return jsonify({"success": True, "data": json.loads(SETTINGS_FILE.read_text())})
    return jsonify({"success": True, "data": {}})


@app.route("/api/settings", methods=["POST"])
def portal_save_settings():
    data = request.get_json(force=True) or {}
    data["updated_at"] = datetime.now().isoformat()
    SETTINGS_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return jsonify({"success": True})


@app.route("/api/generate", methods=["POST"])
def portal_generate():
    openai_key = os.getenv("OPENAI_API_KEY", "")
    if not openai_key:
        return jsonify({"error": "OPENAI_API_KEY not set in environment"}), 503

    body = request.get_json(force=True) or {}
    dept = body.get("department", "")
    role = body.get("role", "")
    tone = body.get("tone", "professional")
    context = body.get("context", "")
    company = body.get("company", {})
    state = body.get("state", {})
    base_tpl = body.get("baseTemplate", {})

    if not dept or not role:
        return jsonify({"error": "department and role are required"}), 400

    import re as _re

    salary_str = _salary_string(state)
    exp_min = state.get("expMin", "")
    exp_max = state.get("expMax", "")
    exp_display = (
        f"{exp_min}-{exp_max} years"
        if exp_min and exp_max
        else (f"{exp_min}+ years" if exp_min else "Open to all levels")
    )

    exp_re = _re.compile(
        r"\b\d+\+?\s*(?:[-–]|to)?\s*\d*\+?\s*years?\s*(?:of\s+)?",
        _re.IGNORECASE,
    )

    def _strip_exp(bullets):
        result = []
        for bullet in bullets:
            cleaned = exp_re.sub("", bullet).strip().strip(",").strip()
            if len(cleaned) > 10:
                result.append(cleaned)
        return result

    clean_requirements = _strip_exp(base_tpl.get("requirements", []))
    clean_responsibilities = _strip_exp(base_tpl.get("responsibilities", []))

    system_prompt = (
        "You are a senior HR director and expert technical recruiter.\n"
        f"Tone: {tone}. Be specific. Name real frameworks, tools, and technologies.\n"
        "Every bullet point must add concrete value. No filler phrases.\n"
        f"CRITICAL RULE: The ONLY experience requirement allowed is exactly '{exp_display}'.\n"
        "Do NOT write any other experience number anywhere in the output.\n"
        "Respond ONLY with valid JSON. No markdown. No explanation. No code fences."
    )

    user_prompt = (
        "Write a REALISTIC, SPECIFIC job posting.\n\n"
        f"Company     : {company.get('name', 'Our Company')}\n"
        f"Location    : {company.get('city', 'Dhaka, Bangladesh')}\n"
        f"Industry    : {company.get('industry', '')}\n"
        f"Department  : {dept}\n"
        f"Role        : {role}\n"
        f"Job Type    : {state.get('jobType', 'Full-Time')}\n"
        f"Experience  : {exp_display}\n"
        f"Salary      : {salary_str}\n"
        f"HR Notes    : {context or 'None'}\n\n"
        f"Base responsibilities: {json.dumps(clean_responsibilities)}\n"
        f"Base requirements   : {json.dumps(clean_requirements)}\n\n"
        "Return this exact JSON:\n"
        "{\n"
        '  "summary": "2-3 sentence role overview",\n'
        '  "responsibilities": ["8-10 specific bullet points"],\n'
        f'  "requirements": ["First: {exp_display} of experience as {role}", "6-9 more requirements"],\n'
        '  "skills": ["12-15 specific technical skills"],\n'
        '  "whyJoin": ["4-5 genuine reasons"]\n'
        "}"
    )

    try:
        from openai import OpenAI

        client = OpenAI(api_key=openai_key)
        resp = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=2000,
            temperature=0.72,
        )
        result = json.loads(resp.choices[0].message.content)
        return jsonify({"success": True, "data": result})
    except json.JSONDecodeError:
        return jsonify({"error": "AI returned malformed JSON — try again"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/postings", methods=["POST"])
def portal_save_posting():
    body = request.get_json(force=True) or {}
    posting = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "department": body.get("department", ""),
        "role": body.get("role", ""),
        "company": body.get("company", {}),
        "state": body.get("state", {}),
        "outputs": body.get("outputs", {}),
        "social_status": {
            "linkedin": None,
            "facebook": None,
            "betopia": None,
            "job_portal": None,
        },
    }
    _upsert_posting(posting)
    return jsonify({"success": True, "id": posting["id"]}), 201


@app.route("/api/postings", methods=["GET"])
def portal_list_postings():
    items = [_ensure_social_status_shape(p) for p in _load_postings()]
    items = sorted(items, key=lambda p: p["created_at"], reverse=True)
    return jsonify({"success": True, "data": items, "count": len(items)})


@app.route("/api/postings/<pid>", methods=["DELETE"])
def portal_delete_posting(pid):
    items = [p for p in _load_postings() if p["id"] != pid]
    _save_postings(items)
    return jsonify({"success": True})


@app.route("/api/post/linkedin", methods=["POST"])
def portal_post_linkedin():
    li_token = os.getenv("LINKEDIN_ACCESS_TOKEN", "")
    li_person = os.getenv("LINKEDIN_PERSON_URN", "")
    li_org = os.getenv("LINKEDIN_ORG_URN", "")
    if not li_token or not li_person:
        return jsonify({"error": "LinkedIn not configured — set LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN"}), 503

    body = request.get_json(force=True) or {}
    text = body.get("text", "").strip()
    posting_id = body.get("posting_id")
    post_as = body.get("post_as", "person")

    if not text:
        return jsonify({"error": "text is required"}), 400
    if len(text) > 3000:
        return jsonify({"error": "LinkedIn posts are limited to 3000 characters"}), 400

    author = li_org if (post_as == "organization" and li_org) else li_person
    payload = {
        "author": author,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text},
                "shareMediaCategory": "NONE",
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
    }

    try:
        import requests

        res = requests.post(
            "https://api.linkedin.com/v2/ugcPosts",
            headers={
                "Authorization": f"Bearer {li_token}",
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0",
            },
            json=payload,
            timeout=15,
        )
        if res.status_code in (200, 201):
            post_id = res.json().get("id", "")
            post_url = f"https://www.linkedin.com/feed/update/{post_id}/"
            if posting_id:
                posting = _get_posting(posting_id)
                if posting:
                    posting["social_status"]["linkedin"] = {
                        "post_id": post_id,
                        "url": post_url,
                        "posted_at": datetime.now().isoformat(),
                    }
                    posting["updated_at"] = datetime.now().isoformat()
                    _upsert_posting(posting)
            return jsonify({"success": True, "post_id": post_id, "url": post_url})

        details = res.json() if res.headers.get("content-type", "").startswith("application/json") else {"raw": res.text}
        return jsonify({"error": "LinkedIn API error", "details": details}), res.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/post/facebook", methods=["POST"])
def portal_post_facebook():
    fb_token = os.getenv("FACEBOOK_ACCESS_TOKEN", "")
    fb_page = os.getenv("FACEBOOK_PAGE_ID", "")
    if not fb_token or not fb_page:
        return jsonify({"error": "Facebook not configured — set FACEBOOK_ACCESS_TOKEN and FACEBOOK_PAGE_ID"}), 503

    body = request.get_json(force=True) or {}
    text = body.get("text", "").strip()
    posting_id = body.get("posting_id")
    link = body.get("link", "")

    if not text:
        return jsonify({"error": "text is required"}), 400

    payload = {"message": text, "access_token": fb_token}
    if link:
        payload["link"] = link

    try:
        import requests

        res = requests.post(
            f"https://graph.facebook.com/v19.0/{fb_page}/feed",
            data=payload,
            timeout=15,
        )
        data = res.json()
        if res.status_code == 200 and "id" in data:
            post_id = data["id"]
            parts = post_id.split("_")
            pg_id = parts[0] if len(parts) == 2 else fb_page
            fb_pid = parts[1] if len(parts) == 2 else post_id
            post_url = f"https://www.facebook.com/{pg_id}/posts/{fb_pid}/"

            if posting_id:
                posting = _get_posting(posting_id)
                if posting:
                    posting["social_status"]["facebook"] = {
                        "post_id": post_id,
                        "url": post_url,
                        "posted_at": datetime.now().isoformat(),
                    }
                    posting["updated_at"] = datetime.now().isoformat()
                    _upsert_posting(posting)
            return jsonify({"success": True, "post_id": post_id, "url": post_url})

        return jsonify({"error": "Facebook API error", "details": data.get("error", data)}), res.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/post/facebook/job", methods=["POST"])
def portal_post_facebook_job():
    fb_token = os.getenv("FACEBOOK_ACCESS_TOKEN", "")
    fb_page = os.getenv("FACEBOOK_PAGE_ID", "")
    if not fb_token or not fb_page:
        return jsonify({"error": "Facebook not configured"}), 503

    body = request.get_json(force=True) or {}
    emp_map = {
        "Full-Time": "FULL_TIME",
        "Part-Time": "PART_TIME",
        "Contract": "CONTRACTOR",
        "Internship": "INTERN",
    }
    payload = {
        "job_title": body.get("title", ""),
        "job_description": body.get("description", ""),
        "employment_type": emp_map.get(body.get("employment_type", "Full-Time"), "FULL_TIME"),
        "location": json.dumps(body.get("location", {"city": "Dhaka", "country": "BD"})),
        "access_token": fb_token,
    }
    if body.get("apply_link"):
        payload["external_apply_link"] = body["apply_link"]
    if body.get("salary_min") and body.get("salary_max"):
        payload["salary"] = json.dumps(
            {
                "min": body["salary_min"],
                "max": body["salary_max"],
                "currency": body.get("currency", "BDT"),
                "period": "MONTHLY",
            }
        )

    try:
        import requests

        res = requests.post(
            f"https://graph.facebook.com/v19.0/{fb_page}/jobs",
            data=payload,
            timeout=15,
        )
        data = res.json()
        if res.status_code == 200 and "id" in data:
            return jsonify({"success": True, "job_id": data["id"]})
        return jsonify({"error": "Facebook Jobs API error", "details": data}), res.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/post/betopia", methods=["POST"])
def portal_post_betopia():
    body = request.get_json(force=True) or {}
    posting_id = body.get("posting_id")
    text = body.get("text", "").strip()
    if not text:
        return jsonify({"error": "text is required"}), 400

    target_url = os.getenv("BETOPIA_JOBS_URL", "https://betopiagroup.com/career").strip() or "https://betopiagroup.com/career"
    auto_open = bool(body.get("open", True))

    try:
        if auto_open:
            webbrowser.open(target_url)

        if posting_id:
            posting = _get_posting(posting_id)
            if posting:
                _ensure_social_status_shape(posting)
                posting["social_status"]["betopia"] = {
                    "url": target_url,
                    "posted_at": datetime.now().isoformat(),
                    "manual": True,
                }
                posting["updated_at"] = datetime.now().isoformat()
                _upsert_posting(posting)

        return jsonify({
            "success": True,
            "url": target_url,
            "manual": True,
            "message": "Betopia Jobs portal opened. Paste/submit the generated posting there.",
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/post/job-portal", methods=["POST"])
def portal_post_job_portal():
    body = request.get_json(force=True) or {}
    posting_id = body.get("posting_id")
    text = body.get("text", "").strip()
    if not text:
        return jsonify({"error": "text is required"}), 400

    target_url = (body.get("url") or os.getenv("JOB_PORTAL_URL", "")).strip()
    if not target_url:
        return jsonify({"error": "Job portal URL missing. Provide url in request or set JOB_PORTAL_URL."}), 400

    auto_open = bool(body.get("open", True))

    try:
        if auto_open:
            webbrowser.open(target_url)

        if posting_id:
            posting = _get_posting(posting_id)
            if posting:
                _ensure_social_status_shape(posting)
                posting["social_status"]["job_portal"] = {
                    "url": target_url,
                    "posted_at": datetime.now().isoformat(),
                    "manual": True,
                }
                posting["updated_at"] = datetime.now().isoformat()
                _upsert_posting(posting)

        return jsonify({
            "success": True,
            "url": target_url,
            "manual": True,
            "message": "External job portal opened. Paste/submit the generated posting there.",
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/post/all", methods=["POST"])
def portal_post_all():
    body = request.get_json(force=True) or {}
    results = {}

    li_token = os.getenv("LINKEDIN_ACCESS_TOKEN", "")
    li_person = os.getenv("LINKEDIN_PERSON_URN", "")
    li_org = os.getenv("LINKEDIN_ORG_URN", "")
    if li_token and li_person:
        try:
            import requests

            payload = {
                "author": li_org if (li_org and body.get("post_as") == "organization") else li_person,
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {"text": body.get("linkedin_text", body.get("text", ""))},
                        "shareMediaCategory": "NONE",
                    }
                },
                "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
            }
            res = requests.post(
                "https://api.linkedin.com/v2/ugcPosts",
                headers={
                    "Authorization": f"Bearer {li_token}",
                    "Content-Type": "application/json",
                    "X-Restli-Protocol-Version": "2.0.0",
                },
                json=payload,
                timeout=15,
            )
            results["linkedin"] = {"success": res.status_code in (200, 201), "status": res.status_code}
        except Exception as e:
            results["linkedin"] = {"success": False, "error": str(e)}

    fb_token = os.getenv("FACEBOOK_ACCESS_TOKEN", "")
    fb_page = os.getenv("FACEBOOK_PAGE_ID", "")
    if fb_token and fb_page:
        try:
            import requests

            res = requests.post(
                f"https://graph.facebook.com/v19.0/{fb_page}/feed",
                data={"message": body.get("facebook_text", body.get("text", "")), "access_token": fb_token},
                timeout=15,
            )
            results["facebook"] = {"success": res.status_code == 200, "status": res.status_code}
        except Exception as e:
            results["facebook"] = {"success": False, "error": str(e)}

    betopia_url = os.getenv("BETOPIA_JOBS_URL", "https://betopiagroup.com/career").strip() or "https://betopiagroup.com/career"
    results["betopia"] = {
        "success": True,
        "manual": True,
        "url": betopia_url,
        "message": "Manual submission required",
    }

    job_portal_url = (body.get("job_portal_url") or os.getenv("JOB_PORTAL_URL", "")).strip()
    if job_portal_url:
        results["job_portal"] = {
            "success": True,
            "manual": True,
            "url": job_portal_url,
            "message": "Manual submission required",
        }
    else:
        results["job_portal"] = {
            "success": False,
            "manual": True,
            "error": "JOB_PORTAL_URL not configured",
        }

    return jsonify({"success": True, "results": results})


@app.route("/<path:filename>", methods=["GET"])
def frontend_static_files(filename):
    frontend_file = FRONTEND_DIST / filename
    if frontend_file.exists() and frontend_file.is_file():
        return send_from_directory(FRONTEND_DIST, filename)

    safe_name = Path(filename).name
    if safe_name in PUBLIC_FILES and (BASE_DIR / safe_name).exists():
        return send_from_directory(BASE_DIR, safe_name)

    return jsonify({"error": "Not found"}), 404


if __name__ == "__main__":
    port = int(os.environ.get("HUB_PORT", "5051"))
    app_url = f"http://127.0.0.1:{port}/"

    # Open the UI shortly after startup so Flask has time to bind the port.
    threading.Timer(1.0, lambda: webbrowser.open(app_url)).start()

    print("\n    HR Forge API Server")
    print("  ─────────────────────────────")
    print(f"  Running on {app_url}")
    print("  Browser will open automatically")
    print("  Press Ctrl+C to stop\n")
    app.run(host="127.0.0.1", port=port, debug=False)
