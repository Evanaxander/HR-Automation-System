"""
HR Forge — Part 3: Employee Records & WhatsApp Hub
Terminal-only | Windows + Chrome | SQLite storage
"""

import os
import sys
import json
import time
import sqlite3
import shutil
import logging
from datetime import datetime
from pathlib import Path

# ── Logging (file only, not cluttering terminal) ───────────────────────────────
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)
logging.basicConfig(
    filename=LOG_DIR / "employee_hub.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# ── Paths ──────────────────────────────────────────────────────────────────────
DB_PATH       = Path("data") / "employees.db"
DOCS_ROOT     = Path("employee_docs")

DB_PATH.parent.mkdir(exist_ok=True)
DOCS_ROOT.mkdir(exist_ok=True)

# ══════════════════════════════════════════════════════════════════════════════
# DATABASE
# ══════════════════════════════════════════════════════════════════════════════

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS employees (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name     TEXT NOT NULL,
            employee_id   TEXT UNIQUE NOT NULL,
            department    TEXT,
            role          TEXT,
            email         TEXT,
            phone         TEXT,
            whatsapp      TEXT,
            join_date     TEXT,
            status        TEXT DEFAULT 'active',
            created_at    TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS whatsapp_groups (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            group_name    TEXT UNIQUE NOT NULL,
            description   TEXT,
            created_at    TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS employee_groups (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id   INTEGER REFERENCES employees(id),
            group_id      INTEGER REFERENCES whatsapp_groups(id),
            joined_at     TEXT DEFAULT (datetime('now')),
            UNIQUE(employee_id, group_id)
        );

        CREATE TABLE IF NOT EXISTS employee_documents (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id   INTEGER REFERENCES employees(id),
            doc_type      TEXT NOT NULL,
            filename      TEXT NOT NULL,
            filepath      TEXT NOT NULL,
            uploaded_at   TEXT DEFAULT (datetime('now')),
            notes         TEXT
        );

        CREATE TABLE IF NOT EXISTS employee_letters (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id   INTEGER REFERENCES employees(id),
            letter_type   TEXT NOT NULL,
            content       TEXT NOT NULL,
            created_at    TEXT DEFAULT (datetime('now')),
            created_by    TEXT DEFAULT 'HR'
        );

        CREATE TABLE IF NOT EXISTS audit_log (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            action        TEXT NOT NULL,
            entity        TEXT,
            detail        TEXT,
            timestamp     TEXT DEFAULT (datetime('now'))
        );
    """)
    conn.commit()
    conn.close()


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def audit(action: str, entity: str, detail: str):
    conn = get_conn()
    conn.execute(
        "INSERT INTO audit_log (action, entity, detail) VALUES (?,?,?)",
        (action, entity, detail),
    )
    conn.commit()
    conn.close()
    logger.info(f"[AUDIT] {action} | {entity} | {detail}")


# ══════════════════════════════════════════════════════════════════════════════
# TERMINAL HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def clear():
    os.system("cls")


def sep(char="─", width=60):
    print(char * width)


def header(title: str):
    clear()
    sep("═")
    print(f"  🎯 HR Forge  |  {title}")
    sep("═")
    print()


def pause():
    input("\n  Press Enter to continue...")


def pick(prompt: str, options: list[str]) -> int:
    """Show numbered menu, return 1-based choice index."""
    print(f"\n  {prompt}")
    sep()
    for i, opt in enumerate(options, 1):
        print(f"  [{i}] {opt}")
    sep()
    while True:
        raw = input("  Choice: ").strip()
        if raw.isdigit() and 1 <= int(raw) <= len(options):
            return int(raw)
        print("  ⚠  Invalid choice — try again.")


def ask(prompt: str, required=True) -> str:
    while True:
        val = input(f"  {prompt}: ").strip()
        if val or not required:
            return val
        print("  ⚠  This field is required.")


def confirm(prompt: str) -> bool:
    return input(f"  {prompt} (y/n): ").strip().lower() == "y"


def fmt_row(row) -> dict:
    return dict(row)


# ══════════════════════════════════════════════════════════════════════════════
# EMPLOYEE MANAGEMENT
# ══════════════════════════════════════════════════════════════════════════════

def add_employee():
    header("Add New Employee")
    print("  Fill in employee details (press Enter to skip optional fields)\n")

    full_name   = ask("Full Name")
    emp_id      = ask("Employee ID (e.g. HR-001)")
    department  = ask("Department")
    role        = ask("Role / Designation")
    email       = ask("Email", required=False)
    phone       = ask("Phone Number", required=False)
    whatsapp    = ask("WhatsApp Number (with country code, e.g. +8801XXXXXXXXX)", required=False)
    join_date   = ask("Join Date (YYYY-MM-DD)", required=False) or datetime.now().strftime("%Y-%m-%d")

    print()
    sep()
    print(f"  Name       : {full_name}")
    print(f"  ID         : {emp_id}")
    print(f"  Department : {department}")
    print(f"  Role       : {role}")
    print(f"  Email      : {email or '—'}")
    print(f"  Phone      : {phone or '—'}")
    print(f"  WhatsApp   : {whatsapp or '—'}")
    print(f"  Join Date  : {join_date}")
    sep()

    if not confirm("Save this employee?"):
        print("  Cancelled.")
        pause()
        return

    try:
        conn = get_conn()
        conn.execute(
            """INSERT INTO employees
               (full_name, employee_id, department, role, email, phone, whatsapp, join_date)
               VALUES (?,?,?,?,?,?,?,?)""",
            (full_name, emp_id, department, role, email, phone, whatsapp, join_date),
        )
        conn.commit()
        conn.close()

        # Create personal doc folder
        emp_folder = DOCS_ROOT / emp_id
        emp_folder.mkdir(exist_ok=True)

        audit("ADD_EMPLOYEE", emp_id, full_name)
        print(f"\n  ✅  Employee '{full_name}' added successfully!")
        print(f"  📁  Document folder created: {emp_folder}")
    except sqlite3.IntegrityError:
        print(f"\n  ❌  Employee ID '{emp_id}' already exists.")

    pause()


def list_employees(status_filter="active") -> list:
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM employees WHERE status=? ORDER BY full_name", (status_filter,)
    ).fetchall()
    conn.close()
    return [fmt_row(r) for r in rows]


def view_employees():
    header("All Employees")
    employees = list_employees()

    if not employees:
        print("  No employees found.")
        pause()
        return

    print(f"  {'#':<4} {'ID':<10} {'Name':<25} {'Department':<18} {'Role':<20}")
    sep()
    for i, e in enumerate(employees, 1):
        print(f"  {i:<4} {e['employee_id']:<10} {e['full_name']:<25} {e['department']:<18} {e['role']:<20}")
    sep()
    print(f"  Total: {len(employees)} employee(s)")
    pause()


def search_employee() -> dict | None:
    """Search by name or ID, return employee dict or None."""
    term = ask("Search by Name or Employee ID")
    conn = get_conn()
    rows = conn.execute(
        """SELECT * FROM employees
           WHERE full_name LIKE ? OR employee_id LIKE ?
           ORDER BY full_name""",
        (f"%{term}%", f"%{term}%"),
    ).fetchall()
    conn.close()

    results = [fmt_row(r) for r in rows]
    if not results:
        print("\n  ❌  No employee found.")
        return None

    if len(results) == 1:
        return results[0]

    print(f"\n  Found {len(results)} matches:\n")
    for i, e in enumerate(results, 1):
        print(f"  [{i}] {e['employee_id']} — {e['full_name']} ({e['department']})")

    idx = pick("Select employee", [e["full_name"] for e in results])
    return results[idx - 1]


def view_employee_profile():
    header("Employee Profile")
    emp = search_employee()
    if not emp:
        pause()
        return

    print()
    sep("─")
    print(f"  👤  {emp['full_name']}  [{emp['status'].upper()}]")
    sep("─")
    print(f"  Employee ID  : {emp['employee_id']}")
    print(f"  Department   : {emp['department']}")
    print(f"  Role         : {emp['role']}")
    print(f"  Email        : {emp['email'] or '—'}")
    print(f"  Phone        : {emp['phone'] or '—'}")
    print(f"  WhatsApp     : {emp['whatsapp'] or '—'}")
    print(f"  Joined       : {emp['join_date']}")
    print(f"  Added on     : {emp['created_at'][:10]}")

    # WhatsApp groups
    conn = get_conn()
    groups = conn.execute(
        """SELECT wg.group_name, eg.joined_at
           FROM employee_groups eg
           JOIN whatsapp_groups wg ON eg.group_id = wg.id
           WHERE eg.employee_id = ?""",
        (emp["id"],),
    ).fetchall()

    # Documents
    docs = conn.execute(
        "SELECT doc_type, filename, uploaded_at FROM employee_documents WHERE employee_id=?",
        (emp["id"],),
    ).fetchall()

    # Letters
    letters = conn.execute(
        "SELECT letter_type, created_at FROM employee_letters WHERE employee_id=?",
        (emp["id"],),
    ).fetchall()
    conn.close()

    print()
    sep("─")
    print(f"  📱  WhatsApp Groups ({len(groups)})")
    if groups:
        for g in groups:
            print(f"       • {g['group_name']}  (joined {g['joined_at'][:10]})")
    else:
        print("       None")

    print()
    print(f"  📄  Documents ({len(docs)})")
    if docs:
        for d in docs:
            print(f"       • [{d['doc_type']}] {d['filename']}  ({d['uploaded_at'][:10]})")
    else:
        print("       None")

    print()
    print(f"  ✉️   Letters ({len(letters)})")
    if letters:
        for l in letters:
            print(f"       • {l['letter_type']}  ({l['created_at'][:10]})")
    else:
        print("       None")

    sep("─")
    pause()


def update_employee():
    header("Update Employee")
    emp = search_employee()
    if not emp:
        pause()
        return

    print(f"\n  Editing: {emp['full_name']} [{emp['employee_id']}]")
    print("  (Press Enter to keep current value)\n")

    fields = {
        "full_name":  "Full Name",
        "department": "Department",
        "role":       "Role",
        "email":      "Email",
        "phone":      "Phone",
        "whatsapp":   "WhatsApp",
    }

    updates = {}
    for col, label in fields.items():
        val = input(f"  {label} [{emp[col] or '—'}]: ").strip()
        if val:
            updates[col] = val

    if not updates:
        print("\n  No changes made.")
        pause()
        return

    set_clause = ", ".join(f"{k}=?" for k in updates)
    vals = list(updates.values()) + [emp["id"]]

    conn = get_conn()
    conn.execute(f"UPDATE employees SET {set_clause} WHERE id=?", vals)
    conn.commit()
    conn.close()

    audit("UPDATE_EMPLOYEE", emp["employee_id"], str(updates))
    print("\n  ✅  Employee updated successfully!")
    pause()


def deactivate_employee():
    header("Deactivate Employee")
    emp = search_employee()
    if not emp:
        pause()
        return

    print(f"\n  ⚠️  This will mark '{emp['full_name']}' as inactive.")
    if not confirm("Proceed?"):
        print("  Cancelled.")
        pause()
        return

    conn = get_conn()
    conn.execute("UPDATE employees SET status='inactive' WHERE id=?", (emp["id"],))
    conn.commit()
    conn.close()

    audit("DEACTIVATE_EMPLOYEE", emp["employee_id"], emp["full_name"])
    print("\n  ✅  Employee deactivated.")
    pause()


# ══════════════════════════════════════════════════════════════════════════════
# DOCUMENT MANAGEMENT
# ══════════════════════════════════════════════════════════════════════════════

DOC_TYPES = [
    "NID / Passport",
    "Resume / CV",
    "Offer Letter",
    "Appointment Letter",
    "Contract",
    "Tax Document",
    "Bank Details",
    "Photo",
    "Certificate",
    "Other",
]


def add_document():
    header("Add Employee Document")
    emp = search_employee()
    if not emp:
        pause()
        return

    print(f"\n  Employee: {emp['full_name']} [{emp['employee_id']}]\n")
    doc_choice = pick("Document Type", DOC_TYPES)
    doc_type   = DOC_TYPES[doc_choice - 1]

    src_path = ask("Full path to the file (drag & drop or paste path)").strip('"').strip("'")
    src      = Path(src_path)

    if not src.exists():
        print(f"\n  ❌  File not found: {src}")
        pause()
        return

    notes = ask("Notes (optional)", required=False)

    # Copy file to employee folder
    dest_dir = DOCS_ROOT / emp["employee_id"]
    dest_dir.mkdir(exist_ok=True)
    dest = dest_dir / src.name

    shutil.copy2(src, dest)

    conn = get_conn()
    conn.execute(
        """INSERT INTO employee_documents
           (employee_id, doc_type, filename, filepath, notes)
           VALUES (?,?,?,?,?)""",
        (emp["id"], doc_type, src.name, str(dest), notes),
    )
    conn.commit()
    conn.close()

    audit("ADD_DOCUMENT", emp["employee_id"], f"{doc_type}: {src.name}")
    print(f"\n  ✅  Document saved: {dest}")
    pause()


def list_documents():
    header("Employee Documents")
    emp = search_employee()
    if not emp:
        pause()
        return

    conn = get_conn()
    docs = conn.execute(
        "SELECT * FROM employee_documents WHERE employee_id=? ORDER BY uploaded_at DESC",
        (emp["id"],),
    ).fetchall()
    conn.close()

    print(f"\n  Documents for: {emp['full_name']}\n")
    if not docs:
        print("  No documents on file.")
        pause()
        return

    for i, d in enumerate(docs, 1):
        exists = "✅" if Path(d["filepath"]).exists() else "❌ missing"
        print(f"  [{i}] [{d['doc_type']}] {d['filename']}  —  {d['uploaded_at'][:10]}  {exists}")
        if d["notes"]:
            print(f"       Notes: {d['notes']}")

    pause()


# ══════════════════════════════════════════════════════════════════════════════
# LETTER GENERATOR
# ══════════════════════════════════════════════════════════════════════════════

LETTER_TEMPLATES = {
    "Offer Letter": """Dear {name},

We are pleased to offer you the position of {role} in our {department} department.

Your joining date will be {join_date}. Please find attached the full terms of employment.

We look forward to welcoming you to the team.

Warm regards,
HR Department""",

    "Appointment Letter": """Dear {name},

This is to confirm your appointment as {role} in the {department} department,
effective from {join_date}.

Your Employee ID is: {employee_id}

Please report to HR on your first day to complete the onboarding formalities.

Sincerely,
HR Department""",

    "Experience Letter": """To Whom It May Concern,

This is to certify that {name} (Employee ID: {employee_id}) was employed
with our organization as {role} in the {department} department.

During their tenure, they demonstrated professionalism and dedication.

We wish them the best in their future endeavors.

HR Department
Date: {today}""",

    "Warning Letter": """Dear {name},

This letter serves as a formal warning regarding your conduct/performance.

Please take this seriously and ensure improvement within the next 30 days.
Failure to do so may result in further disciplinary action.

HR Department
Date: {today}""",

    "Salary Certificate": """To Whom It May Concern,

This is to certify that {name} (Employee ID: {employee_id}) is currently
employed as {role} in the {department} department.

This certificate is issued upon request for official purposes.

HR Department
Date: {today}""",
}


def generate_letter():
    header("Generate Employee Letter")
    emp = search_employee()
    if not emp:
        pause()
        return

    letter_types = list(LETTER_TEMPLATES.keys())
    choice = pick("Letter Type", letter_types)
    letter_type = letter_types[choice - 1]
    template = LETTER_TEMPLATES[letter_type]

    content = template.format(
        name        = emp["full_name"],
        employee_id = emp["employee_id"],
        department  = emp["department"] or "—",
        role        = emp["role"] or "—",
        join_date   = emp["join_date"] or "—",
        today       = datetime.now().strftime("%d %B %Y"),
    )

    print(f"\n  ── Preview: {letter_type} ──\n")
    print(content)
    sep()

    if not confirm("Save this letter?"):
        print("  Cancelled.")
        pause()
        return

    conn = get_conn()
    conn.execute(
        "INSERT INTO employee_letters (employee_id, letter_type, content) VALUES (?,?,?)",
        (emp["id"], letter_type, content),
    )
    conn.commit()
    conn.close()

    # Also save as .txt file
    letter_dir = DOCS_ROOT / emp["employee_id"] / "letters"
    letter_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_file  = letter_dir / f"{letter_type.replace(' ', '_')}_{timestamp}.txt"
    out_file.write_text(content, encoding="utf-8")

    audit("GENERATE_LETTER", emp["employee_id"], letter_type)
    print(f"\n  ✅  Letter saved to database and {out_file}")
    pause()


# ══════════════════════════════════════════════════════════════════════════════
# WHATSAPP GROUP MANAGEMENT
# ══════════════════════════════════════════════════════════════════════════════

def manage_groups_menu():
    while True:
        header("WhatsApp Group Management")
        choice = pick("Choose action", [
            "Add a new group",
            "View all groups",
            "Add employee to a group",
            "Remove employee from a group",
            "View group members",
            "Open WhatsApp Web (Chrome)",
            "Back",
        ])

        if choice == 1: add_group()
        elif choice == 2: view_groups()
        elif choice == 3: add_employee_to_group()
        elif choice == 4: remove_employee_from_group()
        elif choice == 5: view_group_members()
        elif choice == 6: open_whatsapp_web()
        elif choice == 7: break


def add_group():
    header("Add WhatsApp Group")
    name = ask("Group Name (exactly as it appears in WhatsApp)")
    desc = ask("Description (optional)", required=False)

    conn = get_conn()
    try:
        conn.execute(
            "INSERT INTO whatsapp_groups (group_name, description) VALUES (?,?)",
            (name, desc),
        )
        conn.commit()
        audit("ADD_GROUP", name, desc or "")
        print(f"\n  ✅  Group '{name}' added.")
    except sqlite3.IntegrityError:
        print(f"\n  ❌  Group '{name}' already exists.")
    finally:
        conn.close()
    pause()


def view_groups() -> list:
    header("WhatsApp Groups")
    conn = get_conn()
    groups = conn.execute(
        """SELECT wg.*, COUNT(eg.id) as member_count
           FROM whatsapp_groups wg
           LEFT JOIN employee_groups eg ON wg.id = eg.group_id
           GROUP BY wg.id ORDER BY wg.group_name"""
    ).fetchall()
    conn.close()

    if not groups:
        print("  No groups registered yet.")
        pause()
        return []

    result = []
    print(f"  {'#':<4} {'Group Name':<35} {'Members':<10} {'Created'}")
    sep()
    for i, g in enumerate(groups, 1):
        print(f"  {i:<4} {g['group_name']:<35} {g['member_count']:<10} {g['created_at'][:10]}")
        result.append(fmt_row(g))

    sep()
    pause()
    return result


def pick_group() -> dict | None:
    conn = get_conn()
    groups = conn.execute("SELECT * FROM whatsapp_groups ORDER BY group_name").fetchall()
    conn.close()
    groups = [fmt_row(g) for g in groups]

    if not groups:
        print("\n  ❌  No groups registered. Add one first.")
        return None

    idx = pick("Select Group", [g["group_name"] for g in groups])
    return groups[idx - 1]


def add_employee_to_group():
    header("Add Employee → WhatsApp Group")
    emp   = search_employee()
    if not emp:
        pause()
        return

    group = pick_group()
    if not group:
        pause()
        return

    conn = get_conn()
    try:
        conn.execute(
            "INSERT INTO employee_groups (employee_id, group_id) VALUES (?,?)",
            (emp["id"], group["id"]),
        )
        conn.commit()
        audit("ADD_TO_GROUP", emp["employee_id"], group["group_name"])
        print(f"\n  ✅  '{emp['full_name']}' added to '{group['group_name']}' in records.")
        print(f"\n  📌  Next: Open WhatsApp Web and manually add them to the group.")
        print(f"       Their WhatsApp number: {emp['whatsapp'] or '⚠️  not on file'}")

        if confirm("\n  Open WhatsApp Web now?"):
            open_whatsapp_web()
    except sqlite3.IntegrityError:
        print(f"\n  ⚠️  '{emp['full_name']}' is already in '{group['group_name']}'.")
    finally:
        conn.close()

    pause()


def remove_employee_from_group():
    header("Remove Employee ← WhatsApp Group")
    emp   = search_employee()
    if not emp:
        pause()
        return

    conn = get_conn()
    memberships = conn.execute(
        """SELECT eg.id, wg.group_name FROM employee_groups eg
           JOIN whatsapp_groups wg ON eg.group_id = wg.id
           WHERE eg.employee_id=?""",
        (emp["id"],),
    ).fetchall()
    conn.close()

    if not memberships:
        print(f"\n  '{emp['full_name']}' is not in any groups.")
        pause()
        return

    membership_list = [fmt_row(m) for m in memberships]
    idx = pick(f"Remove '{emp['full_name']}' from which group?",
               [m["group_name"] for m in membership_list])
    selected = membership_list[idx - 1]

    if not confirm(f"Remove from '{selected['group_name']}'?"):
        print("  Cancelled.")
        pause()
        return

    conn = get_conn()
    conn.execute("DELETE FROM employee_groups WHERE id=?", (selected["id"],))
    conn.commit()
    conn.close()

    audit("REMOVE_FROM_GROUP", emp["employee_id"], selected["group_name"])
    print(f"\n  ✅  Removed from '{selected['group_name']}' in records.")
    print(f"\n  📌  Remember to also remove them manually on WhatsApp Web.")
    print(f"       Their WhatsApp number: {emp['whatsapp'] or '⚠️  not on file'}")

    if confirm("\n  Open WhatsApp Web now?"):
        open_whatsapp_web()

    pause()


def view_group_members():
    header("View Group Members")
    group = pick_group()
    if not group:
        pause()
        return

    conn = get_conn()
    members = conn.execute(
        """SELECT e.full_name, e.employee_id, e.role, e.whatsapp, eg.joined_at
           FROM employee_groups eg
           JOIN employees e ON eg.employee_id = e.id
           WHERE eg.group_id=?
           ORDER BY e.full_name""",
        (group["id"],),
    ).fetchall()
    conn.close()

    print(f"\n  Group: {group['group_name']}")
    if group["description"]:
        print(f"  Desc : {group['description']}")
    sep()

    if not members:
        print("  No members in this group.")
        pause()
        return

    print(f"  {'#':<4} {'Name':<25} {'ID':<10} {'Role':<20} {'WhatsApp':<18} {'Joined'}")
    sep()
    for i, m in enumerate(members, 1):
        print(f"  {i:<4} {m['full_name']:<25} {m['employee_id']:<10} "
              f"{(m['role'] or '—'):<20} {(m['whatsapp'] or '—'):<18} {m['joined_at'][:10]}")

    sep()
    print(f"  Total: {len(members)} member(s)")
    pause()


def open_whatsapp_web():
    """Launch WhatsApp Web in Chrome."""
    import subprocess
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]
    url = "https://web.whatsapp.com"
    launched = False

    for path in chrome_paths:
        if Path(path).exists():
            subprocess.Popen([path, url])
            print(f"\n  🌐  Opening WhatsApp Web in Chrome...")
            print("  ⏳  Scan QR code if prompted, then manage your groups.")
            launched = True
            break

    if not launched:
        # fallback: use default browser
        import webbrowser
        webbrowser.open(url)
        print("\n  🌐  Opened WhatsApp Web in your default browser.")

    time.sleep(1)


# ══════════════════════════════════════════════════════════════════════════════
# AUDIT LOG VIEWER
# ══════════════════════════════════════════════════════════════════════════════

def view_audit_log():
    header("Audit Log")
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 50"
    ).fetchall()
    conn.close()

    if not rows:
        print("  No activity recorded yet.")
        pause()
        return

    print(f"  Showing last {len(rows)} entries\n")
    print(f"  {'Time':<20} {'Action':<25} {'Entity':<15} {'Detail'}")
    sep()
    for r in rows:
        ts = r["timestamp"][:16]
        print(f"  {ts:<20} {r['action']:<25} {(r['entity'] or '—'):<15} {r['detail'] or ''}")
    sep()
    pause()


# ══════════════════════════════════════════════════════════════════════════════
# MAIN MENU
# ══════════════════════════════════════════════════════════════════════════════

def main():
    init_db()

    while True:
        header("Workforce Hub — Main Menu")
        print("  EMPLOYEE MANAGEMENT")
        print("  [1] Add New Employee")
        print("  [2] View All Employees")
        print("  [3] View Employee Profile")
        print("  [4] Update Employee")
        print("  [5] Deactivate Employee")
        print()
        print("  DOCUMENTS & LETTERS")
        print("  [6] Add Document")
        print("  [7] View Employee Documents")
        print("  [8] Generate Letter")
        print()
        print("  WHATSAPP GROUPS")
        print("  [9] Manage WhatsApp Groups")
        print()
        print("  SYSTEM")
        print("  [10] View Audit Log")
        print("  [0]  Exit")
        sep()

        choice = input("  Choice: ").strip()

        if   choice == "1":  add_employee()
        elif choice == "2":  view_employees()
        elif choice == "3":  view_employee_profile()
        elif choice == "4":  update_employee()
        elif choice == "5":  deactivate_employee()
        elif choice == "6":  add_document()
        elif choice == "7":  list_documents()
        elif choice == "8":  generate_letter()
        elif choice == "9":  manage_groups_menu()
        elif choice == "10": view_audit_log()
        elif choice == "0":
            print("\n  👋  Goodbye!\n")
            sys.exit(0)
        else:
            print("  ⚠️  Invalid choice.")
            time.sleep(0.8)


if __name__ == "__main__":
    main()
