/**
 * HR Forge Portal — app.js
 * Production-grade HR job posting automation system.
 * Integrates with OpenAI API for AI-enhanced realistic job descriptions.
 *
 * Architecture:
 *  - HRForgeApp  : main controller (init, state, events)
 *  - JobData     : all departments / roles / templates
 *  - TemplateEngine : generates LinkedIn / Facebook / Full JD / BDJobs output
 *  - AIService   : OpenAI API wrapper
 *  - UIHelpers   : toast, spinner, DOM utils
 *
 * Usage in existing systems:
 *   const app = new HRForgeApp({ mountId: 'root', apiKey: '...' });
 *   app.init();
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   JOB DATA  —  15 Categories | 60+ Roles
   ═══════════════════════════════════════════════════════════════ */

const JobData = {
  departments: {

    /* ── AI & DATA SCIENCE ───────────────────────────── */
    "AI & Data Science": {
      roles: [
        "Chief AI Officer (CAIO)",
        "AI Architect",
        "Machine Learning Engineer",
        "NLP Researcher",
        "Computer Vision Engineer",
        "Data Scientist",
        "Data Engineer",
        "AI Ethicist / Compliance Officer",
        "Prompt Engineer",
      ],
      baseTemplates: {
        "Chief AI Officer (CAIO)": {
          summary: "We are seeking a visionary Chief AI Officer to define and drive our artificial intelligence strategy, build world-class AI teams, and position the company at the forefront of intelligent technology.",
          responsibilities: [
            "Define, own, and execute the company-wide AI strategy and roadmap",
            "Lead and grow multidisciplinary AI research and engineering teams",
            "Oversee development and deployment of LLMs, CV, and multimodal AI systems",
            "Evaluate emerging AI frameworks and identify high-value innovation opportunities",
            "Collaborate with the C-suite to embed AI into product, operations, and decision-making",
            "Ensure responsible AI practices, model governance, and ethical compliance",
            "Build strategic AI partnerships with academic institutions and technology vendors",
          ],
          requirements: [
            "PhD or Master's in Computer Science, AI, Machine Learning, or related field",
            "10+ years of AI/ML experience with 4+ years in executive or senior leadership",
            "Proven track record of bringing AI products from research to production at scale",
            "Deep expertise in LLMs, deep learning, reinforcement learning, and applied ML",
            "Strong business acumen and experience communicating AI strategy to board level",
            "Published research or significant open-source contributions preferred",
          ],
          skills: ["LLM", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "AI Strategy", "MLOps", "Team Leadership"],
        },
        "AI Architect": {
          summary: "We are hiring an AI Architect to design enterprise-grade AI infrastructure, define system integration patterns, and ensure our AI pipelines are scalable, reliable, and production-ready.",
          responsibilities: [
            "Design end-to-end AI system architectures for LLM, RAG, STT/TTS, and multimodal workloads",
            "Define AI infrastructure standards, model serving patterns, and data pipelines",
            "Review and approve AI system designs across product and engineering teams",
            "Lead proof-of-concept evaluations of new AI frameworks and hardware accelerators",
            "Ensure architecture meets performance, cost, and compliance requirements",
            "Collaborate with DevOps and Platform teams on GPU infrastructure and MLOps",
            "Produce architecture decision records (ADRs) and technical documentation",
          ],
          requirements: [
            "Bachelor's or Master's in Computer Science, AI, or Engineering",
            "7+ years of software/ML engineering with 3+ years in architecture roles",
            "Hands-on experience with LLM fine-tuning, RAG pipelines, and vector databases",
            "Strong proficiency in Python, FastAPI, and cloud platforms (AWS/Azure/GCP)",
            "Experience with distributed training, GPU clusters, and model optimization (ONNX, TensorRT)",
            "Deep knowledge of system design, microservices, and event-driven architectures",
          ],
          skills: ["LLM", "RAG", "FastAPI", "Python", "AWS", "Kubernetes", "MLOps", "System Design"],
        },
        "Machine Learning Engineer": {
          summary: "We are looking for a skilled Machine Learning Engineer to build, train, and deploy production ML models, with a strong focus on large language models, fine-tuning, and RLHF pipelines.",
          responsibilities: [
            "Design, fine-tune, and train LLMs, VLMs, STT/TTS, and multimodal AI models",
            "Implement RLHF (Reinforcement Learning with Human Feedback) pipelines for model optimization",
            "Develop scalable model serving APIs using FastAPI and containerized deployments",
            "Optimize training pipelines for GPU performance, cost, and scalability",
            "Evaluate model performance and implement continuous improvement cycles",
            "Collaborate with backend and product teams to integrate models into production",
            "Research and prototype new architectures and training techniques",
          ],
          requirements: [
            "Bachelor's or Master's in Computer Science, AI, or related field",
            "Strong understanding of OOP and Data Structures & Algorithms",
            "Proven expertise in LLM, RAG, VLM, STT, TTS, and multimodal AI architectures",
            "Experience with fine-tuning and training AI models using PyTorch or TensorFlow",
            "Deep understanding of RL and RLHF with hands-on implementation experience",
            "Proficiency in Python and FastAPI; solid experience with PostgreSQL and MongoDB",
            "Competence in distributed training, GPU pipelines, and large-scale AI deployment",
          ],
          skills: ["Python", "PyTorch", "TensorFlow", "LLM", "RAG", "RLHF", "FastAPI", "PostgreSQL", "MongoDB", "CUDA"],
        },
        "NLP Researcher": {
          summary: "We are seeking an NLP Researcher to push the boundaries of language understanding, develop novel models and techniques, and translate cutting-edge research into real-world product impact.",
          responsibilities: [
            "Research and develop novel NLP architectures and training methodologies",
            "Fine-tune transformer models for domain-specific language tasks",
            "Build and maintain NLP evaluation frameworks and benchmarking pipelines",
            "Publish research findings and contribute to the broader NLP community",
            "Collaborate with product teams to productionize NLP models",
            "Analyze large text corpora and design data collection and annotation pipelines",
          ],
          requirements: [
            "PhD or Master's in Computational Linguistics, NLP, or Computer Science",
            "Strong proficiency in Python and NLP libraries (Hugging Face, SpaCy, NLTK)",
            "Hands-on experience with transformer architectures (BERT, GPT, T5, LLaMA)",
            "Publication record at top NLP/ML venues (ACL, EMNLP, NeurIPS) preferred",
            "Experience with large-scale data processing and pre-training",
          ],
          skills: ["NLP", "Hugging Face", "Transformers", "Python", "PyTorch", "LLM", "BERT", "SpaCy"],
        },
        "Computer Vision Engineer": {
          summary: "We are hiring a Computer Vision Engineer to design and deploy state-of-the-art vision models for real-world applications including object detection, image segmentation, and vision-language tasks.",
          responsibilities: [
            "Develop and deploy computer vision models for detection, classification, and segmentation",
            "Build and fine-tune vision-language models (VLMs) for multimodal applications",
            "Optimize model inference pipelines for edge and cloud deployment",
            "Create and curate annotated image/video datasets for model training",
            "Evaluate model performance and implement improvements using relevant benchmarks",
            "Integrate vision models into production APIs and services",
          ],
          requirements: [
            "Bachelor's or Master's in Computer Science, EE, or related field",
            "3+ years of hands-on computer vision engineering experience",
            "Proficiency in PyTorch, OpenCV, and modern CV frameworks (YOLO, Detectron2)",
            "Experience with VLMs (CLIP, LLaVA, Flamingo) and multimodal architectures",
            "Knowledge of GPU optimization, TensorRT, and model quantization",
          ],
          skills: ["Python", "PyTorch", "OpenCV", "YOLO", "VLM", "TensorRT", "Computer Vision", "Deep Learning"],
        },
        "Data Scientist": {
          summary: "We are looking for a Data Scientist to develop predictive models, generate actionable business insights, and solve complex problems through rigorous statistical analysis and machine learning.",
          responsibilities: [
            "Develop and deploy machine learning models for business use cases",
            "Perform exploratory data analysis and statistical modeling on large datasets",
            "Build end-to-end ML pipelines from data ingestion to model monitoring",
            "Collaborate with product and business teams to frame problems and deliver insights",
            "Design and analyze A/B tests and statistical experiments",
            "Communicate findings clearly to both technical and non-technical stakeholders",
          ],
          requirements: [
            "Bachelor's or Master's in Data Science, Statistics, Computer Science, or related field",
            "3+ years of data science experience in a production environment",
            "Proficiency in Python (pandas, scikit-learn, NumPy) and SQL",
            "Experience with ML frameworks (TensorFlow, PyTorch, XGBoost)",
            "Strong statistical knowledge and A/B testing experience",
          ],
          skills: ["Python", "SQL", "Machine Learning", "scikit-learn", "TensorFlow", "Data Analysis", "Statistics", "Tableau"],
        },
        "Data Engineer": {
          summary: "We are seeking a Data Engineer to design and build scalable data pipelines, maintain data warehouses, and ensure high-quality data flows that power analytics and machine learning.",
          responsibilities: [
            "Design, build, and maintain ETL/ELT pipelines using Apache Spark, Airflow, or dbt",
            "Manage cloud data warehouses (Snowflake, BigQuery, or Redshift) and data lakes",
            "Ensure data quality, lineage, and governance across all pipelines",
            "Collaborate with data scientists and analysts to support their data requirements",
            "Optimize query performance and manage storage costs",
            "Implement monitoring and alerting for pipeline health and data freshness",
          ],
          requirements: [
            "Bachelor's in Computer Science, Engineering, or related field",
            "3+ years of data engineering experience",
            "Strong proficiency in Python or Scala, and advanced SQL",
            "Hands-on experience with Spark, Airflow, dbt, and cloud data warehouses",
            "At least 5 years of experience for senior roles; strong understanding of ETL and data modeling",
            "Experience with GIT, Jenkins, and DevOps workflows is a plus",
          ],
          skills: ["Python", "SQL", "Spark", "Airflow", "dbt", "Snowflake", "BigQuery", "ETL", "Data Modeling"],
        },
        "AI Ethicist / Compliance Officer": {
          summary: "We are hiring an AI Ethicist to ensure our AI systems are fair, transparent, accountable, and aligned with regulatory requirements and societal values.",
          responsibilities: [
            "Develop and maintain the company's AI ethics framework and responsible AI policies",
            "Conduct bias audits, fairness assessments, and model explainability reviews",
            "Advise AI engineering teams on ethical design decisions throughout the ML lifecycle",
            "Monitor emerging AI regulations (EU AI Act, GDPR) and ensure compliance",
            "Engage with external stakeholders, regulators, and civil society on AI ethics",
            "Lead AI risk assessments and impact evaluation processes",
          ],
          requirements: [
            "Advanced degree in Philosophy, Law, Computer Science, or related field",
            "3+ years of experience in AI ethics, technology policy, or responsible tech",
            "Strong understanding of ML systems, algorithmic bias, and fairness techniques",
            "Familiarity with regulatory frameworks (GDPR, EU AI Act, IEEE standards)",
            "Excellent written communication and stakeholder engagement skills",
          ],
          skills: ["AI Ethics", "Policy", "GDPR", "Fairness", "Model Explainability", "Risk Assessment"],
        },
        "Prompt Engineer": {
          summary: "We are seeking a Prompt Engineer to design, optimize, and systematically evaluate prompts and prompt strategies that maximize the performance of LLMs across our product suite.",
          responsibilities: [
            "Design, test, and iterate on prompts for LLM-powered features across the product",
            "Build prompt libraries, templates, and evaluation frameworks",
            "Collaborate with product and engineering teams to integrate LLM capabilities",
            "Monitor model outputs for quality, safety, and relevance",
            "Research and implement advanced prompting techniques (CoT, RAG, few-shot)",
            "Document prompt engineering best practices and maintain internal knowledge bases",
          ],
          requirements: [
            "Bachelor's in Computer Science, Linguistics, or related field",
            "2+ years of experience working with LLMs (GPT-4, Claude, Gemini, LLaMA)",
            "Strong understanding of prompt engineering techniques and LLM behavior",
            "Proficiency in Python for automation and evaluation scripting",
            "Experience with LangChain, LlamaIndex, or similar frameworks",
          ],
          skills: ["LLM", "Prompt Engineering", "Python", "LangChain", "GPT-4", "Evaluation", "RAG"],
        },
      },
    },

    /* ── CLOUD & DEVOPS ──────────────────────────────── */
    "Cloud & DevOps": {
      roles: [
        "Cloud Solutions Architect",
        "DevOps Engineer",
        "Site Reliability Engineer (SRE)",
        "Cloud Security Engineer",
        "Platform Engineer",
        "Infrastructure Manager",
      ],
      baseTemplates: {
        "Cloud Solutions Architect": {
          summary: "We are looking for a Cloud Solutions Architect to design and lead enterprise-grade multi-cloud architectures, drive cloud adoption, and ensure our platforms are scalable, secure, and cost-efficient.",
          responsibilities: [
            "Define cloud architecture strategy across AWS, Azure, and GCP environments",
            "Design scalable, fault-tolerant, and highly available cloud systems",
            "Lead cloud migration projects from on-premise infrastructure",
            "Evaluate and recommend cloud services, vendors, and technologies",
            "Mentor engineering teams on cloud-native patterns and best practices",
            "Ensure architecture meets performance, security, and compliance requirements",
          ],
          requirements: [
            "Bachelor's in Computer Science or Engineering",
            "8+ years of IT experience with 5+ years in cloud architecture",
            "Professional-level certifications (AWS SA Pro, Azure Solutions Expert, or GCP Professional)",
            "Expert knowledge of networking, security, and infrastructure-as-code (Terraform)",
            "Experience with hybrid and multi-cloud environments",
          ],
          skills: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "Cloud Architecture", "Networking", "Security"],
        },
        "DevOps Engineer": {
          summary: "We are hiring a DevOps Engineer to build and maintain our CI/CD pipelines, manage containerized workloads, and ensure fast, reliable software delivery across all environments.",
          responsibilities: [
            "Design and manage CI/CD pipelines using Jenkins, GitHub Actions, or GitLab CI",
            "Manage Kubernetes clusters and Docker containerized applications",
            "Implement infrastructure-as-code using Terraform and Ansible",
            "Monitor system health with Prometheus, Grafana, and Datadog",
            "Conduct incident post-mortems and implement reliability improvements",
            "Collaborate with development teams on deployment automation and release processes",
          ],
          requirements: [
            "Bachelor's in Computer Science or IT",
            "3+ years of DevOps or platform engineering experience",
            "Strong proficiency in Linux, Bash, and Python scripting",
            "Hands-on experience with Docker, Kubernetes, and Helm",
            "Experience with cloud platforms and IaC tools",
          ],
          skills: ["Docker", "Kubernetes", "Jenkins", "Terraform", "AWS", "Python", "Linux", "CI/CD"],
        },
        "Site Reliability Engineer (SRE)": {
          summary: "We are seeking an SRE to own reliability, scalability, and performance of our production systems, bridging the gap between software engineering and operations.",
          responsibilities: [
            "Define and maintain SLOs, SLAs, and error budgets across critical services",
            "Lead incident response, on-call rotations, and blameless post-mortems",
            "Build automation to eliminate toil and improve system reliability",
            "Partner with development teams to embed reliability into the SDLC",
            "Design and implement observability stacks (tracing, logging, metrics)",
            "Capacity plan and optimize system performance at scale",
          ],
          requirements: [
            "Bachelor's in Computer Science or equivalent",
            "4+ years of SRE, DevOps, or infrastructure engineering experience",
            "Deep Linux and systems programming knowledge",
            "Proficiency in monitoring tools: Prometheus, Grafana, OpenTelemetry, Jaeger",
            "Strong Go, Python, or Java development skills",
          ],
          skills: ["SRE", "Kubernetes", "Prometheus", "Go", "Python", "Incident Response", "Observability", "AWS"],
        },
        "Cloud Security Engineer": {
          summary: "We are hiring a Cloud Security Engineer to design and implement robust cloud security controls, ensure compliance, and protect our infrastructure from evolving threats.",
          responsibilities: [
            "Design and implement cloud security architecture across AWS/Azure/GCP",
            "Manage identity and access management (IAM), key management, and secrets vaulting",
            "Conduct cloud security assessments, penetration tests, and misconfiguration reviews",
            "Implement SIEM integration, threat detection, and automated security responses",
            "Ensure compliance with SOC 2, ISO 27001, and cloud security benchmarks (CIS)",
            "Work with DevOps to embed security into CI/CD pipelines (DevSecOps)",
          ],
          requirements: [
            "Bachelor's in Cybersecurity, Computer Science, or IT",
            "4+ years of cloud security engineering experience",
            "Certifications: CCSP, AWS Security Specialty, or CISSP preferred",
            "Strong knowledge of IAM, VPC, network security groups, and WAF",
            "Hands-on experience with security tooling (Wiz, Prisma Cloud, AWS Security Hub)",
          ],
          skills: ["AWS", "Azure", "IAM", "Security", "SIEM", "DevSecOps", "Terraform", "CISSP"],
        },
        "Platform Engineer": {
          summary: "We are looking for a Platform Engineer to build and maintain the internal developer platform that enables engineering teams to ship software faster, more reliably, and with greater confidence.",
          responsibilities: [
            "Build and maintain the internal developer platform (IDP) and self-service tooling",
            "Manage Kubernetes infrastructure and multi-tenant cluster operations",
            "Develop internal APIs, CLIs, and SDKs that improve developer productivity",
            "Define and enforce platform standards, golden paths, and service templates",
            "Collaborate with product engineering teams to understand and address platform needs",
            "Maintain platform documentation, runbooks, and incident response playbooks",
          ],
          requirements: [
            "Bachelor's in Computer Science or Engineering",
            "3+ years of platform, DevOps, or infrastructure engineering",
            "Strong proficiency in Go, Python, or TypeScript",
            "Deep experience with Kubernetes, Helm, and service mesh (Istio, Linkerd)",
            "Experience building internal tooling and developer experience platforms",
          ],
          skills: ["Kubernetes", "Go", "Python", "Terraform", "Helm", "CI/CD", "Platform Engineering"],
        },
        "Infrastructure Manager": {
          summary: "We are hiring an Infrastructure Manager to lead our infrastructure team, drive strategic technology decisions, and ensure our systems are secure, scalable, and always available.",
          responsibilities: [
            "Lead a team of infrastructure engineers across cloud, network, and systems domains",
            "Define and execute the infrastructure roadmap aligned with business growth",
            "Manage vendor relationships, licensing, and infrastructure budgets",
            "Ensure 99.9%+ uptime SLAs across all production systems",
            "Drive disaster recovery, business continuity planning, and security hardening",
            "Collaborate with IT, Security, and Engineering leadership on strategic initiatives",
          ],
          requirements: [
            "Bachelor's in IT, Computer Science, or Engineering; MBA is a plus",
            "8+ years of infrastructure experience with 3+ in a management role",
            "Strong knowledge of cloud platforms, networking, virtualization, and security",
            "ITIL certification preferred",
            "Excellent leadership, vendor management, and communication skills",
          ],
          skills: ["Infrastructure", "AWS", "Azure", "Leadership", "Networking", "ITIL", "Disaster Recovery"],
        },
      },
    },

    /* ── CYBER SECURITY ─────────────────────────────── */
    "Cyber Security": {
      roles: [
        "Chief Information Security Officer (CISO)",
        "Security Analyst (L1/L2/L3)",
        "Penetration Tester (Ethical Hacker)",
        "Security Architect",
        "Incident Response Manager",
        "GRC Specialist",
      ],
      baseTemplates: {
        "Chief Information Security Officer (CISO)": {
          summary: "We are seeking an experienced CISO to lead our information security strategy, build a resilient security culture, and protect our assets from evolving cyber threats.",
          responsibilities: [
            "Define and own the company-wide information security strategy and roadmap",
            "Lead the security organization including SOC, AppSec, GRC, and identity teams",
            "Present security posture and risk reports to the Board and executive leadership",
            "Oversee regulatory compliance (SOC 2, ISO 27001, GDPR, NIST CSF)",
            "Manage incident response and breach communication processes",
            "Drive security culture across the organization through training and awareness",
            "Manage security budget, vendor relationships, and strategic partnerships",
          ],
          requirements: [
            "Bachelor's or Master's in Cybersecurity, CS, or related field",
            "12+ years of security experience with 5+ years in CISO or VP-level security leadership",
            "CISSP, CISM, or CISA certification required",
            "Deep expertise in enterprise security architecture, governance, and compliance",
            "Excellent executive communication and board-level reporting skills",
          ],
          skills: ["CISSP", "CISM", "Security Strategy", "GRC", "NIST", "SOC 2", "ISO 27001", "Leadership"],
        },
        "Security Analyst (L1/L2/L3)": {
          summary: "We are hiring Security Analysts at multiple levels to monitor, detect, investigate, and respond to security threats across our enterprise environments.",
          responsibilities: [
            "Monitor SIEM dashboards and triage security alerts (L1: initial triage, L2/L3: deep investigation)",
            "Investigate security incidents and perform root cause analysis",
            "Perform threat hunting using logs, EDR, and network telemetry",
            "Conduct vulnerability assessments and coordinate remediation",
            "Document incidents, maintain runbooks, and contribute to knowledge base",
            "Escalate complex incidents and coordinate with SOC leadership",
          ],
          requirements: [
            "Bachelor's in Cybersecurity, IT, or Computer Science",
            "1–5+ years depending on level (L1: 1yr, L2: 2–4yr, L3: 5+yr)",
            "Proficiency with SIEM tools: Splunk, Microsoft Sentinel, or QRadar",
            "Knowledge of MITRE ATT&CK, NIST frameworks, and incident response processes",
            "Certifications: CompTIA Security+, CEH, or GCIH preferred",
          ],
          skills: ["SIEM", "Splunk", "MITRE ATT&CK", "Incident Response", "Threat Hunting", "EDR", "Security+"],
        },
        "Penetration Tester (Ethical Hacker)": {
          summary: "We are looking for an ethical hacker to conduct comprehensive penetration tests, simulate real-world attacks, and help fortify our security posture before adversaries can exploit it.",
          responsibilities: [
            "Plan and execute penetration tests against web applications, APIs, networks, and cloud environments",
            "Conduct red team exercises, adversary simulations, and social engineering tests",
            "Perform code reviews for security vulnerabilities using SAST/DAST tools",
            "Document detailed findings with risk ratings and actionable remediation steps",
            "Work closely with development teams to implement security fixes",
            "Stay current with emerging CVEs, zero-days, and attack techniques",
          ],
          requirements: [
            "3+ years of penetration testing or red team experience",
            "Expert proficiency with Metasploit, Burp Suite, Nmap, Cobalt Strike",
            "Strong knowledge of OWASP Top 10 and MITRE ATT&CK framework",
            "Scripting skills: Python, Bash, and PowerShell",
            "OSCP certification required; GPEN, CRTE, or CRTO is a strong plus",
          ],
          skills: ["Penetration Testing", "Metasploit", "Burp Suite", "OSCP", "Python", "OWASP", "Red Team"],
        },
        "Security Architect": {
          summary: "We are seeking a Security Architect to design enterprise security architectures, define security standards, and provide authoritative technical guidance across all engineering and infrastructure initiatives.",
          responsibilities: [
            "Design and review security architectures for cloud, on-premise, and hybrid environments",
            "Define security engineering standards, patterns, and reference architectures",
            "Conduct threat modeling and security design reviews for new systems",
            "Guide development teams on secure coding, authentication, and authorization patterns",
            "Evaluate and select security technologies, vendors, and tools",
            "Collaborate with the CISO on long-term security strategy",
          ],
          requirements: [
            "Bachelor's or Master's in Computer Science or Cybersecurity",
            "8+ years of security engineering with 3+ years in architecture roles",
            "CISSP, SABSA, or TOGAF certification strongly preferred",
            "Deep expertise in zero-trust, IAM, PKI, encryption, and network security",
            "Experience with cloud security architecture on AWS, Azure, or GCP",
          ],
          skills: ["Security Architecture", "Zero Trust", "CISSP", "IAM", "PKI", "AWS", "Threat Modeling"],
        },
        "Incident Response Manager": {
          summary: "We are hiring an Incident Response Manager to lead our cyber incident response capability, manage security crises effectively, and continuously improve our detection and response processes.",
          responsibilities: [
            "Lead and manage end-to-end cyber incident response operations",
            "Develop, maintain, and exercise incident response plans and playbooks",
            "Coordinate cross-functional response teams during active security incidents",
            "Manage forensic investigations and post-incident analysis",
            "Lead breach notification processes and regulatory reporting obligations",
            "Build tabletop exercises and red/blue team simulations",
          ],
          requirements: [
            "Bachelor's in Computer Science, Cybersecurity, or related field",
            "5+ years of incident response or SOC management experience",
            "GCIH, GCFE, or GCFA certification strongly preferred",
            "Deep knowledge of digital forensics, malware analysis, and threat intelligence",
            "Strong leadership, crisis communication, and executive reporting skills",
          ],
          skills: ["Incident Response", "DFIR", "Forensics", "GCIH", "SOC Management", "Threat Intelligence"],
        },
        "GRC Specialist": {
          summary: "We are looking for a GRC Specialist to build and manage our governance, risk, and compliance program, ensuring we meet regulatory obligations and maintain a strong risk posture.",
          responsibilities: [
            "Develop and maintain the corporate GRC framework and risk register",
            "Lead compliance audits for SOC 2, ISO 27001, GDPR, and other applicable standards",
            "Conduct risk assessments and third-party vendor risk reviews",
            "Develop security policies, standards, and procedures",
            "Deliver compliance training and awareness programs company-wide",
            "Manage relationships with external auditors and regulatory bodies",
          ],
          requirements: [
            "Bachelor's in Information Systems, Law, or Cybersecurity",
            "3+ years of GRC, compliance, or risk management experience",
            "Certifications: CISA, CRISC, ISO 27001 Lead Auditor, or CCEP preferred",
            "Strong knowledge of regulatory frameworks (GDPR, SOX, HIPAA, PCI-DSS)",
            "Excellent documentation, analytical, and communication skills",
          ],
          skills: ["GRC", "SOC 2", "ISO 27001", "GDPR", "CISA", "Risk Management", "Compliance"],
        },
      },
    },

    /* ── SOFTWARE DEVELOPMENT ───────────────────────── */
    "Software Development": {
      roles: [
        "VP of Engineering",
        "Technical Lead",
        "Backend Developer",
        "Frontend Developer",
        "Fullstack Developer",
        "Mobile App Developer",
        "API Integrations Specialist",
      ],
      baseTemplates: {
        "VP of Engineering": {
          summary: "We are seeking a VP of Engineering to lead our entire engineering organization, drive technical excellence, and scale our teams and systems to meet ambitious product and business goals.",
          responsibilities: [
            "Lead, mentor, and grow a 20–100+ person engineering organization",
            "Define and execute the engineering strategy, roadmap, and organizational structure",
            "Partner with Product, Design, and CEO to align engineering priorities with business goals",
            "Drive a culture of technical excellence, continuous delivery, and accountability",
            "Manage engineering budgets, headcount planning, and strategic vendor relationships",
            "Own engineering metrics: velocity, quality, reliability, and team health",
          ],
          requirements: [
            "Bachelor's or Master's in Computer Science or Engineering",
            "10+ years of software engineering with 5+ years in engineering management",
            "Proven track record of scaling engineering teams from startup to growth stage",
            "Strong technical background to credibly guide architectural and engineering decisions",
            "Exceptional leadership, communication, and stakeholder management skills",
          ],
          skills: ["Engineering Leadership", "System Architecture", "Agile", "Hiring", "Strategy", "OKRs"],
        },
        "Technical Lead": {
          summary: "We are hiring a Technical Lead to guide a squad of engineers, make key technical decisions, and ensure the delivery of high-quality software while actively contributing code.",
          responsibilities: [
            "Lead a team of 4–8 engineers through design, development, and delivery",
            "Make architectural decisions and own the technical direction for your squad",
            "Conduct code reviews and enforce engineering standards and best practices",
            "Collaborate with Product Managers to refine requirements and write technical specs",
            "Mentor junior and mid-level engineers through pairing and feedback",
            "Contribute meaningful code while maintaining a bird's-eye view of system health",
          ],
          requirements: [
            "Bachelor's in Computer Science or equivalent",
            "6+ years of software engineering with 2+ years in a technical leadership role",
            "Deep proficiency in one or more backend languages (Python, Go, Java, Node.js)",
            "Strong knowledge of system design, distributed systems, and API design",
            "Experience leading agile squads and working with product teams",
          ],
          skills: ["System Design", "Python", "Go", "Java", "Leadership", "Code Review", "API Design"],
        },
        "Backend Developer": {
          summary: "We are looking for a Backend Developer to build robust, scalable APIs and microservices that power our products, with a focus on performance, reliability, and clean architecture.",
          responsibilities: [
            "Design, develop, and maintain RESTful and GraphQL APIs",
            "Build microservices and event-driven systems using modern frameworks",
            "Optimize database queries and design efficient data models",
            "Write comprehensive unit, integration, and API tests",
            "Collaborate with frontend, mobile, and AI teams on system integration",
            "Participate in code reviews and technical design discussions",
          ],
          requirements: [
            "Bachelor's in Computer Science or equivalent experience",
            "3+ years of backend development experience",
            "Proficiency in Python (Django/FastAPI), Java (Spring Boot), Go, or Node.js",
            "Strong SQL skills and experience with NoSQL databases (MongoDB, Redis)",
            "Knowledge of message queues (Kafka, RabbitMQ) and microservices patterns",
          ],
          skills: ["Python", "FastAPI", "Django", "Node.js", "SQL", "PostgreSQL", "MongoDB", "REST API", "Docker"],
        },
        "Frontend Developer": {
          summary: "We are seeking a Frontend Developer to craft high-performance, accessible, and visually compelling user interfaces using modern frameworks and design systems.",
          responsibilities: [
            "Build responsive, accessible UIs using React, Next.js, Angular, or Vue",
            "Implement pixel-perfect designs from Figma and collaborate closely with designers",
            "Optimize performance metrics: LCP, CLS, FID, and bundle size",
            "Integrate with backend REST and GraphQL APIs",
            "Write unit and integration tests for all frontend components",
            "Maintain and evolve the component library and design system",
          ],
          requirements: [
            "Bachelor's in Computer Science or related field",
            "3+ years of frontend development experience",
            "Expert proficiency in React or Next.js with TypeScript",
            "Strong CSS skills and experience with Tailwind or styled-components",
            "Understanding of web performance, accessibility (WCAG 2.1), and SEO",
          ],
          skills: ["React", "Next.js", "TypeScript", "CSS", "Figma", "REST API", "Jest", "Webpack", "Node.js"],
        },
        "Fullstack Developer": {
          summary: "We are hiring a Fullstack Developer who is equally comfortable building beautiful frontend experiences and robust backend services, helping us ship features end-to-end.",
          responsibilities: [
            "Design and develop full-stack features across frontend and backend systems",
            "Build responsive UIs and the APIs that power them",
            "Manage deployments, database schemas, and environment configurations",
            "Participate in the full software development lifecycle from planning to production",
            "Collaborate with designers, product managers, and other engineers",
          ],
          requirements: [
            "Bachelor's in Computer Science or equivalent",
            "4+ years of experience in both frontend and backend development",
            "Proficiency in React or Vue, and Node.js, Python, or PHP on the backend",
            "Strong knowledge of databases (SQL and NoSQL), REST APIs, and cloud services",
            "Understanding of DevOps basics: Docker, CI/CD, and cloud deployment",
          ],
          skills: ["React", "Node.js", "Python", "PostgreSQL", "MongoDB", "Docker", "REST API", "TypeScript"],
        },
        "Mobile App Developer": {
          summary: "We are looking for a Mobile App Developer to build polished, high-performance iOS and Android applications, either natively or using cross-platform frameworks.",
          responsibilities: [
            "Design and develop mobile applications for iOS and/or Android",
            "Build with React Native, Flutter, or native Swift/Kotlin",
            "Integrate with REST and GraphQL APIs and third-party SDKs",
            "Optimize app performance, memory usage, and battery efficiency",
            "Publish apps to App Store and Google Play, and manage release cycles",
            "Write automated tests and conduct device testing across form factors",
          ],
          requirements: [
            "Bachelor's in Computer Science or equivalent",
            "3+ years of mobile app development experience",
            "Proficiency in React Native, Flutter, Swift, or Kotlin",
            "Experience with mobile build pipelines, app signing, and store submissions",
            "Understanding of mobile UX patterns, accessibility, and performance standards",
          ],
          skills: ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android", "REST API", "Firebase"],
        },
        "API Integrations Specialist": {
          summary: "We are seeking an API Integrations Specialist to design, build, and maintain integrations between our platform and third-party systems, ensuring reliable and efficient data exchange.",
          responsibilities: [
            "Design and implement REST, GraphQL, and webhook integrations with third-party APIs",
            "Build integration middleware, data transformation layers, and event-driven pipelines",
            "Troubleshoot and debug complex API integration issues in production",
            "Document integration architectures, data flows, and runbooks",
            "Monitor integration health, latency, and error rates",
            "Evaluate and onboard new API partners and vendors",
          ],
          requirements: [
            "Bachelor's in Computer Science or related field",
            "3+ years of API development and integration experience",
            "Strong proficiency in Python, Node.js, or Java",
            "Deep understanding of REST, GraphQL, OAuth 2.0, and webhooks",
            "Experience with iPaaS platforms (Zapier, MuleSoft, or Make) is a plus",
          ],
          skills: ["REST API", "GraphQL", "Python", "OAuth", "Webhooks", "Node.js", "Integration", "Postman"],
        },
      },
    },

    /* ── SQA & TESTING ──────────────────────────────── */
    "SQA & Testing": {
      roles: [
        "SQA Lead",
        "Automation Test Engineer",
        "Manual QA Tester",
        "Performance Testing Engineer",
        "Security QA Analyst",
      ],
      baseTemplates: {
        "SQA Lead": {
          summary: "We are hiring an SQA Lead to own the quality strategy across our product suite, build and mentor a QA team, and embed quality throughout the software development lifecycle.",
          responsibilities: [
            "Define and execute the overall QA strategy, test plans, and quality gates",
            "Lead and mentor a team of manual and automation QA engineers",
            "Drive adoption of best practices in test automation, CI/CD integration, and shift-left testing",
            "Coordinate with Product and Engineering on release readiness and defect management",
            "Own QA metrics: defect escape rate, test coverage, and automation ROI",
            "Evaluate and implement QA tools, frameworks, and infrastructure",
          ],
          requirements: [
            "Bachelor's in Computer Science or related field",
            "6+ years of QA experience with 2+ in a leadership role",
            "Hands-on experience with automation frameworks (Selenium, Cypress, Playwright)",
            "Strong knowledge of Agile/Scrum, CI/CD, and DevOps quality practices",
            "ISTQB Advanced Level certification preferred",
          ],
          skills: ["QA Strategy", "Selenium", "Cypress", "Playwright", "CI/CD", "ISTQB", "Leadership", "Agile"],
        },
        "Automation Test Engineer": {
          summary: "We are looking for an Automation Test Engineer to build and maintain robust automated test suites that ensure the quality and reliability of our software releases.",
          responsibilities: [
            "Design, build, and maintain automated test suites for UI, API, and integration testing",
            "Develop test scripts using Selenium, Cypress, or Playwright with JavaScript/Python",
            "Integrate automated tests into CI/CD pipelines (Jenkins, GitHub Actions)",
            "Triage and debug automated test failures and maintain test stability",
            "Review feature requirements and design comprehensive test cases",
            "Contribute to improving test infrastructure and reporting dashboards",
          ],
          requirements: [
            "Bachelor's in Computer Science or related field",
            "2+ years of test automation experience",
            "Proficiency in Selenium, Cypress, or Playwright",
            "Strong programming skills in JavaScript, Python, or Java",
            "Understanding of REST API testing using Postman or RestAssured",
          ],
          skills: ["Selenium", "Cypress", "Playwright", "Python", "JavaScript", "CI/CD", "REST API", "Postman"],
        },
        "Manual QA Tester": {
          summary: "We are seeking a detail-oriented Manual QA Tester to ensure our products meet the highest quality standards through thorough testing, clear defect reporting, and strong collaboration.",
          responsibilities: [
            "Execute functional, regression, smoke, and exploratory test cases",
            "Document test cases, test results, and defects with clear steps to reproduce",
            "Collaborate with developers and product managers in an Agile sprint environment",
            "Perform cross-browser and cross-device compatibility testing",
            "Verify bug fixes and validate releases against acceptance criteria",
            "Contribute to maintaining and improving the test case repository",
          ],
          requirements: [
            "Bachelor's in Computer Science or related field",
            "1+ years of manual QA or software testing experience",
            "Strong understanding of software testing methodologies (black-box, white-box)",
            "Experience with bug tracking tools: Jira, Trello, or Azure DevOps",
            "Excellent attention to detail and analytical thinking",
          ],
          skills: ["Manual Testing", "Jira", "Test Cases", "Agile", "Regression Testing", "Bug Reporting"],
        },
        "Performance Testing Engineer": {
          summary: "We are hiring a Performance Testing Engineer to design and execute load, stress, and scalability tests that ensure our systems can handle real-world traffic demands.",
          responsibilities: [
            "Design and execute load, stress, soak, and spike tests using JMeter, k6, or Gatling",
            "Identify performance bottlenecks and work with development teams to resolve them",
            "Establish performance baselines and define acceptable performance thresholds",
            "Integrate performance tests into CI/CD pipelines for continuous performance monitoring",
            "Analyze performance results and produce detailed reports with recommendations",
            "Collaborate with DevOps on infrastructure scaling and optimization",
          ],
          requirements: [
            "Bachelor's in Computer Science or Engineering",
            "2+ years of performance testing experience",
            "Proficiency with performance testing tools: JMeter, k6, Gatling, or Locust",
            "Understanding of backend architectures, databases, and network protocols",
            "Experience with monitoring tools: Grafana, Datadog, or New Relic",
          ],
          skills: ["JMeter", "k6", "Gatling", "Performance Testing", "Grafana", "Load Testing", "CI/CD"],
        },
        "Security QA Analyst": {
          summary: "We are looking for a Security QA Analyst to integrate security testing into the SDLC, identify vulnerabilities before release, and ensure our products are secure by design.",
          responsibilities: [
            "Perform security testing including SAST, DAST, and vulnerability scanning",
            "Conduct OWASP Top 10 assessments and penetration tests on web and mobile applications",
            "Integrate security tools (Snyk, SonarQube, OWASP ZAP) into CI/CD pipelines",
            "Work with developers to remediate identified security vulnerabilities",
            "Define security test cases and maintain security test documentation",
            "Stay current with emerging security vulnerabilities and attack techniques",
          ],
          requirements: [
            "Bachelor's in Computer Science or Cybersecurity",
            "2+ years of security testing or AppSec experience",
            "Knowledge of OWASP Top 10 and common vulnerability classes",
            "Experience with DAST/SAST tools: OWASP ZAP, Burp Suite, Snyk, SonarQube",
            "CEH or CompTIA Security+ certification preferred",
          ],
          skills: ["SAST", "DAST", "OWASP", "Burp Suite", "Snyk", "Security Testing", "Python", "CI/CD"],
        },
      },
    },

    /* ── BLOCKCHAIN ─────────────────────────────────── */
    "Blockchain": {
      roles: [
        "Blockchain Architect",
        "Smart Contract Developer",
        "DApp Developer",
        "Cryptographic Researcher",
        "Tokenomics Analyst",
      ],
      baseTemplates: {
        "Blockchain Architect": {
          summary: "We are seeking a Blockchain Architect to design our decentralized infrastructure, define blockchain integration patterns, and lead the technical direction of Web3 initiatives.",
          responsibilities: [
            "Design blockchain architectures for DeFi, NFT, and enterprise blockchain applications",
            "Evaluate and recommend consensus mechanisms, Layer 1/2 solutions, and cross-chain bridges",
            "Define smart contract architecture standards and security best practices",
            "Lead technical audits of blockchain systems and tokenomics models",
            "Mentor blockchain engineers and drive technical documentation",
            "Collaborate with product teams on blockchain product roadmaps",
          ],
          requirements: [
            "Bachelor's or Master's in Computer Science or cryptography",
            "6+ years of blockchain engineering with 2+ in architecture roles",
            "Deep expertise in Ethereum, Solana, Polygon, or Cosmos ecosystems",
            "Strong proficiency in Solidity, Rust, or Go",
            "Thorough understanding of consensus algorithms, cryptography, and tokenomics",
          ],
          skills: ["Ethereum", "Solidity", "Rust", "Layer 2", "DeFi", "Smart Contracts", "Cryptography", "Web3"],
        },
        "Smart Contract Developer": {
          summary: "We are hiring a Smart Contract Developer to build, test, and audit robust on-chain logic for our DeFi, NFT, and protocol applications.",
          responsibilities: [
            "Write, test, and deploy smart contracts in Solidity and/or Rust",
            "Conduct smart contract audits and implement security best practices",
            "Integrate contracts with frontend DApps using ethers.js or web3.js",
            "Optimize contract gas efficiency and design upgradeable contract patterns",
            "Document smart contract architectures and write comprehensive test suites",
          ],
          requirements: [
            "Bachelor's in Computer Science or equivalent",
            "2+ years of smart contract development experience",
            "Expert proficiency in Solidity; Rust/Anchor experience is a strong plus",
            "Familiarity with OpenZeppelin, Hardhat/Foundry, and DeFi protocols",
            "Understanding of common smart contract vulnerabilities (reentrancy, flash loans)",
          ],
          skills: ["Solidity", "Rust", "Hardhat", "Foundry", "ethers.js", "DeFi", "EVM", "OpenZeppelin"],
        },
        "DApp Developer": {
          summary: "We are looking for a DApp Developer to build intuitive, high-performance decentralized applications that connect users seamlessly to blockchain protocols.",
          responsibilities: [
            "Build frontend DApps using React or Next.js with Web3 wallet integrations",
            "Integrate with smart contracts using ethers.js, viem, or web3.js",
            "Implement wallet authentication (MetaMask, WalletConnect, Coinbase Wallet)",
            "Work with IPFS, The Graph, and decentralized storage solutions",
            "Ensure DApp performance, accessibility, and cross-chain compatibility",
          ],
          requirements: [
            "Bachelor's in Computer Science or related field",
            "2+ years of DApp development experience",
            "Strong proficiency in React/Next.js and TypeScript",
            "Solid understanding of Ethereum/EVM and wallet interaction patterns",
            "Experience with smart contract ABIs and event-driven frontend architectures",
          ],
          skills: ["React", "Next.js", "TypeScript", "ethers.js", "Web3", "MetaMask", "IPFS", "Solidity"],
        },
        "Cryptographic Researcher": {
          summary: "We are seeking a Cryptographic Researcher to advance our cryptographic protocols, contribute to zero-knowledge proof systems, and ensure the mathematical security of our blockchain infrastructure.",
          responsibilities: [
            "Research and develop cryptographic protocols for privacy, authentication, and scalability",
            "Design and implement zero-knowledge proof systems (ZK-SNARKs, ZK-STARKs, PLONKs)",
            "Analyze cryptographic vulnerabilities and conduct security proofs",
            "Collaborate with engineering teams to productionize cryptographic research",
            "Publish research at top cryptography and security conferences",
          ],
          requirements: [
            "PhD in Mathematics, Computer Science, or Cryptography",
            "Deep expertise in applied cryptography, ZKPs, and homomorphic encryption",
            "Proficiency in Rust, C++, or Python for cryptographic implementation",
            "Publication record at CCS, USENIX Security, or similar venues preferred",
          ],
          skills: ["ZK-Proofs", "Rust", "Cryptography", "Mathematics", "Privacy Protocols", "C++"],
        },
        "Tokenomics Analyst": {
          summary: "We are hiring a Tokenomics Analyst to design sustainable token economies, model incentive structures, and ensure our protocol's economic design aligns with long-term growth.",
          responsibilities: [
            "Design and model token distribution, vesting schedules, and emission curves",
            "Analyze protocol incentive mechanisms and model game-theoretic outcomes",
            "Build financial models and simulations for token economic scenarios",
            "Monitor on-chain metrics and token health indicators",
            "Collaborate with product, legal, and engineering teams on tokenomics design",
            "Produce tokenomics documentation and whitepapers",
          ],
          requirements: [
            "Bachelor's or Master's in Economics, Finance, Mathematics, or CS",
            "2+ years of tokenomics, DeFi research, or crypto economics experience",
            "Strong quantitative modeling skills (Python, R, or Excel)",
            "Deep understanding of DeFi protocols, AMMs, governance, and staking mechanics",
            "Excellent written communication for whitepapers and research reports",
          ],
          skills: ["Tokenomics", "DeFi", "Python", "Financial Modeling", "Economics", "On-Chain Analytics"],
        },
      },
    },

    /* ── SALES & BUSINESS DEVELOPMENT ───────────────── */
    "Sales & Business Development": {
      roles: [
        "Chief Revenue Officer (CRO)",
        "Sales Director",
        "Account Executive",
        "Business Development Manager (BDM)",
        "Sales Development Representative (SDR)",
        "Partnership Manager",
      ],
      baseTemplates: {
        "Chief Revenue Officer (CRO)": {
          summary: "We are seeking a CRO to own the full revenue lifecycle, unify our sales and marketing engine, and drive aggressive, sustainable revenue growth.",
          responsibilities: [
            "Own and deliver the company's revenue targets across all channels",
            "Lead Sales, Business Development, and Customer Success organizations",
            "Define go-to-market strategy, pricing, and revenue expansion playbooks",
            "Build and optimize the revenue operations infrastructure and reporting",
            "Foster executive relationships with key accounts and strategic partners",
            "Report revenue performance and forecasts to the CEO and board",
          ],
          requirements: [
            "Bachelor's or MBA in Business, Marketing, or related field",
            "12+ years of revenue or sales leadership experience",
            "Proven track record of scaling revenue from $5M to $50M+ ARR",
            "Deep expertise in SaaS or technology sales motions",
            "Exceptional leadership, negotiation, and executive presence",
          ],
          skills: ["Revenue Strategy", "SaaS Sales", "CRM", "Leadership", "Forecasting", "GTM Strategy"],
        },
        "Sales Director": {
          summary: "We are hiring a Sales Director to lead our sales team, define regional or vertical strategies, and drive consistent revenue growth through a high-performing team.",
          responsibilities: [
            "Lead and develop a team of Account Executives and SDRs",
            "Own a regional or vertical revenue quota and pipeline",
            "Define sales strategy, territory plans, and account targeting",
            "Manage forecasting, pipeline reviews, and CRM hygiene",
            "Drive enterprise deals as an executive sponsor",
            "Collaborate with Marketing on demand generation and lead quality",
          ],
          requirements: [
            "Bachelor's in Business or Marketing",
            "7+ years of sales experience with 3+ years in management",
            "Proven track record of consistently achieving team quota",
            "Experience selling B2B SaaS or technology solutions",
            "Strong CRM proficiency (Salesforce, HubSpot)",
          ],
          skills: ["B2B Sales", "Salesforce", "Team Leadership", "Pipeline Management", "Forecasting", "SaaS"],
        },
        "Account Executive": {
          summary: "We are looking for a high-performing Account Executive to own a territory, hunt new business, and build lasting relationships with mid-market and enterprise clients.",
          responsibilities: [
            "Own the full sales cycle from prospecting to close for mid-market and enterprise accounts",
            "Conduct discovery calls, product demos, and executive presentations",
            "Build and manage a healthy pipeline 3–4x your quota",
            "Collaborate with Solutions Engineers on technical evaluations and POCs",
            "Negotiate and close complex, multi-stakeholder deals",
            "Partner with Customer Success to ensure strong onboarding and renewals",
          ],
          requirements: [
            "Bachelor's in Business, Communications, or related field",
            "3+ years of quota-carrying B2B sales experience",
            "Consistent track record of exceeding sales targets",
            "Proficiency in Salesforce, Outreach, or similar sales tools",
            "Strong discovery, negotiation, and closing skills",
          ],
          skills: ["B2B Sales", "Salesforce", "Negotiation", "Pipeline Management", "SaaS", "Enterprise Sales"],
        },
        "Business Development Manager (BDM)": {
          summary: "We are hiring a BDM to identify and develop new business opportunities, build strategic relationships, and expand our market footprint across new verticals and geographies.",
          responsibilities: [
            "Identify and qualify new business opportunities through market research and outreach",
            "Build relationships with prospects, partners, and industry influencers",
            "Develop and execute go-to-market plans for new verticals or regions",
            "Lead partnership negotiations and structure commercial agreements",
            "Collaborate with Product on market feedback and opportunity validation",
            "Track and report on BD pipeline, win rates, and revenue impact",
          ],
          requirements: [
            "Bachelor's in Business, Marketing, or related field",
            "4+ years of business development or strategic sales experience",
            "Strong network and relationship-building skills",
            "Excellent written and verbal communication skills",
            "Experience with CRM and sales engagement tools",
          ],
          skills: ["Business Development", "CRM", "Negotiation", "Market Research", "Partnership", "B2B"],
        },
        "Sales Development Representative (SDR)": {
          summary: "We are seeking an energetic SDR to generate qualified pipeline by prospecting, outreach, and qualifying inbound and outbound leads for our Account Executive team.",
          responsibilities: [
            "Prospect into target accounts via cold calls, emails, and LinkedIn outreach",
            "Qualify inbound leads from marketing campaigns and website inquiries",
            "Book discovery meetings for Account Executives and meet monthly SQL targets",
            "Maintain accurate CRM records and pipeline data",
            "Collaborate with Marketing on messaging, sequences, and campaign feedback",
            "Continuously improve outreach quality through A/B testing and data analysis",
          ],
          requirements: [
            "Bachelor's in Business, Communications, or related field",
            "0–2 years of sales or customer-facing experience",
            "Strong communication skills and a coachable, competitive mindset",
            "Familiarity with CRM and sales tools (Salesforce, Outreach, Apollo)",
            "Ability to work in a fast-paced, target-driven environment",
          ],
          skills: ["Cold Calling", "Email Prospecting", "CRM", "Salesforce", "Communication", "LinkedIn Sales"],
        },
        "Partnership Manager": {
          summary: "We are looking for a Partnership Manager to develop, manage, and grow strategic alliances that drive mutual value and accelerate our market presence.",
          responsibilities: [
            "Identify, recruit, and onboard strategic technology and channel partners",
            "Manage ongoing partner relationships, joint marketing, and co-selling activities",
            "Negotiate partnership agreements and define joint success metrics",
            "Enable partners with training, resources, and technical support",
            "Track partnership performance, pipeline contribution, and revenue attribution",
            "Represent the company at industry events and partner summits",
          ],
          requirements: [
            "Bachelor's in Business or Marketing",
            "4+ years of partnerships, channel sales, or alliance management experience",
            "Strong relationship building and cross-functional collaboration skills",
            "Experience with CRM and partner management platforms",
            "Excellent communication and negotiation skills",
          ],
          skills: ["Partnerships", "Channel Sales", "CRM", "Negotiation", "SaaS", "GTM Strategy"],
        },
      },
    },

    /* ── MARKETING ──────────────────────────────────── */
    "Marketing": {
      roles: [
        "Chief Marketing Officer (CMO)",
        "Digital Marketing Manager",
        "Content Strategist",
        "SEO/SEM Specialist",
        "Growth Hacker",
        "Social Media Manager",
        "Brand Manager",
        "Performance Marketer",
      ],
      baseTemplates: {
        "Chief Marketing Officer (CMO)": {
          summary: "We are seeking a CMO to own our brand, drive demand generation, and build a high-performing marketing organization that fuels revenue growth and market leadership.",
          responsibilities: [
            "Define and execute the company's marketing strategy across brand, demand, and product marketing",
            "Lead and develop the full marketing team including digital, content, design, and growth",
            "Own marketing KPIs: pipeline contribution, CAC, LTV, and brand awareness",
            "Drive integrated marketing campaigns across paid, earned, and owned channels",
            "Collaborate with Sales, Product, and Leadership on GTM strategy and positioning",
            "Manage the marketing budget with a focus on measurable ROI",
          ],
          requirements: [
            "Bachelor's or MBA in Marketing, Business, or related field",
            "10+ years of marketing with 4+ years in senior marketing leadership",
            "Proven experience scaling marketing for B2B SaaS or technology companies",
            "Deep expertise in demand generation, brand, and product marketing",
            "Strong data-driven decision-making and analytical capabilities",
          ],
          skills: ["Marketing Strategy", "Demand Generation", "Brand", "CRM", "HubSpot", "Leadership", "Analytics"],
        },
        "Digital Marketing Manager": {
          summary: "We are hiring a data-driven Digital Marketing Manager to lead our online marketing engine across paid, SEO, email, and social channels to drive qualified growth.",
          responsibilities: [
            "Develop and execute multi-channel digital marketing strategies",
            "Manage and optimize PPC campaigns on Google Ads and Meta Ads",
            "Own SEO/SEM strategy, content optimization, and link building",
            "Lead email marketing campaigns and automated nurture workflows",
            "Analyze performance data and report on KPIs to leadership",
            "Lead and mentor the digital marketing team",
          ],
          requirements: [
            "Bachelor's in Marketing, Communications, or related field",
            "4+ years of digital marketing experience",
            "Proficiency in Google Analytics, Google Ads, and Meta Ads Manager",
            "Experience with marketing automation (HubSpot or Marketo)",
            "Strong analytical and A/B testing capabilities",
          ],
          skills: ["Google Ads", "Meta Ads", "SEO", "HubSpot", "Google Analytics", "Email Marketing", "A/B Testing"],
        },
        "Content Strategist": {
          summary: "We are looking for a Content Strategist to develop compelling narratives that build brand authority, drive organic traffic, and generate qualified leads.",
          responsibilities: [
            "Develop and own the editorial content strategy and calendar",
            "Write and edit long-form content: blogs, whitepapers, case studies, and ebooks",
            "Collaborate with SEO to ensure content is optimized for organic discovery",
            "Partner with design and video teams to create multimedia content assets",
            "Measure content performance and iterate based on engagement and conversion data",
            "Maintain and evolve brand voice and messaging guidelines",
          ],
          requirements: [
            "Bachelor's in English, Journalism, Communications, or Marketing",
            "3+ years of content strategy or content marketing experience",
            "Excellent writing, editing, and storytelling skills",
            "SEO knowledge and experience with keyword research tools (Ahrefs, SEMrush)",
            "Experience with CMS platforms (WordPress, Contentful, or Webflow)",
          ],
          skills: ["Content Strategy", "SEO", "Copywriting", "WordPress", "Ahrefs", "Editorial Calendar"],
        },
        "SEO/SEM Specialist": {
          summary: "We are seeking an SEO/SEM Specialist to drive organic and paid search performance, improve search rankings, and deliver measurable traffic and conversion growth.",
          responsibilities: [
            "Develop and execute SEO strategy: on-page, off-page, and technical SEO",
            "Conduct keyword research, competitive analysis, and content gap assessments",
            "Manage Google Ads campaigns including search, display, and shopping",
            "Optimize landing pages and conversion funnels for paid traffic",
            "Monitor and report on keyword rankings, organic traffic, and PPC ROI",
            "Collaborate with content and development teams on technical SEO implementations",
          ],
          requirements: [
            "Bachelor's in Marketing, IT, or related field",
            "3+ years of SEO and SEM experience",
            "Expert proficiency in Google Search Console, Google Ads, and SEO tools (Ahrefs, Moz)",
            "Strong understanding of technical SEO: schema, Core Web Vitals, crawlability",
            "Google Ads certification preferred",
          ],
          skills: ["SEO", "Google Ads", "SEM", "Ahrefs", "Google Analytics", "Technical SEO", "PPC"],
        },
        "Growth Hacker": {
          summary: "We are hiring a Growth Hacker to experiment relentlessly across the funnel, identify scalable growth levers, and drive rapid user acquisition and retention.",
          responsibilities: [
            "Design, execute, and analyze rapid growth experiments across acquisition and retention",
            "Identify and exploit growth opportunities in product, marketing, and partnerships",
            "Build and optimize growth funnels using quantitative and qualitative data",
            "Launch viral and referral programs, community growth, and product-led growth initiatives",
            "Collaborate with engineering to implement growth features and in-product experiments",
            "Report on north star metrics, activation rates, and cohort retention",
          ],
          requirements: [
            "Bachelor's in Marketing, Data Science, or related field",
            "3+ years of growth marketing or product growth experience",
            "Strong analytical skills and proficiency in SQL and Python for data analysis",
            "Experience with growth tooling: Mixpanel, Amplitude, Segment",
            "Creative, hypothesis-driven, and comfortable with high-velocity experimentation",
          ],
          skills: ["Growth Hacking", "A/B Testing", "SQL", "Amplitude", "Mixpanel", "Product-Led Growth"],
        },
        "Social Media Manager": {
          summary: "We are seeking a Social Media Manager to build and grow our brand presence across social platforms, engage our community, and drive measurable business outcomes.",
          responsibilities: [
            "Develop and execute social media strategy across LinkedIn, Instagram, Twitter/X, Facebook, and TikTok",
            "Create, curate, and schedule compelling social content aligned with brand voice",
            "Manage community engagement: respond to comments, DMs, and mentions",
            "Run paid social campaigns and boost organic top-performing content",
            "Track and report on social KPIs: reach, engagement, follower growth, and conversions",
            "Identify trending topics and cultural moments to drive brand relevance",
          ],
          requirements: [
            "Bachelor's in Marketing, Communications, or related field",
            "2+ years of social media management experience for a brand or agency",
            "Proficiency in social management tools (Hootsuite, Sprout Social, Buffer)",
            "Strong visual storytelling skills and basic graphic design ability (Canva, Adobe)",
            "Data-driven approach to content optimization and reporting",
          ],
          skills: ["Social Media", "Content Creation", "Hootsuite", "Canva", "Analytics", "Community Management"],
        },
        "Brand Manager": {
          summary: "We are looking for a Brand Manager to develop, protect, and grow our brand identity across all touchpoints, ensuring a consistent and powerful brand experience.",
          responsibilities: [
            "Define and steward the brand strategy, visual identity, and messaging architecture",
            "Manage brand guidelines and ensure consistency across all channels and teams",
            "Lead integrated brand campaigns from creative brief to execution",
            "Commission and analyze brand health research and competitive benchmarking",
            "Partner with agency partners and creative vendors on brand activations",
            "Track brand KPIs: awareness, share of voice, sentiment, and NPS",
          ],
          requirements: [
            "Bachelor's in Marketing, Business, or Communications",
            "4+ years of brand management experience",
            "Strong creative sensibility with strategic and analytical rigor",
            "Experience managing brand agencies and external creative production",
            "Excellent project management and cross-functional stakeholder skills",
          ],
          skills: ["Brand Strategy", "Marketing", "Creative Direction", "Agency Management", "Analytics"],
        },
        "Performance Marketer": {
          summary: "We are hiring a Performance Marketer to own and scale our paid acquisition channels, optimizing for conversions, CAC, and ROAS across digital platforms.",
          responsibilities: [
            "Plan, launch, and optimize paid campaigns across Google Ads, Meta, LinkedIn, and TikTok",
            "Manage multi-million-dollar media budgets and bid strategies",
            "Develop and test creative briefs, ad copy, and landing pages",
            "Analyze campaign data and deliver actionable optimization recommendations",
            "Build performance reporting dashboards and attribution models",
            "Stay current with platform changes, betas, and performance marketing trends",
          ],
          requirements: [
            "Bachelor's in Marketing, Business, or related field",
            "3+ years of performance marketing or paid media experience",
            "Expert knowledge of Google Ads, Meta Ads Manager, and LinkedIn Campaign Manager",
            "Strong analytical skills; proficiency in Google Analytics and data studio tools",
            "Experience managing significant ad spend ($500K+ annually)",
          ],
          skills: ["Google Ads", "Meta Ads", "LinkedIn Ads", "ROAS", "Attribution", "Media Buying", "Analytics"],
        },
      },
    },

    /* ── HIGHER MANAGEMENT ─────────────────────────── */
    "Higher Management": {
      roles: [
        "Chief Executive Officer (CEO)",
        "Chief Operating Officer (COO)",
        "Chief Technology Officer (CTO)",
        "Chief Financial Officer (CFO)",
        "Managing Director",
        "Executive Assistant",
      ],
      baseTemplates: {
        "Chief Executive Officer (CEO)": {
          summary: "We are seeking a visionary and operationally excellent CEO to lead our company through its next stage of growth, inspiring teams, delighting customers, and delivering exceptional value to shareholders.",
          responsibilities: [
            "Define and communicate the company vision, mission, and long-term strategy",
            "Lead the executive leadership team and set organizational culture",
            "Own P&L responsibility and drive financial performance",
            "Build and maintain relationships with investors, board members, and key stakeholders",
            "Lead strategic partnerships, M&A, and market expansion initiatives",
            "Represent the company publicly as primary spokesperson and brand ambassador",
          ],
          requirements: [
            "MBA or advanced degree preferred; Bachelor's required",
            "10+ years of executive leadership experience including P&L ownership",
            "Demonstrated success in scaling organizations in a high-growth environment",
            "Exceptional strategic thinking, communication, and stakeholder management",
            "Strong financial acumen and experience with fundraising or capital markets",
          ],
          skills: ["Executive Leadership", "Strategy", "P&L Management", "Fundraising", "Stakeholder Management"],
        },
        "Chief Operating Officer (COO)": {
          summary: "We are hiring a COO to translate the company's strategic vision into operational excellence, ensuring all departments execute with efficiency, accountability, and discipline.",
          responsibilities: [
            "Oversee all operational functions across Engineering, Marketing, Sales, and HR",
            "Drive organizational efficiency, process improvement, and cross-functional alignment",
            "Develop and monitor OKRs, KPIs, and operational dashboards",
            "Manage the annual operating plan and budget in partnership with the CFO",
            "Lead hiring, organizational design, and workforce planning",
            "Serve as acting CEO when needed and represent the company with key stakeholders",
          ],
          requirements: [
            "Bachelor's or MBA in Business Administration or related field",
            "10+ years of operational leadership experience",
            "Proven ability to scale operations in a high-growth environment",
            "Strong financial literacy and experience with budgeting and forecasting",
            "Excellent leadership, analytical, and cross-functional collaboration skills",
          ],
          skills: ["Operations", "OKRs", "Budget Management", "Process Improvement", "Leadership", "Strategy"],
        },
        "Chief Technology Officer (CTO)": {
          summary: "We are seeking a CTO to own our technology vision, lead our engineering organization, and build the technical foundation that powers our products at scale.",
          responsibilities: [
            "Define and own the company's technology strategy, architecture, and roadmap",
            "Lead and grow the engineering, DevOps, and AI/data teams",
            "Partner with the CEO and CPO to align technology priorities with business goals",
            "Drive engineering culture: quality, velocity, and continuous innovation",
            "Evaluate and adopt emerging technologies that provide competitive advantage",
            "Represent technology strategy to investors, board, and external partners",
          ],
          requirements: [
            "Bachelor's or Master's in Computer Science or Engineering",
            "12+ years of engineering experience with 5+ years as a senior technical leader",
            "Proven track record of building and shipping products at scale",
            "Strong expertise in cloud infrastructure, AI/ML, and modern software architectures",
            "Excellent leadership, communication, and business acumen",
          ],
          skills: ["Technology Strategy", "Engineering Leadership", "Cloud", "AI", "System Architecture", "CTO"],
        },
        "Chief Financial Officer (CFO)": {
          summary: "We are hiring a CFO to lead financial strategy, ensure fiscal discipline, and guide the company through funding rounds, financial planning, and sustainable growth.",
          responsibilities: [
            "Own financial planning, budgeting, forecasting, and reporting",
            "Lead all accounting operations including close, audit, and tax compliance",
            "Partner with the CEO on fundraising, investor relations, and M&A activities",
            "Build and maintain robust financial controls and governance frameworks",
            "Present financial performance and strategic plans to the board",
            "Lead a team of finance and accounting professionals",
          ],
          requirements: [
            "CPA and/or MBA required",
            "10+ years of finance leadership experience",
            "Experience with venture-backed startups or publicly traded companies preferred",
            "Deep expertise in financial modeling, fundraising, and corporate finance",
            "Excellent analytical skills and executive communication abilities",
          ],
          skills: ["Financial Planning", "CPA", "Fundraising", "Financial Modeling", "Accounting", "Leadership"],
        },
        "Managing Director": {
          summary: "We are seeking a Managing Director to lead a business unit or regional operation, drive revenue and profitability, and develop the talent and culture needed for long-term success.",
          responsibilities: [
            "Lead all business operations for an assigned region, vertical, or business unit",
            "Own P&L and deliver revenue and profitability targets",
            "Build and develop high-performing teams across functions",
            "Develop and execute local or vertical go-to-market strategies",
            "Build strategic relationships with key clients, partners, and stakeholders",
            "Report on business performance to the CEO and board",
          ],
          requirements: [
            "Bachelor's or MBA in Business, Finance, or related field",
            "10+ years of leadership experience including P&L ownership",
            "Strong business development, operational, and financial capabilities",
            "Excellent leadership, communication, and stakeholder management",
          ],
          skills: ["P&L Management", "Business Development", "Operations", "Leadership", "Strategy"],
        },
        "Executive Assistant": {
          summary: "We are hiring an experienced and highly organized Executive Assistant to provide comprehensive support to our C-level executives, enabling them to operate at maximum effectiveness.",
          responsibilities: [
            "Manage complex executive calendars, scheduling, and meeting prioritization",
            "Coordinate domestic and international travel logistics end-to-end",
            "Prepare briefing documents, board materials, and executive presentations",
            "Draft and manage communications on behalf of executives",
            "Coordinate and organize board meetings, leadership offsites, and company events",
            "Handle sensitive and confidential information with the utmost discretion",
          ],
          requirements: [
            "Bachelor's degree preferred",
            "4+ years of executive assistant or chief of staff experience",
            "Expert proficiency in Microsoft Office 365 and Google Workspace",
            "Outstanding organizational, multitasking, and time management skills",
            "Exceptional written and verbal communication with a professional presence",
          ],
          skills: ["Executive Support", "Microsoft Office", "Google Workspace", "Calendar Management", "Communication"],
        },
      },
    },

    /* ── OPERATIONS ─────────────────────────────────── */
    "Operations": {
      roles: [
        "Operations Manager",
        "Supply Chain Manager",
        "Logistics Coordinator",
        "Procurement Specialist",
        "Office Manager",
        "Facilities Manager",
      ],
      baseTemplates: {
        "Operations Manager": {
          summary: "We are looking for a results-driven Operations Manager to oversee daily business functions, optimize processes, and ensure our teams deliver with efficiency and excellence.",
          responsibilities: [
            "Oversee daily operations across departments and ensure operational efficiency",
            "Develop, implement, and continuously improve operational policies and procedures",
            "Monitor KPIs and prepare performance reports for senior leadership",
            "Manage operational budgets and optimize resource allocation",
            "Lead, mentor, and develop a high-performing operations team",
            "Identify bottlenecks and drive sustainable process improvements",
          ],
          requirements: [
            "Bachelor's in Business Administration, Operations, or related field",
            "5+ years of operations management experience",
            "Strong analytical and problem-solving abilities",
            "Proficiency in ERP systems and project management tools",
            "PMP or Six Sigma certification preferred",
          ],
          skills: ["Operations", "ERP", "Process Improvement", "KPIs", "Lean", "Six Sigma", "Leadership"],
        },
        "Supply Chain Manager": {
          summary: "We are seeking a Supply Chain Manager to oversee end-to-end supply chain operations, build resilient supplier relationships, and drive cost efficiency across procurement and logistics.",
          responsibilities: [
            "Manage end-to-end supply chain from procurement through delivery",
            "Develop and maintain relationships with key suppliers and logistics partners",
            "Optimize inventory levels, lead times, and supply chain costs",
            "Lead demand forecasting and S&OP processes",
            "Identify supply chain risks and implement mitigation strategies",
            "Drive digital transformation of supply chain processes",
          ],
          requirements: [
            "Bachelor's in Supply Chain, Logistics, or Business",
            "5+ years of supply chain management experience",
            "Proficiency in ERP systems (SAP, Oracle) and supply chain software",
            "APICS CPIM or CSCP certification preferred",
            "Strong analytical and negotiation skills",
          ],
          skills: ["Supply Chain", "SAP", "Procurement", "Logistics", "Forecasting", "APICS", "ERP"],
        },
        "Logistics Coordinator": {
          summary: "We are hiring a Logistics Coordinator to manage shipments, coordinate with carriers and suppliers, and ensure the smooth and cost-effective flow of goods.",
          responsibilities: [
            "Coordinate inbound and outbound shipments and track delivery performance",
            "Liaise with freight forwarders, carriers, and customs brokers",
            "Prepare shipping documentation, invoices, and compliance reports",
            "Maintain accurate inventory and procurement records",
            "Resolve logistics issues proactively and escalate critical delays",
            "Optimize routes and carrier selection to reduce costs",
          ],
          requirements: [
            "Bachelor's in Supply Chain, Logistics, or Business",
            "2+ years of logistics coordination experience",
            "Familiarity with logistics software and TMS platforms",
            "Knowledge of import/export regulations and Incoterms",
            "Strong organizational and multitasking skills",
          ],
          skills: ["Logistics", "TMS", "Customs", "Supply Chain", "SAP", "Excel", "Import/Export"],
        },
        "Procurement Specialist": {
          summary: "We are looking for a Procurement Specialist to manage supplier relationships, negotiate contracts, and ensure cost-effective and timely procurement of goods and services.",
          responsibilities: [
            "Source, evaluate, and onboard suppliers aligned with company standards",
            "Negotiate pricing, terms, and SLAs with vendors and suppliers",
            "Process purchase orders and manage the procurement workflow",
            "Monitor supplier performance and conduct regular business reviews",
            "Maintain procurement documentation and ensure compliance",
            "Identify cost savings opportunities and support budget planning",
          ],
          requirements: [
            "Bachelor's in Business, Supply Chain, or Finance",
            "3+ years of procurement or purchasing experience",
            "Strong negotiation and supplier management skills",
            "Proficiency in procurement software (Coupa, Ariba, or SAP SRM)",
            "CIPS certification is a plus",
          ],
          skills: ["Procurement", "Negotiation", "SAP", "Ariba", "Supplier Management", "Contract Management"],
        },
        "Office Manager": {
          summary: "We are seeking a resourceful Office Manager to run daily office operations, create a great workplace environment, and ensure everything runs smoothly for our team.",
          responsibilities: [
            "Manage day-to-day office operations including facilities, vendors, and supplies",
            "Coordinate company events, team meetings, and offsites",
            "Oversee office budget, expense tracking, and vendor contracts",
            "Manage onboarding logistics for new hires from a facilities perspective",
            "Liaise with building management, IT, and HR on workplace matters",
            "Foster a positive, organized, and productive office culture",
          ],
          requirements: [
            "Bachelor's in Business Administration or related field",
            "3+ years of office management experience",
            "Excellent organizational and problem-solving skills",
            "Strong proficiency in Microsoft Office and project management tools",
            "Warm, service-oriented personality with a proactive mindset",
          ],
          skills: ["Office Management", "Facilities", "Vendor Management", "Event Planning", "Microsoft Office"],
        },
        "Facilities Manager": {
          summary: "We are hiring a Facilities Manager to oversee all aspects of our physical workplace, ensuring a safe, compliant, and productive environment for all employees.",
          responsibilities: [
            "Manage all facility operations including maintenance, utilities, and security",
            "Oversee space planning, workspace design, and renovation projects",
            "Ensure compliance with health & safety regulations and building codes",
            "Manage vendor contracts for cleaning, security, HVAC, and maintenance",
            "Develop and manage the facilities budget",
            "Respond to and resolve facility-related incidents and emergencies",
          ],
          requirements: [
            "Bachelor's in Facilities Management, Engineering, or Business",
            "5+ years of facilities management experience",
            "IFMA or BIFM certification preferred",
            "Strong knowledge of building systems, H&S regulations, and property management",
            "Excellent vendor management and problem-solving skills",
          ],
          skills: ["Facilities Management", "IFMA", "Health & Safety", "Vendor Management", "Space Planning"],
        },
      },
    },

    /* ── PRODUCT MANAGEMENT ─────────────────────────── */
    "Product Management": {
      roles: [
        "Head of Product",
        "Senior Product Manager",
        "Product Owner",
        "Technical Product Manager",
        "Associate Product Manager",
      ],
      baseTemplates: {
        "Head of Product": {
          summary: "We are seeking a Head of Product to define the product vision, lead our product team, and drive the strategy that turns customer insights into category-defining products.",
          responsibilities: [
            "Define and own the overall product vision, strategy, and multi-year roadmap",
            "Lead and develop a team of Product Managers, Designers, and Researchers",
            "Partner with Engineering, Marketing, Sales, and the CEO on product-market fit",
            "Drive a customer-centric product culture grounded in data and qualitative research",
            "Own product metrics: activation, retention, NPS, and revenue impact",
            "Communicate product strategy and roadmap to the board and investors",
          ],
          requirements: [
            "Bachelor's in Computer Science, Business, or related field",
            "8+ years of product management with 3+ in leadership",
            "Proven track record of shipping successful products at scale",
            "Strong quantitative and qualitative product intuition",
            "Exceptional communication and leadership skills",
          ],
          skills: ["Product Strategy", "Roadmap", "Leadership", "User Research", "Agile", "Analytics", "OKRs"],
        },
        "Senior Product Manager": {
          summary: "We are hiring a Senior Product Manager to own a major product area, lead cross-functional teams, and deliver high-impact features that drive growth and customer satisfaction.",
          responsibilities: [
            "Own the product roadmap for a significant product area or platform feature set",
            "Define product requirements through customer research, data analysis, and stakeholder input",
            "Work closely with Engineering and Design to deliver product increments",
            "Define success metrics and track feature performance post-launch",
            "Conduct competitive analysis and monitor market trends",
            "Mentor junior Product Managers and contribute to PM team culture",
          ],
          requirements: [
            "Bachelor's in Computer Science, Business, or related field",
            "5+ years of product management in a technology environment",
            "Strong analytical and data-driven decision-making approach",
            "Experience with Agile methodologies and cross-functional collaboration",
            "Excellent written and verbal communication skills",
          ],
          skills: ["Product Management", "Roadmapping", "Agile", "User Stories", "Data Analysis", "Jira", "Figma"],
        },
        "Product Owner": {
          summary: "We are looking for a Product Owner to bridge product strategy and engineering execution, managing the backlog, writing crisp user stories, and ensuring the team delivers maximum value every sprint.",
          responsibilities: [
            "Own and maintain the product backlog: creation, prioritization, and grooming",
            "Write detailed user stories, acceptance criteria, and functional specifications",
            "Facilitate sprint planning, reviews, and retrospectives",
            "Act as the primary point of contact between the engineering team and stakeholders",
            "Accept or reject completed work based on agreed acceptance criteria",
            "Track sprint velocity and coordinate release planning",
          ],
          requirements: [
            "Bachelor's in Computer Science, Business, or related field",
            "3+ years of product ownership or business analysis experience",
            "Certified Scrum Product Owner (CSPO) preferred",
            "Experience with Agile and Scrum frameworks in software development teams",
            "Strong communication and stakeholder management skills",
          ],
          skills: ["Scrum", "CSPO", "Jira", "Backlog Management", "User Stories", "Agile", "Sprint Planning"],
        },
        "Technical Product Manager": {
          summary: "We are seeking a Technical Product Manager who combines strong product instincts with technical depth to lead the development of complex platform features, APIs, and developer-facing products.",
          responsibilities: [
            "Define product strategy for technical and platform products (APIs, SDKs, data pipelines)",
            "Translate complex technical requirements into clear product specifications",
            "Work closely with engineering teams to design scalable technical solutions",
            "Manage the developer experience roadmap and API documentation standards",
            "Conduct technical discovery with engineering and architecture teams",
            "Evaluate build vs. buy decisions and technology trade-offs",
          ],
          requirements: [
            "Bachelor's in Computer Science or Engineering",
            "4+ years of technical product management or engineering background",
            "Ability to read code and understand system architectures",
            "Strong experience with APIs, platform products, and developer tooling",
            "Proficiency in Agile, system design discussions, and technical documentation",
          ],
          skills: ["Technical PM", "API Products", "System Design", "Agile", "Engineering", "Jira", "Roadmap"],
        },
        "Associate Product Manager": {
          summary: "We are hiring an Associate Product Manager who is eager to learn, highly analytical, and passionate about building products that solve real customer problems.",
          responsibilities: [
            "Support Senior PMs in defining requirements, writing user stories, and conducting research",
            "Assist with product backlog maintenance and sprint planning activities",
            "Conduct competitive analysis and synthesize customer feedback",
            "Analyze product metrics and prepare weekly performance reports",
            "Facilitate user interviews and usability testing sessions",
            "Learn the full product management lifecycle through hands-on work",
          ],
          requirements: [
            "Bachelor's in Computer Science, Business, or related field",
            "0–2 years of product management, business analysis, or consulting experience",
            "Strong analytical thinking and attention to detail",
            "Proficiency in Excel, Jira, and presentation tools",
            "Exceptional written and verbal communication skills",
          ],
          skills: ["Product Management", "Jira", "Data Analysis", "User Research", "Agile", "Excel"],
        },
      },
    },

    /* ── DESIGN & CREATIVE ──────────────────────────── */
    "Design & Creative": {
      roles: [
        "Creative Director",
        "UI/UX Designer",
        "Product Designer",
        "Graphic Designer",
        "Motion Graphics Artist",
        "UX Researcher",
      ],
      baseTemplates: {
        "Creative Director": {
          summary: "We are seeking a Creative Director to lead our creative vision, inspire a team of designers and content creators, and ensure every brand expression is exceptional.",
          responsibilities: [
            "Define and own the overall creative vision and brand aesthetic",
            "Lead and inspire a team of designers, copywriters, and creative professionals",
            "Oversee the creative quality of all brand and marketing materials",
            "Partner with Marketing, Product, and leadership on campaign and brand strategy",
            "Manage external creative agencies and production partners",
            "Balance creative ambition with brand consistency and business goals",
          ],
          requirements: [
            "Bachelor's in Design, Fine Arts, or Communications",
            "8+ years of design experience with 3+ in creative leadership",
            "Outstanding portfolio demonstrating diverse creative direction",
            "Expert proficiency in Adobe Creative Suite and Figma",
            "Strong brand development and creative strategy experience",
          ],
          skills: ["Creative Direction", "Adobe Creative Suite", "Figma", "Brand Design", "Leadership", "Typography"],
        },
        "UI/UX Designer": {
          summary: "We are looking for a UI/UX Designer to craft intuitive, accessible, and visually stunning experiences for our web and mobile products.",
          responsibilities: [
            "Conduct user research, interviews, and usability testing to inform design decisions",
            "Create wireframes, user flows, prototypes, and high-fidelity mockups in Figma",
            "Define and maintain the design system and UI component library",
            "Collaborate with Product Managers and Engineers throughout the product lifecycle",
            "Iterate on designs based on user feedback and analytics",
            "Champion accessibility (WCAG 2.1) and inclusive design principles",
          ],
          requirements: [
            "Bachelor's in Design, HCI, or related field",
            "3+ years of UI/UX design experience for digital products",
            "Expert proficiency in Figma or Sketch",
            "Strong portfolio showcasing the end-to-end design process",
            "Understanding of responsive design, accessibility standards, and design systems",
          ],
          skills: ["Figma", "UI Design", "UX Research", "Design Systems", "Prototyping", "Accessibility", "Sketch"],
        },
        "Product Designer": {
          summary: "We are hiring a Product Designer who can own the complete user experience of a product area, from initial research and problem framing through polished production design.",
          responsibilities: [
            "Own the design of one or more product areas end-to-end",
            "Conduct generative and evaluative research to deeply understand user needs",
            "Design interaction flows, wireframes, and high-fidelity interfaces",
            "Collaborate with PMs and engineers in an agile product squad",
            "Contribute to and evolve our shared design system",
            "Advocate for users in all product and business decisions",
          ],
          requirements: [
            "Bachelor's in Design, HCI, or equivalent",
            "3+ years of product design experience at a software company",
            "Strong Figma skills and an excellent portfolio",
            "Experience with qualitative research methods and usability testing",
            "Ability to work closely with engineers and understand technical constraints",
          ],
          skills: ["Product Design", "Figma", "User Research", "Interaction Design", "Design Systems", "Prototyping"],
        },
        "Graphic Designer": {
          summary: "We are seeking a talented Graphic Designer to produce high-quality visual assets that elevate our brand across digital and print channels.",
          responsibilities: [
            "Create visual assets for digital marketing, social media, and advertising",
            "Design branded materials: presentations, reports, event assets, and merchandise",
            "Collaborate with the marketing and content teams on campaign visuals",
            "Ensure all design work adheres to brand guidelines and visual standards",
            "Manage multiple projects simultaneously and deliver against tight deadlines",
          ],
          requirements: [
            "Bachelor's in Graphic Design, Visual Communication, or Fine Arts",
            "2+ years of graphic design experience",
            "Expert proficiency in Adobe Illustrator, Photoshop, and InDesign",
            "Strong understanding of typography, color theory, and layout principles",
            "Portfolio demonstrating a range of design styles and applications",
          ],
          skills: ["Adobe Illustrator", "Photoshop", "InDesign", "Typography", "Canva", "Brand Design"],
        },
        "Motion Graphics Artist": {
          summary: "We are hiring a Motion Graphics Artist to create compelling animated content for our product, marketing, and brand channels that brings our story to life.",
          responsibilities: [
            "Design and produce motion graphics, animated explainers, and video content",
            "Create animations for social media, digital ads, and product onboarding",
            "Collaborate with the Creative Director and marketing team on video concepts",
            "Ensure all motion work aligns with brand guidelines",
            "Manage video production timelines and deliverables",
          ],
          requirements: [
            "Bachelor's in Animation, Design, or Media Production",
            "2+ years of motion graphics design experience",
            "Expert proficiency in After Effects, Premiere Pro, and Lottie/Rive",
            "Strong design foundation: typography, color, and composition",
            "Portfolio demonstrating varied motion design styles",
          ],
          skills: ["After Effects", "Premiere Pro", "Cinema 4D", "Lottie", "Motion Design", "Animation"],
        },
        "UX Researcher": {
          summary: "We are looking for a UX Researcher to conduct rigorous qualitative and quantitative research that generates deep user insights and informs our product strategy.",
          responsibilities: [
            "Plan and conduct user research: interviews, surveys, diary studies, and usability tests",
            "Synthesize findings into clear, actionable insights and recommendations",
            "Build and maintain a user insights repository",
            "Partner with PMs and Designers to embed research throughout the product lifecycle",
            "Develop research roadmaps aligned with product priorities",
            "Evangelize a user-centered design culture across the organization",
          ],
          requirements: [
            "Bachelor's or Master's in Psychology, HCI, or Cognitive Science",
            "3+ years of UX research experience in a product environment",
            "Proficiency in qualitative and quantitative research methodologies",
            "Experience with research tools: UserTesting, Dovetail, Maze, Optimal Workshop",
            "Excellent synthesis, storytelling, and presentation skills",
          ],
          skills: ["UX Research", "Usability Testing", "Surveys", "Dovetail", "UserTesting", "Research Synthesis"],
        },
      },
    },

    /* ── HR & RECRUITMENT ───────────────────────────── */
    "HR & Recruitment": {
      roles: [
        "HR Director",
        "Talent Acquisition Specialist",
        "HR Generalist",
        "People Operations Manager",
        "Payroll & Benefits Specialist",
      ],
      baseTemplates: {
        "HR Director": {
          summary: "We are hiring an HR Director to lead our People function, develop talent strategies, and build a high-performance culture that attracts, retains, and grows exceptional people.",
          responsibilities: [
            "Own the People strategy aligned with business objectives",
            "Lead talent acquisition, performance management, and succession planning",
            "Drive HR operations including compliance, HRIS, and HR analytics",
            "Build and manage compensation, benefits, and total rewards programs",
            "Champion DEI, employee engagement, and organizational culture initiatives",
            "Advise executive leadership on people strategy and workforce planning",
          ],
          requirements: [
            "Bachelor's or Master's in HR, Business, or Organizational Psychology",
            "8+ years of HR experience with 3+ in senior HR leadership",
            "Deep knowledge of employment law, HR best practices, and compliance",
            "SHRM-SCP or CIPD Level 7 certification preferred",
            "Strong executive presence and stakeholder management skills",
          ],
          skills: ["HR Strategy", "Talent Management", "SHRM", "HRIS", "DEI", "Compensation", "Leadership"],
        },
        "Talent Acquisition Specialist": {
          summary: "We are looking for a Talent Acquisition Specialist to drive full-cycle recruiting for technical and non-technical roles, delivering an exceptional candidate experience.",
          responsibilities: [
            "Manage end-to-end recruitment for engineering, product, marketing, and operations roles",
            "Source passive candidates through LinkedIn, job boards, and creative outreach strategies",
            "Conduct competency-based phone and video screening interviews",
            "Coordinate interview panels and provide structured candidate evaluation support",
            "Extend offers, negotiate compensation, and ensure a smooth onboarding handoff",
            "Build talent pipelines for critical future roles",
          ],
          requirements: [
            "Bachelor's in HR, Psychology, or Business",
            "2+ years of full-cycle technical and/or non-technical recruiting experience",
            "Proficiency with ATS platforms (Greenhouse, Lever, or Workable)",
            "Strong sourcing skills and a creative approach to talent attraction",
            "Excellent communication and candidate relationship management skills",
          ],
          skills: ["Recruiting", "Sourcing", "LinkedIn Recruiter", "Greenhouse", "ATS", "Candidate Experience"],
        },
        "HR Generalist": {
          summary: "We are seeking an HR Generalist to support a broad range of HR functions, serve as a trusted advisor to managers and employees, and help keep our People operations running smoothly.",
          responsibilities: [
            "Support day-to-day HR operations: onboarding, offboarding, and employee life cycle events",
            "Administer HRIS and maintain accurate employee records and documentation",
            "Handle employee relations issues with care, confidentiality, and sound judgment",
            "Support performance review cycles, compensation benchmarking, and HR reporting",
            "Assist with policy development, compliance, and HR audits",
            "Partner with Talent Acquisition on scheduling and interview logistics",
          ],
          requirements: [
            "Bachelor's in HR, Business, or Psychology",
            "2+ years of HR generalist or coordinator experience",
            "Strong knowledge of employment law and HR best practices",
            "Proficiency in HRIS platforms (BambooHR, Workday, or SAP SuccessFactors)",
            "SHRM-CP or PHR certification preferred",
          ],
          skills: ["HR Operations", "HRIS", "Employee Relations", "BambooHR", "Compliance", "Onboarding"],
        },
        "People Operations Manager": {
          summary: "We are hiring a People Operations Manager to build and optimize the systems, programs, and experiences that make our workplace exceptional for every employee.",
          responsibilities: [
            "Manage HRIS, HR systems, and people analytics infrastructure",
            "Design and improve employee lifecycle processes from hire to retire",
            "Lead employee engagement programs, surveys, and action planning",
            "Own HR compliance including labor law, policy maintenance, and audits",
            "Partner with Finance on payroll, benefits administration, and workforce reporting",
            "Build scalable people operations processes to support company growth",
          ],
          requirements: [
            "Bachelor's in HR, Business, or Operations",
            "5+ years of HR operations or people ops experience",
            "Expert proficiency in HRIS and people analytics platforms",
            "Strong project management and process improvement skills",
            "Knowledge of employment law and HR compliance requirements",
          ],
          skills: ["People Operations", "HRIS", "HR Analytics", "Process Improvement", "Compliance", "Workday"],
        },
        "Payroll & Benefits Specialist": {
          summary: "We are seeking a Payroll & Benefits Specialist to accurately administer payroll, manage employee benefits programs, and ensure compliance with all relevant labor regulations.",
          responsibilities: [
            "Process accurate and timely monthly and bi-monthly payroll for all employees",
            "Administer employee benefits programs including health insurance and retirement plans",
            "Maintain payroll records and ensure compliance with statutory deductions",
            "Respond to employee payroll and benefits inquiries with accuracy and care",
            "Coordinate with Finance on payroll reconciliation and reporting",
            "Stay current on labor law changes and update payroll processes accordingly",
          ],
          requirements: [
            "Bachelor's in Finance, Accounting, or HR",
            "2+ years of payroll processing experience",
            "Proficiency in payroll software (ADP, Gusto, or SAP HR)",
            "Strong understanding of tax regulations and statutory compliance",
            "High attention to detail and commitment to data accuracy",
          ],
          skills: ["Payroll", "ADP", "Benefits Administration", "Compliance", "Excel", "Tax", "SAP HR"],
        },
      },
    },

    /* ── CUSTOMER SUCCESS & SUPPORT ─────────────────── */
    "Customer Success & Support": {
      roles: [
        "Customer Success Manager (CSM)",
        "Technical Support Engineer",
        "Customer Service Representative",
        "Help Desk Analyst",
      ],
      baseTemplates: {
        "Customer Success Manager (CSM)": {
          summary: "We are hiring a Customer Success Manager to drive value realization, build deep customer relationships, and ensure our clients achieve their goals using our platform.",
          responsibilities: [
            "Own a portfolio of accounts and serve as their trusted strategic advisor",
            "Lead onboarding, training, and adoption programs for new customers",
            "Conduct regular business reviews and monitor customer health metrics",
            "Proactively identify and address churn risks and expansion opportunities",
            "Gather product feedback and advocate for customer needs internally",
            "Collaborate with Sales, Support, and Product on customer lifecycle management",
          ],
          requirements: [
            "Bachelor's in Business, Communications, or related field",
            "3+ years of customer success, account management, or consulting experience",
            "Experience with CS platforms (Gainsight, ChurnZero, or Totango)",
            "Strong empathy, communication, and problem-solving skills",
            "SaaS or technology industry experience strongly preferred",
          ],
          skills: ["Customer Success", "Gainsight", "Account Management", "Onboarding", "NPS", "SaaS", "CRM"],
        },
        "Technical Support Engineer": {
          summary: "We are looking for a Technical Support Engineer to provide expert technical assistance to our customers, diagnose complex product issues, and deliver an exceptional support experience.",
          responsibilities: [
            "Resolve complex technical customer issues via email, chat, and screenshare",
            "Diagnose and troubleshoot software bugs, API issues, and configuration problems",
            "Escalate unresolved issues to engineering with detailed reproduction steps",
            "Contribute to the support knowledge base, FAQs, and troubleshooting guides",
            "Identify patterns in support tickets to surface product improvement opportunities",
            "Maintain high CSAT scores and SLA compliance",
          ],
          requirements: [
            "Bachelor's in Computer Science or IT",
            "2+ years of technical support or customer engineering experience",
            "Strong understanding of REST APIs, web technologies, and cloud platforms",
            "Proficiency with support tools: Zendesk, Intercom, or Freshdesk",
            "Excellent diagnostic thinking and written communication skills",
          ],
          skills: ["Technical Support", "REST API", "Zendesk", "SQL", "Troubleshooting", "Cloud Platforms"],
        },
        "Customer Service Representative": {
          summary: "We are hiring a Customer Service Representative to deliver exceptional frontline support, resolve customer inquiries efficiently, and represent our brand with care and professionalism.",
          responsibilities: [
            "Handle inbound customer inquiries via email, live chat, and phone",
            "Resolve product, billing, and account-related issues in a timely manner",
            "Escalate complex or sensitive issues to senior support or management",
            "Maintain accurate records of all customer interactions in the CRM",
            "Identify recurring issues and feedback trends to improve the product and service",
            "Maintain high CSAT and first-contact resolution rates",
          ],
          requirements: [
            "High school diploma required; Bachelor's preferred",
            "1+ years of customer service experience",
            "Experience with helpdesk tools (Zendesk, Freshdesk, or Intercom)",
            "Excellent written and verbal communication skills in English",
            "Patient, empathetic, and solution-oriented personality",
          ],
          skills: ["Customer Service", "Zendesk", "Communication", "CRM", "Problem Solving", "CSAT"],
        },
        "Help Desk Analyst": {
          summary: "We are seeking a Help Desk Analyst to provide responsive Tier 1/2 technical support to internal employees, ensuring minimal downtime and a great employee technology experience.",
          responsibilities: [
            "Respond to internal helpdesk tickets and resolve IT issues promptly",
            "Support hardware, software, and network troubleshooting for office staff",
            "Set up and provision laptops, mobile devices, and peripherals",
            "Manage user accounts in Active Directory and Office 365",
            "Escalate complex technical issues to the IT infrastructure or systems team",
            "Maintain IT asset inventory and update the helpdesk knowledge base",
          ],
          requirements: [
            "Associate's or Bachelor's in IT or Computer Science",
            "1–2 years of helpdesk or IT support experience",
            "Strong knowledge of Windows and macOS environments",
            "Familiarity with Active Directory, Office 365, and ticketing systems (ServiceNow)",
            "CompTIA A+ or ITIL Foundation preferred",
          ],
          skills: ["Help Desk", "Active Directory", "Office 365", "Windows", "ServiceNow", "CompTIA A+"],
        },
      },
    },

    /* ── FINANCE & LEGAL ─────────────────────────────── */
    "Finance & Legal": {
      roles: [
        "Financial Controller",
        "Corporate Lawyer / Legal Counsel",
        "Accountant",
        "Compliance Officer",
      ],
      baseTemplates: {
        "Financial Controller": {
          summary: "We are looking for an experienced Financial Controller to oversee all accounting operations, ensure financial integrity, and provide strategic financial guidance to the senior leadership team.",
          responsibilities: [
            "Lead all accounting operations: GL, AP, AR, payroll, and treasury",
            "Own month-end, quarter-end, and year-end close processes",
            "Ensure compliance with GAAP, IFRS, and local tax regulations",
            "Manage internal controls and coordinate external audit processes",
            "Present financial results and forecasts to the CFO and board",
            "Lead and develop a team of accounting professionals",
          ],
          requirements: [
            "Bachelor's in Accounting or Finance; MBA or CPA required",
            "8+ years of progressive accounting experience",
            "Strong knowledge of GAAP/IFRS and financial reporting standards",
            "Experience with ERP systems (SAP, Oracle, or NetSuite)",
            "Excellent leadership and executive communication skills",
          ],
          skills: ["Accounting", "CPA", "GAAP", "SAP", "Financial Reporting", "Audit", "Leadership"],
        },
        "Corporate Lawyer / Legal Counsel": {
          summary: "We are hiring a Corporate Lawyer to provide sound legal guidance on commercial matters, contracts, regulatory compliance, and corporate governance.",
          responsibilities: [
            "Draft, review, and negotiate commercial contracts, NDAs, and vendor agreements",
            "Advise business units on legal risks, obligations, and regulatory compliance",
            "Manage corporate governance including board resolutions and statutory filings",
            "Support fundraising, M&A due diligence, and transaction documentation",
            "Liaise with external law firms on complex or specialist legal matters",
            "Ensure compliance with applicable laws across all jurisdictions of operation",
          ],
          requirements: [
            "Juris Doctor (JD) or LLB from an accredited institution",
            "4+ years of corporate law experience (in-house or leading law firm)",
            "Valid bar admission in the relevant jurisdiction",
            "Strong commercial contract drafting and negotiation skills",
            "Experience in technology, startup, or financial services preferred",
          ],
          skills: ["Corporate Law", "Contract Drafting", "Negotiation", "Compliance", "M&A", "Governance"],
        },
        "Accountant": {
          summary: "We are seeking a detail-oriented Accountant to maintain accurate financial records, support the month-end close, and assist with tax compliance and reporting.",
          responsibilities: [
            "Maintain accurate general ledger entries and reconcile accounts monthly",
            "Prepare financial statements and supporting schedules",
            "Process accounts payable and accounts receivable transactions",
            "Assist with tax preparation and ensure statutory compliance",
            "Support internal and external audit requirements",
            "Analyze financial data and identify variance explanations",
          ],
          requirements: [
            "Bachelor's in Accounting, Finance, or Commerce",
            "2+ years of accounting experience",
            "Proficiency in accounting software: QuickBooks, Tally, or SAP",
            "Strong knowledge of accounting principles (GAAP or IFRS)",
            "High accuracy and strong attention to detail",
          ],
          skills: ["Accounting", "QuickBooks", "Tally", "SAP", "GAAP", "Tax", "Reconciliation"],
        },
        "Compliance Officer": {
          summary: "We are looking for a Compliance Officer to develop, implement, and oversee our compliance program, ensuring the company operates within all regulatory and ethical boundaries.",
          responsibilities: [
            "Develop and manage the compliance program including policies and procedures",
            "Monitor regulatory requirements and ensure timely compliance updates",
            "Conduct compliance risk assessments and internal compliance audits",
            "Deliver training programs to ensure employee understanding of compliance obligations",
            "Investigate compliance incidents and manage corrective action plans",
            "Liaise with regulators and manage compliance reporting obligations",
          ],
          requirements: [
            "Bachelor's in Law, Finance, or Business; LLM or advanced degree preferred",
            "4+ years of compliance experience in a regulated industry",
            "Knowledge of relevant regulations (GDPR, AML, SOX, PCI-DSS, FCPA)",
            "CCEP, CAMS, or relevant certification preferred",
            "Strong analytical and communication skills",
          ],
          skills: ["Compliance", "GDPR", "AML", "Risk Assessment", "SOX", "CCEP", "Policy Development"],
        },
      },
    },

  }, // end departments

}; // end JobData

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE ENGINE
   ═══════════════════════════════════════════════════════════════ */

const TemplateEngine = {

  /**
   * Build salary string from state
   */
  buildSalaryString(state) {
    const { salaryMode, salaryMin, salaryMax, currency, payPeriod } = state;
    if (salaryMode === 'negotiable') return 'Negotiable (based on experience and skill level)';
    if (salaryMode === 'competitive') return 'Highly competitive and commensurate with experience';
    if (salaryMode === 'skip') return 'Undisclosed — discussed during the interview process';
    if (salaryMode === 'range' && salaryMin && salaryMax) {
      return `${currency} ${Number(salaryMin).toLocaleString()} – ${Number(salaryMax).toLocaleString()} / ${payPeriod}`;
    }
    if (salaryMode === 'range' && salaryMin) {
      return `From ${currency} ${Number(salaryMin).toLocaleString()} / ${payPeriod}`;
    }
    return 'Competitive (details shared upon application)';
  },

  /**
   * Build leave section string
   */
  buildLeaveSection(state) {
    const parts = [];
    if (state.leave.casual    > 0) parts.push(`Casual Leave: ${state.leave.casual} days/year`);
    if (state.leave.sick      > 0) parts.push(`Sick Leave: ${state.leave.sick} days/year`);
    if (state.leave.earned    > 0) parts.push(`Earned/Paid Leave: ${state.leave.earned} days/year`);
    if (state.leave.maternity > 0) parts.push(`Maternity Leave: ${state.leave.maternity} days`);
    if (state.leave.paternity > 0) parts.push(`Paternity Leave: ${state.leave.paternity} days`);
    if (state.leave.religious > 0) parts.push(`Religious/Festival Leave: ${state.leave.religious} days/year`);
    if (state.leave.unpaid    > 0) parts.push(`Unpaid Leave: ${state.leave.unpaid} days/year (as applicable)`);
    if (state.leave.wfh       > 0) parts.push(`Work From Home: up to ${state.leave.wfh} days/month`);
    return parts;
  },

  /**
   * Build holidays summary string
   */
  buildHolidaySection(state) {
    const parts = [];
    if (state.weeklyOff.length) parts.push(`Weekly Off: ${state.weeklyOff.join(' & ')}`);
    state.holidays.forEach(h => {
      parts.push(`${h.name}: ${h.days} day${h.days > 1 ? 's' : ''}`);
    });
    return parts;
  },

  /**
   * Build the benefits list from company settings
   */
  buildBenefitsList(state) {
    return [...state.benefits];
  },

  /**
   * LINKEDIN FORMAT
   */
  linkedin(tpl, state, company) {
    const sal  = this.buildSalaryString(state);
    const leaves = this.buildLeaveSection(state);
    const holidays = this.buildHolidaySection(state);
    const benefits = this.buildBenefitsList(state);
    const expStr = state.expMin && state.expMax
      ? `${state.expMin}–${state.expMax} years`
      : state.expMin ? `${state.expMin}+ years` : 'Open to all levels';
    const posStr = state.openPositions > 1 ? `${state.openPositions} Positions` : '1 Position';

    const resp = tpl.responsibilities.map(r => `   ${r}`).join('\n');
    const reqs = tpl.requirements.map(r => `  🔹 ${r}`).join('\n');
    const benLines = benefits.length ? benefits.map(b => `   ${b}`).join('\n') : '   Competitive benefits package';
    const leaveLines = leaves.length ? leaves.map(l => `   ${l}`).join('\n') : '';
    const holLines = holidays.length ? holidays.map(h => `   ${h}`).join('\n') : '';

    const skillTags = (tpl.skills || []).map(s => `#${s.replace(/[^a-zA-Z0-9]/g,'')}`).join(' ');
    const deptTag = state.dept.replace(/[^a-zA-Z0-9]/g,'');
    const roleTag = state.role.replace(/[^a-zA-Z0-9]/g,'');

    return ` We're Hiring: ${state.role}
${company.name} | ${state.dept} | ${state.jobType} | ${state.workplace}

 ${company.city}  |   ${company.name}
 Positions Open: ${posStr}  |   Application Deadline: ${new Date(Date.now()+21*864e5).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${tpl.summary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT YOU'LL DO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${resp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT WE'RE LOOKING FOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${reqs}

   Experience: ${expStr}
   Education: ${state.education}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 COMPENSATION & BENEFITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Salary: ${sal}
${benLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 LEAVE POLICY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${leaveLines || '   Comprehensive leave policy discussed during onboarding'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HOLIDAYS & SCHEDULE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${holLines || '   National holidays and company holidays observed'}
   Work Days: ${state.workDays} days/week

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HOW TO APPLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Apply: ${company.website}
 Email: ${company.email}
 DM us directly on LinkedIn with your CV

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 About ${company.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${company.about}

#Hiring #NowHiring #JobAlert #${deptTag} #${roleTag} ${skillTags} #${company.name.replace(/\s/g,'')} #Jobs #Career`;
  },

  /**
   * FACEBOOK FORMAT
   */
  facebook(tpl, state, company) {
    const sal = this.buildSalaryString(state);
    const leaves = this.buildLeaveSection(state);
    const holidays = this.buildHolidaySection(state);
    const benefits = this.buildBenefitsList(state);
    const expStr = state.expMin && state.expMax ? `${state.expMin}–${state.expMax} years` : state.expMin ? `${state.expMin}+ years` : 'Open';
    const posStr = state.openPositions > 1 ? `${state.openPositions} Positions` : '1 Position';

    const resp = tpl.responsibilities.map(r => `   ${r}`).join('\n');
    const reqs = tpl.requirements.map(r => `   ${r}`).join('\n');
    const benLines = benefits.length ? benefits.map(b => `   ${b}`).join('\n') : '   Competitive package';
    const leaveLines = leaves.length ? leaves.map(l => `   ${l}`).join('\n') : '';
    const holLines = holidays.length ? holidays.map(h => `   ${h}`).join('\n') : '';

    return ` JOB OPPORTUNITY — ${state.role.toUpperCase()}
${company.name} | ${state.dept}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 Location : ${company.city}
 Company  : ${company.name}
 Type     : ${state.jobType} | ${state.workplace}
 Openings : ${posStr}
 Salary   : ${sal}
 Deadline : ${new Date(Date.now()+21*864e5).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 THE OPPORTUNITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${tpl.summary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 RESPONSIBILITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${resp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${reqs}
  • Experience: ${expStr}
  • Education: ${state.education}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BENEFITS & PERKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${benLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 LEAVE & HOLIDAYS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${leaveLines || '   Comprehensive leave policy'}
${holLines || '   National and company holidays observed'}
   Work: ${state.workDays} days/week

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HOW TO APPLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ${company.website}
 ${company.email}

 ${company.about}

 LIKE & SHARE — tag someone who'd be perfect for this role! 
 Send your CV directly via Message to apply.`;
  },

  /**
   * FULL JD FORMAT
   */
  fullJD(tpl, state, company) {
    const sal = this.buildSalaryString(state);
    const leaves = this.buildLeaveSection(state);
    const holidays = this.buildHolidaySection(state);
    const benefits = this.buildBenefitsList(state);
    const expStr = state.expMin && state.expMax ? `${state.expMin}–${state.expMax} years` : state.expMin ? `${state.expMin}+ years` : 'Open to all levels';
    const posStr = state.openPositions > 1 ? `${state.openPositions} Positions` : '1 Position';
    const today = new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
    const deadline = new Date(Date.now()+21*864e5).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
    const sep = '═'.repeat(66);
    const sub = '─'.repeat(66);

    const resp = tpl.responsibilities.map(r => `  • ${r}`).join('\n');
    const reqs = tpl.requirements.map(r => `  • ${r}`).join('\n');
    const benLines = benefits.length ? benefits.map(b => `  • ${b}`).join('\n') : '  • Competitive package — details discussed at interview';
    const leaveLines = leaves.length ? leaves.map(l => `  • ${l}`).join('\n') : '  • Comprehensive leave policy';
    const holLines = holidays.length ? holidays.map(h => `  • ${h}`).join('\n') : '  • National holidays and company-declared holidays';
    const skillsStr = (tpl.skills || []).join(', ');

    return `${sep}
JOB DESCRIPTION
${company.name.toUpperCase()}
${sep}

POSITION          : ${state.role}
DEPARTMENT        : ${state.dept}
EMPLOYMENT TYPE   : ${state.jobType}
WORKPLACE         : ${state.workplace}
LOCATION          : ${company.city}
OPENINGS          : ${posStr}
REPORTING TO      : Department Head / Team Lead
DATE POSTED       : ${today}
APPLICATION DEADLINE : ${deadline}

${sub}
ABOUT THE COMPANY
${sub}
${company.name}${company.industry ? ` (${company.industry})` : ''}
${company.website}

${company.about}

Company Size: ${company.size || 'Growing team'}

${sub}
ROLE OVERVIEW
${sub}
${tpl.summary}

${sub}
KEY RESPONSIBILITIES
${sub}
${resp}

${sub}
MANDATORY REQUIREMENTS
${sub}
${reqs}

MINIMUM EXPERIENCE : ${expStr}
EDUCATION          : ${state.education}
CORE SKILLS        : ${skillsStr || 'See requirements above'}

${sub}
COMPENSATION & BENEFITS
${sub}
SALARY / COMPENSATION:
  ${sal}

EMPLOYEE BENEFITS:
${benLines}

${sub}
LEAVE POLICY
${sub}
${leaveLines}

${sub}
HOLIDAYS & WORKING SCHEDULE
${sub}
${holLines}
  • Working Days per Week: ${state.workDays}

${sub}
WHY ${company.name.toUpperCase()}?
${sub}
${company.about}

We believe great products are built by people who care deeply about quality, ethics, and ownership. We operate with high trust, accountability, and respect. Join a team where your work matters.

${sub}
HOW TO APPLY
${sub}
Send your CV and cover letter to:
   Email   : ${company.email}
   Website  : ${company.website}

Please mention the position title in the subject line of your email.

Only shortlisted candidates will be contacted.

${sep}
${company.name} is an Equal Opportunity Employer.
We celebrate diversity and are committed to creating an inclusive environment.
${sep}`;
  },

  /**
   * BDJOBS-STYLE FORMAT
   */
  bdjobs(tpl, state, company) {
    const sal = this.buildSalaryString(state);
    const leaves = this.buildLeaveSection(state);
    const holidays = this.buildHolidaySection(state);
    const benefits = this.buildBenefitsList(state);
    const expStr = state.expMin ? `At least ${state.expMin} year(s)` : 'Freshers may apply';
    const deadline = new Date(Date.now()+21*864e5).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
    const skillsStr = (tpl.skills || []).join(', ');

    const resp = tpl.responsibilities.map(r => `* ${r}`).join('\n');
    const reqs = tpl.requirements.map(r => `* ${r}`).join('\n');
    const benLines = benefits.length ? benefits.map(b => `* ${b}`).join('\n') : '* As per company policy';
    const leaveLines = leaves.length ? leaves.map(l => `* ${l}`).join('\n') : '* As per company policy';
    const holLines = holidays.length ? holidays.map(h => `* ${h}`).join('\n') : '* National and company-declared holidays';

    return `About the job

Company: ${company.name}
Job Location: ${company.city}

Job Description / Responsibility
${tpl.summary}

Major Responsibilities
${resp}

Educational Requirements
* ${state.education}
* Skills Required: ${skillsStr || 'Refer to requirements section'}

Experience Requirements
* ${expStr}
* The applicants should have experience in the following area(s): ${state.dept}
* Freshers with exceptional skills are encouraged to apply

Additional Requirements
${reqs}

Workplace
* ${state.workplace}

Job Location
${company.city}

Salary
* ${sal}

Compensation & Other Benefits
${benLines}

Leave Policy
${leaveLines}

Holidays & Schedule
${holLines}
* Work Days Per Week: ${state.workDays}

Application Deadline: ${deadline}

Company Information
${company.name}
Web: ${company.website}

About the Company
${company.about}

${company.name} is an equal opportunity employer. We thank all applicants for their interest, however only those selected for interviews will be contacted.

Desired Skills and Experience
${skillsStr}`;
  },

};

/* ═══════════════════════════════════════════════════════════════
   AI SERVICE  (OpenAI wrapper)
   ═══════════════════════════════════════════════════════════════ */

const AIService = {

  async enhance({ apiKey, dept, role, tone, context, baseTemplate, state, company }) {
    if (!apiKey) throw new Error('OpenAI API key is required');

    const sal  = TemplateEngine.buildSalaryString(state);
    const leaves = TemplateEngine.buildLeaveSection(state);
    const holidays = TemplateEngine.buildHolidaySection(state);
    const benefits = TemplateEngine.buildBenefitsList(state);

    const systemPrompt = `You are a senior HR professional and expert technical recruiter at a top technology company. 
You write compelling, realistic, and highly professional job postings that attract top-tier talent.
Your tone is: ${tone}.
You write in clear, engaging prose. You are specific about technologies, frameworks, and skills.
You do NOT use filler phrases. Every line adds value.
Respond ONLY with valid JSON — no markdown code blocks, no extra text.`;

    const userPrompt = `Generate a REALISTIC and DETAILED job posting for the following:

Company: ${company.name}
City: ${company.city}
About Company: ${company.about}
Department: ${dept}
Position: ${role}
Job Type: ${state.jobType}
Workplace: ${state.workplace}
Experience Required: ${state.expMin ? state.expMin+'+' : '0'}–${state.expMax || 'open'} years
Education: ${state.education}
Open Positions: ${state.openPositions}
Salary: ${sal}
Work Days: ${state.workDays}/week
Benefits: ${benefits.join(', ')}
Leave Policy: ${leaves.join('; ')}
Holidays: ${holidays.join('; ')}
Additional Context from HR: ${context || 'None'}

Base template to IMPROVE upon (make more realistic, specific, and compelling):
Summary: ${baseTemplate.summary}
Responsibilities: ${JSON.stringify(baseTemplate.responsibilities)}
Requirements: ${JSON.stringify(baseTemplate.requirements)}
Skills: ${JSON.stringify(baseTemplate.skills || [])}

Return a JSON object with exactly these fields:
{
  "summary": "2–3 sentence compelling company + role overview",
  "responsibilities": ["7–10 specific, realistic bullet points"],
  "requirements": ["6–9 specific requirements with years, tools, certifications"],
  "skills": ["10–15 specific skills/technologies/tools"],
  "whyJoin": ["3–5 compelling reasons to join this specific company"]
}

Be SPECIFIC to the role and company. Include real tools, frameworks, and technologies.
Use concrete numbers where appropriate. Make it sound like a real job at a real company.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    // Also support OpenAI
    if (!response.ok) {
      // Try OpenAI as fallback
      const oaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 2000,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!oaiResp.ok) {
        const err = await oaiResp.json();
        throw new Error(err.error?.message || `API error ${oaiResp.status}`);
      }

      const oaiData = await oaiResp.json();
      const text = oaiData.choices[0].message.content;
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    }

    const data = await response.json();
    const text = data.content.find(c => c.type === 'text')?.text || '';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  },

};

/* ═══════════════════════════════════════════════════════════════
   UI HELPERS
   ═══════════════════════════════════════════════════════════════ */

const UIHelpers = {
  showSpinner(msg = 'Processing…') {
    document.getElementById('spinnerMsg').textContent = msg;
    document.getElementById('spinnerOverlay').classList.add('visible');
  },
  hideSpinner() {
    document.getElementById('spinnerOverlay').classList.remove('visible');
  },
  toast(msg, type = 'info') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = `toast ${type} show`;
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3500);
  },
  setApiStatus(state) {
    const dot  = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    dot.className = `status-dot ${state}`;
    const labels = { ready: 'AI Ready', loading: 'Generating…', error: 'API Error' };
    text.textContent = labels[state] || 'AI Ready';
  },
};

/* ═══════════════════════════════════════════════════════════════
   MAIN APP CONTROLLER
   ═══════════════════════════════════════════════════════════════ */

class HRForgeApp {

  constructor(options = {}) {
    this.options = options;
    this.state = {
      dept: '',
      role: '',
      jobType: 'Full-Time',
      workplace: 'On-site',
      salaryMode: 'range',
      salaryMin: '',
      salaryMax: '',
      currency: 'BDT',
      payPeriod: 'Monthly',
      expMin: '',
      expMax: '',
      education: "Bachelor's degree",
      openPositions: 1,
      outputFormat: 'linkedin',
      aiTone: 'professional',
      workDays: '5',
      benefits: ['Health Insurance', 'Annual Bonus', 'Performance Bonus', 'Festival Bonus', 'Office Meals/Snacks', 'Training Budget', 'Yearly Increment'],
      leave: {
        casual: 10, sick: 14, earned: 18,
        maternity: 112, paternity: 7,
        unpaid: 0, religious: 3, wfh: 0,
      },
      weeklyOff: [],
      holidays: [],
    };
    this.generatedOutputs = { linkedin: '', facebook: '', jd: '', bdjobs: '' };
    this.currentTemplate = null;
  }

  init() {
    this._populateDepartments();
    this._bindNav();
    this._bindCompose();
    this._bindSettings();
    this._bindLeaves();
    this._bindHolidays();
    this._bindPreview();
    this._bindGenerate();
    this._updateStats();
    UIHelpers.setApiStatus('ready');
  }

  /* ── NAVIGATION ── */
  _bindNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const tab = item.dataset.tab;
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');
        const titles = {
          compose:  ['Compose Job Posting', 'Select a role, configure details, and generate a platform-ready posting'],
          settings: ['Company Setup', 'Configure your company information and benefits'],
          leaves:   ['Leave Policy', 'Set annual leave entitlements for your employees'],
          holidays: ['Holidays & Work Schedule', 'Define weekly off days and public holidays'],
          preview:  ['Preview & Export', 'Review, edit, and copy your generated job posting'],
        };
        const [title, sub] = titles[tab] || ['', ''];
        document.getElementById('pageTitle').textContent = title;
        document.getElementById('pageSub').textContent = sub;
      });
    });
  }

  /* ── DEPARTMENT / ROLE ── */
  _populateDepartments() {
    const sel = document.getElementById('deptSelect');
    Object.keys(JobData.departments).sort().forEach(dept => {
      const opt = document.createElement('option');
      opt.value = dept;
      opt.textContent = dept;
      sel.appendChild(opt);
    });
  }

  _populateRoles(dept) {
    const sel = document.getElementById('roleSelect');
    sel.innerHTML = '<option value="">— Select Role —</option>';
    sel.disabled = !dept;
    if (!dept) return;
    const roles = JobData.departments[dept]?.roles || [];
    roles.forEach(role => {
      const opt = document.createElement('option');
      opt.value = role;
      opt.textContent = role;
      sel.appendChild(opt);
    });
  }

  /* ── COMPOSE TAB BINDINGS ── */
  _bindCompose() {
    // Department
    document.getElementById('deptSelect').addEventListener('change', e => {
      this.state.dept = e.target.value;
      this._populateRoles(e.target.value);
      this.state.role = '';
      document.getElementById('roleSelect').value = '';
      this.currentTemplate = null;
      this._updateStats();
    });

    // Role
    document.getElementById('roleSelect').addEventListener('change', e => {
      this.state.role = e.target.value;
      this.currentTemplate = this._getBaseTemplate();
      this._updateStats();
    });

    // Job Type toggles
    this._bindToggleGroup('jobTypeGroup', val => {
      this.state.jobType = val;
      this._updateStats();
    });

    // Workplace toggles
    this._bindToggleGroup('workplaceGroup', val => { this.state.workplace = val; });

    // Salary mode
    this._bindToggleGroup('salaryModeGroup', val => {
      this.state.salaryMode = val;
      const rangeFields = document.getElementById('salaryRangeFields');
      const altMsg = document.getElementById('salaryAltMessage');
      if (val === 'range') {
        rangeFields.style.display = '';
        altMsg.style.display = 'none';
      } else {
        rangeFields.style.display = 'none';
        altMsg.style.display = '';
        const msgs = {
          negotiable: ' Salary is Negotiable — details will be discussed based on experience and skill level.',
          competitive: ' Competitive Compensation — we offer a highly competitive package commensurate with your experience.',
          skip: ' Salary Undisclosed — compensation details will be shared during the interview process.',
        };
        altMsg.textContent = msgs[val] || '';
      }
      this._updateStats();
    });

    // Salary fields
    ['salaryMin','salaryMax'].forEach(id => {
      document.getElementById(id).addEventListener('input', e => {
        this.state[id === 'salaryMin' ? 'salaryMin' : 'salaryMax'] = e.target.value;
        this._updateStats();
      });
    });

    // Currency
    document.getElementById('currencySelect').addEventListener('change', e => {
      this.state.currency = e.target.value;
      document.getElementById('currencyPrefix').textContent  = e.target.value;
      document.getElementById('currencyPrefix2').textContent = e.target.value;
    });

    // Pay period
    document.getElementById('payPeriod').addEventListener('change', e => {
      this.state.payPeriod = e.target.value;
    });

    // Experience
    document.getElementById('expMin').addEventListener('input', e => { this.state.expMin = e.target.value; });
    document.getElementById('expMax').addEventListener('input', e => { this.state.expMax = e.target.value; });

    // Education
    document.getElementById('educationSelect').addEventListener('change', e => { this.state.education = e.target.value; });

    // Open positions
    document.getElementById('openPositions').addEventListener('input', e => {
      this.state.openPositions = parseInt(e.target.value) || 1;
    });

    // Output format
    this._bindToggleGroup('formatGroup', val => {
      this.state.outputFormat = val;
      const statFormat = document.getElementById('statFormat');
      if (statFormat) statFormat.textContent = {
        linkedin: 'LinkedIn', facebook: 'Facebook', jd: 'Full JD', bdjobs: 'BDJobs',
      }[val];
    });

    // AI Tone
    this._bindToggleGroup('toneGroup', val => { this.state.aiTone = val; });

    // Key toggle
    document.getElementById('keyToggle').addEventListener('click', () => {
      const inp = document.getElementById('openaiKey');
      inp.type = inp.type === 'password' ? 'text' : 'password';
    });
  }

  /* ── SETTINGS TAB ── */
  _bindSettings() {
    ['companyName','companyWebsite','companyCity','companyEmail','companyAbout','companyIndustry'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {});
    });

    this._bindToggleGroup('workDaysGroup', val => { this.state.workDays = val; });

    // Benefits checkboxes
    document.getElementById('benefitsGrid').addEventListener('change', () => {
      this.state.benefits = [...document.querySelectorAll('#benefitsGrid input:checked')].map(cb => cb.value);
      this._updateStats();
    });
  }

  /* ── LEAVE TAB ── */
  _bindLeaves() {
    const keys = ['casualLeave','sickLeave','earnedLeave','maternityLeave','paternityLeave','unpaidLeave','religiousLeave','wfhDays'];
    const stateMap = { casualLeave:'casual', sickLeave:'sick', earnedLeave:'earned', maternityLeave:'maternity', paternityLeave:'paternity', unpaidLeave:'unpaid', religiousLeave:'religious', wfhDays:'wfh' };

    keys.forEach(id => {
      document.getElementById(id).addEventListener('input', e => {
        this.state.leave[stateMap[id]] = parseInt(e.target.value) || 0;
        this._updateLeaveSummary();
        this._updateStats();
      });
    });

    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const inp = document.getElementById(targetId);
        let val = parseInt(inp.value) || 0;
        if (btn.dataset.action === 'inc') val++;
        else val = Math.max(0, val - 1);
        inp.value = val;
        this.state.leave[stateMap[targetId]] = val;
        this._updateLeaveSummary();
        this._updateStats();
      });
    });
  }

  _updateLeaveSummary() {
    const l = this.state.leave;
    const total = l.casual + l.sick + l.earned + l.religious + l.unpaid;
    document.getElementById('totalLeaveCount').textContent = total;
    this._updateStats();
  }

  /* ── HOLIDAYS TAB ── */
  _bindHolidays() {
    // Weekday picker
    document.querySelectorAll('#weekdayPicker .day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
        const day = btn.dataset.day;
        if (btn.classList.contains('selected')) {
          if (!this.state.weeklyOff.includes(day)) this.state.weeklyOff.push(day);
        } else {
          this.state.weeklyOff = this.state.weeklyOff.filter(d => d !== day);
        }
        document.getElementById('weekdayHint').textContent =
          this.state.weeklyOff.length ? `Selected: ${this.state.weeklyOff.join(', ')}` : 'Selected: none';
        this._updateStats();
      });
    });

    // Add holiday
    document.getElementById('addHolidayBtn').addEventListener('click', () => {
      const name = document.getElementById('holidayName').value.trim();
      const days = parseInt(document.getElementById('holidayDays').value) || 1;
      if (!name) { UIHelpers.toast('Please enter a holiday name', 'error'); return; }
      this._addHoliday(name, days);
      document.getElementById('holidayName').value = '';
      document.getElementById('holidayDays').value = '1';
    });

    // Enter key for holiday
    document.getElementById('holidayName').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('addHolidayBtn').click();
    });

    // Preset holidays
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const days = parseInt(btn.dataset.days) || 1;
        if (this.state.holidays.find(h => h.name === name)) {
          UIHelpers.toast(`${name} already added`, 'error'); return;
        }
        this._addHoliday(name, days);
      });
    });
  }

  _addHoliday(name, days) {
    this.state.holidays.push({ name, days });
    this._renderHolidayList();
    this._updateStats();
  }

  _renderHolidayList() {
    const list = document.getElementById('holidayList');
    list.innerHTML = '';
    this.state.holidays.forEach((h, i) => {
      const tag = document.createElement('div');
      tag.className = 'holiday-tag';
      tag.innerHTML = `<span>🎉 ${h.name}</span><span class="holiday-tag-days">${h.days} day${h.days>1?'s':''}</span><button class="holiday-remove" data-index="${i}" aria-label="Remove">×</button>`;
      list.appendChild(tag);
    });
    list.querySelectorAll('.holiday-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.holidays.splice(parseInt(btn.dataset.index), 1);
        this._renderHolidayList();
        this._updateStats();
      });
    });
  }

  /* ── PREVIEW TAB ── */
  _bindPreview() {
    document.querySelectorAll('.ptab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const platform = tab.dataset.platform;
        this._showPreviewOutput(platform);
      });
    });

    document.getElementById('copyBtn').addEventListener('click', () => {
      const text = document.getElementById('previewOutput').value;
      if (!text) { UIHelpers.toast('Nothing to copy — generate a posting first', 'error'); return; }
      navigator.clipboard.writeText(text).then(() => {
        UIHelpers.toast(' Copied to clipboard!', 'success');
      }).catch(() => {
        document.getElementById('previewOutput').select();
        document.execCommand('copy');
        UIHelpers.toast(' Copied!', 'success');
      });
    });

    document.getElementById('downloadBtn').addEventListener('click', () => {
      const text = document.getElementById('previewOutput').value;
      if (!text) { UIHelpers.toast('Generate a posting first', 'error'); return; }
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.state.role || 'job-posting'}_${this.state.outputFormat}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      UIHelpers.toast(' Downloaded!', 'success');
    });
  }

  _showPreviewOutput(platform) {
    const output = this.generatedOutputs[platform] || '';
    const empty = document.getElementById('previewEmpty');
    const textarea = document.getElementById('previewOutput');
    if (output) {
      empty.style.display = 'none';
      textarea.style.display = 'block';
      textarea.value = output;
    } else {
      empty.style.display = 'flex';
      textarea.style.display = 'none';
    }
  }

  /* ── GENERATE BUTTON ── */
  _bindGenerate() {
    document.getElementById('generateBtn').addEventListener('click', () => this._generate());
    document.getElementById('enhanceBtn').addEventListener('click', () => this._generateWithAI());
  }

  _getBaseTemplate() {
    const dept = this.state.dept;
    const role = this.state.role;
    if (!dept || !role) return null;
    const deptData = JobData.departments[dept];
    if (!deptData) return null;
    const raw = deptData.baseTemplates?.[role];
    if (!raw) return null;

    // Strip hardcoded year/experience numbers from JS templates.
    // The real experience value comes from the HR form (state.expMin/expMax).
    const expRe = /\b\d+\+?\s*(?:[-\u2013]|to)?\s*\d*\+?\s*years?\s*(?:of\s+)?/gi;
    const stripExp = bullets => bullets
      .map(b => b.replace(expRe, '').trim().replace(/^[,\s]+|[,\s]+$/g, '').trim())
      .filter(b => b.length > 10);

    return {
      ...raw,
      requirements:     stripExp(raw.requirements    || []),
      responsibilities: stripExp(raw.responsibilities || []),
    };
  }

  _getCompanyInfo() {
    return {
      name:    document.getElementById('companyName').value    || 'Your Company',
      website: document.getElementById('companyWebsite').value || 'www.yourcompany.com',
      city:    document.getElementById('companyCity').value    || 'Dhaka, Bangladesh',
      email:   document.getElementById('companyEmail').value   || 'careers@yourcompany.com',
      about:   document.getElementById('companyAbout').value   || 'We are a leading technology company committed to innovation and excellence.',
      industry:document.getElementById('companyIndustry').value || '',
      size:    document.getElementById('companySize').value    || '',
    };
  }

  _generate(overrideTpl = null) {
    if (!this.state.dept || !this.state.role) {
      UIHelpers.toast('Please select a department and role first', 'error');
      return;
    }

    const tpl = overrideTpl || this.currentTemplate || this._getBaseTemplate();
    if (!tpl) {
      UIHelpers.toast('No template found for this role', 'error');
      return;
    }

    const company = this._getCompanyInfo();

    // Generate all 4 formats
    this.generatedOutputs.linkedin = TemplateEngine.linkedin(tpl, this.state, company);
    this.generatedOutputs.facebook = TemplateEngine.facebook(tpl, this.state, company);
    this.generatedOutputs.jd       = TemplateEngine.fullJD(tpl, this.state, company);
    this.generatedOutputs.bdjobs   = TemplateEngine.bdjobs(tpl, this.state, company);

    // Switch to preview tab
    document.querySelector('[data-tab="preview"]').click();

    // Show the selected platform output
    const activePtab = document.querySelector('.ptab.active')?.dataset.platform || this.state.outputFormat;
    this._showPreviewOutput(activePtab);

    UIHelpers.toast(` Posting generated for ${this.state.role}`, 'success');
  }

  async _generateWithAI() {
    if (!this.state.dept || !this.state.role) {
      UIHelpers.toast('Please select a department and role first', 'error');
      return;
    }

    const apiKey = document.getElementById('openaiKey').value.trim();
    if (!apiKey) {
      UIHelpers.toast('Please enter your API key in the AI Enhancement section', 'error');
      return;
    }

    const baseTpl = this.currentTemplate || this._getBaseTemplate();
    if (!baseTpl) {
      UIHelpers.toast('No base template found for this role', 'error');
      return;
    }

    const company = this._getCompanyInfo();
    const context = document.getElementById('additionalContext').value;

    UIHelpers.showSpinner('Generating with AI — this may take a few seconds…');
    UIHelpers.setApiStatus('loading');

    try {
      const aiResult = await AIService.enhance({
        apiKey,
        dept: this.state.dept,
        role: this.state.role,
        tone: this.state.aiTone,
        context,
        baseTemplate: baseTpl,
        state: this.state,
        company,
      });

      const enhancedTpl = {
        summary:         aiResult.summary         || baseTpl.summary,
        responsibilities: aiResult.responsibilities || baseTpl.responsibilities,
        requirements:    aiResult.requirements    || baseTpl.requirements,
        skills:          aiResult.skills          || baseTpl.skills,
        whyJoin:         aiResult.whyJoin          || [],
      };

      this.currentTemplate = enhancedTpl;
      UIHelpers.setApiStatus('ready');
      UIHelpers.hideSpinner();

      this._generate(enhancedTpl);
      UIHelpers.toast(' AI-enhanced posting generated!', 'success');

    } catch (err) {
      UIHelpers.hideSpinner();
      UIHelpers.setApiStatus('error');
      console.error('AI enhancement error:', err);
      UIHelpers.toast(`AI Error: ${err.message}`, 'error');
    }
  }

  /* ── HELPERS ── */
  _bindToggleGroup(groupId, callback) {
    document.getElementById(groupId)?.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        callback(btn.dataset.val);
      });
    });
  }

  _updateStats() {
    const l = this.state.leave;
    const totalLeave = l.casual + l.sick + l.earned + l.religious + l.unpaid;
    const totalHolidays = this.state.holidays.reduce((s, h) => s + h.days, 0) + this.state.weeklyOff.length;

    const statDept = document.getElementById('statDept');
    const statRole = document.getElementById('statRole');
    const statSalary = document.getElementById('statSalary');
    const statLeaves = document.getElementById('statLeaves');
    const statHolidays = document.getElementById('statHolidays');
    const totalLeaveCount = document.getElementById('totalLeaveCount');

    if (statDept) statDept.textContent = this.state.dept || '—';
    if (statRole) statRole.textContent = this.state.role || '—';
    if (statSalary) {
      statSalary.textContent = this.state.salaryMode === 'range'
        ? (this.state.salaryMin ? `${this.state.currency} ${Number(this.state.salaryMin).toLocaleString()}+` : '—')
        : this.state.salaryMode.charAt(0).toUpperCase() + this.state.salaryMode.slice(1);
    }
    if (statLeaves) statLeaves.textContent = totalLeave > 0 ? `${totalLeave}` : '—';
    if (statHolidays) statHolidays.textContent = totalHolidays > 0 ? `${totalHolidays}` : '—';
    if (totalLeaveCount) totalLeaveCount.textContent = totalLeave;
  }

}

/* ═══════════════════════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════════════════════ */

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.HRForge = new HRForgeApp();
  window.HRForge.init();
});

// Export for module systems / integration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HRForgeApp, JobData, TemplateEngine, AIService, UIHelpers };
}

/* ═══════════════════════════════════════════════════════════════
   BACKEND API CLIENT
   Talks to app.py (Flask server) instead of calling APIs directly.
   API keys stay on the server — never in the browser.
   ═══════════════════════════════════════════════════════════════ */

const BackendAPI = {

  BASE: "",   // Empty = same origin (http://localhost:5000)

  async _fetch(path, options = {}) {
    const resp = await fetch(this.BASE + path, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
    return data;
  },

  /** Check which integrations are configured on the server */
  async health() {
    return this._fetch("/api/health");
  },

  /** Generate AI-enhanced posting via server (keeps API key safe) */
  async generateWithAI(payload) {
    return this._fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** Save posting to server's local store */
  async savePosting(payload) {
    return this._fetch("/api/postings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** Post to LinkedIn via server */
  async postToLinkedIn(payload) {
    return this._fetch("/api/post/linkedin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** Post to Facebook via server */
  async postToFacebook(payload) {
    return this._fetch("/api/post/facebook", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** Post to both platforms at once */
  async postToAll(payload) {
    return this._fetch("/api/post/all", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** Load saved company settings */
  async getSettings() {
    return this._fetch("/api/settings");
  },

  /** Save company settings */
  async saveSettings(payload) {
    return this._fetch("/api/settings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

/* ═══════════════════════════════════════════════════════════════
   EXTEND HRForgeApp WITH BACKEND + SOCIAL POSTING
   ═══════════════════════════════════════════════════════════════ */

// Check backend health on load and update UI
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const health = await BackendAPI.health();
    const { integrations } = health;

    // Update AI status dot based on server config
    if (integrations.openai) {
      UIHelpers.setApiStatus("ready");
      document.getElementById("statusText").textContent = "AI + Social Ready";
    }

    // Show/hide social post buttons based on what's configured
    _injectSocialButtons(integrations);

    // Load saved company settings from server
    const settings = await BackendAPI.getSettings();
    if (settings.data && Object.keys(settings.data).length > 0) {
      _applyServerSettings(settings.data);
    }
  } catch (err) {
    // Backend not running — fallback to direct browser mode
    console.warn("Backend not detected, running in browser-only mode:", err.message);
    UIHelpers.setApiStatus("ready");
  }
});

/** Inject LinkedIn + Facebook post buttons into the Preview toolbar */
function _injectSocialButtons(integrations) {
  const toolbar = document.querySelector(".toolbar-right");
  if (!toolbar) return;

  const savedPostingId = { current: null };

  // Save button
  const saveBtn = document.createElement("button");
  saveBtn.className = "btn-tool";
  saveBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 2h9l2 2v9a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.4"/><path d="M4 2v4h7V2M5 9h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Save`;
  saveBtn.addEventListener("click", async () => {
    const app = window.HRForge;
    if (!app.generatedOutputs.linkedin) {
      UIHelpers.toast("Generate a posting first", "error"); return;
    }
    try {
      const result = await BackendAPI.savePosting({
        department: app.state.dept,
        role:       app.state.role,
        company:    app._getCompanyInfo(),
        state:      app.state,
        outputs:    app.generatedOutputs,
      });
      savedPostingId.current = result.id;
      UIHelpers.toast(" Posting saved!", "success");
    } catch (err) {
      UIHelpers.toast(`Save failed: ${err.message}`, "error");
    }
  });
  toolbar.insertBefore(saveBtn, toolbar.firstChild);

  // LinkedIn button
  if (integrations && integrations.linkedin) {
    const liBtn = document.createElement("button");
    liBtn.className = "btn-tool";
    liBtn.style.cssText = "background:#0a66c2;color:#fff;border-color:#0a66c2";
    liBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> Post to LinkedIn`;
    liBtn.addEventListener("click", async () => {
      const text = document.getElementById("previewOutput").value;
      if (!text) { UIHelpers.toast("Generate a posting first", "error"); return; }
      UIHelpers.showSpinner("Posting to LinkedIn…");
      try {
        const result = await BackendAPI.postToLinkedIn({
          text:       text,
          posting_id: savedPostingId.current,
        });
        UIHelpers.hideSpinner();
        UIHelpers.toast(` Posted to LinkedIn!`, "success");
        if (result.url) window.open(result.url, "_blank");
      } catch (err) {
        UIHelpers.hideSpinner();
        UIHelpers.toast(`LinkedIn error: ${err.message}`, "error");
      }
    });
    toolbar.appendChild(liBtn);
  }

  // Facebook button
  if (integrations && integrations.facebook) {
    const fbBtn = document.createElement("button");
    fbBtn.className = "btn-tool";
    fbBtn.style.cssText = "background:#1877f2;color:#fff;border-color:#1877f2";
    fbBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Post to Facebook`;
    fbBtn.addEventListener("click", async () => {
      const activePtab = document.querySelector(".ptab.active")?.dataset.platform;
      const app = window.HRForge;
      const text = app.generatedOutputs.facebook || document.getElementById("previewOutput").value;
      if (!text) { UIHelpers.toast("Generate a posting first", "error"); return; }
      UIHelpers.showSpinner("Posting to Facebook…");
      try {
        const result = await BackendAPI.postToFacebook({
          text:       text,
          posting_id: savedPostingId.current,
        });
        UIHelpers.hideSpinner();
        UIHelpers.toast(` Posted to Facebook!`, "success");
        if (result.url) window.open(result.url, "_blank");
      } catch (err) {
        UIHelpers.hideSpinner();
        UIHelpers.toast(`Facebook error: ${err.message}`, "error");
      }
    });
    toolbar.appendChild(fbBtn);
  }
}

/** Apply server-saved company settings to the form */
function _applyServerSettings(settings) {
  const map = {
    companyName: settings.name, companyWebsite: settings.website,
    companyCity: settings.city, companyEmail: settings.email,
    companyAbout: settings.about, companyIndustry: settings.industry,
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  });
}

// Auto-save company settings when user leaves settings tab
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", async () => {
    if (document.getElementById("tab-settings")?.classList.contains("active")) {
      try {
        await BackendAPI.saveSettings({
          name:     document.getElementById("companyName")?.value,
          website:  document.getElementById("companyWebsite")?.value,
          city:     document.getElementById("companyCity")?.value,
          email:    document.getElementById("companyEmail")?.value,
          about:    document.getElementById("companyAbout")?.value,
          industry: document.getElementById("companyIndustry")?.value,
        });
      } catch { /* silent fail if backend not running */ }
    }
  });
});

// Override _generateWithAI to use backend when available
const _originalGenerateWithAI = HRForgeApp.prototype._generateWithAI;
HRForgeApp.prototype._generateWithAI = async function() {
  if (!this.state.dept || !this.state.role) {
    UIHelpers.toast("Please select a department and role first", "error"); return;
  }

  const baseTpl = this.currentTemplate || this._getBaseTemplate();
  if (!baseTpl) { UIHelpers.toast("No base template found", "error"); return; }

  const company = this._getCompanyInfo();
  const context = document.getElementById("additionalContext").value;

  UIHelpers.showSpinner("Generating with AI…");
  UIHelpers.setApiStatus("loading");

  try {
    // Try backend first (keeps API key safe)
    const result = await BackendAPI.generateWithAI({
      department:   this.state.dept,
      role:         this.state.role,
      tone:         this.state.aiTone,
      context:      context,
      company:      company,
      state:        this.state,
      baseTemplate: baseTpl,
    });

    const enhancedTpl = {
      summary:          result.data.summary         || baseTpl.summary,
      responsibilities: result.data.responsibilities || baseTpl.responsibilities,
      requirements:     result.data.requirements    || baseTpl.requirements,
      skills:           result.data.skills          || baseTpl.skills,
      whyJoin:          result.data.whyJoin         || [],
    };

    this.currentTemplate = enhancedTpl;
    UIHelpers.setApiStatus("ready");
    UIHelpers.hideSpinner();
    this._generate(enhancedTpl);
    UIHelpers.toast(" AI-enhanced posting generated!", "success");

  } catch (backendErr) {
    // Backend unavailable — fall back to direct browser call
    console.warn("Backend AI failed, falling back to browser mode:", backendErr.message);
    UIHelpers.hideSpinner();
    await _originalGenerateWithAI.call(this);
  }
};