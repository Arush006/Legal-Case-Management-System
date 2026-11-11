import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BookOpen, BriefcaseBusiness,
  CalendarDays, Check, CheckCircle2, CircleHelp, Clock3, FileText,
  Filter, Gavel, Globe2, LayoutDashboard, LogOut, Menu, Plus, Search, ShieldCheck,
  Sparkles, Trash2, Users, X,
} from "lucide-react";

const copy = {
  en: {
    dashboard: "Overview", cases: "My cases",
    research: "Legal research", hearings: "Hearings & tasks", reports: "Reports",
    search: "Search cases, clients…", notifications: "Notifications",
    welcome: "Good to see you", welcomeSub: "Here’s what’s happening with your practice today.",
    today: "TODAY", newCase: "New case", totalCases: "Total cases", activeCases: "Active cases",
    closedCases: "Closed cases", openTasks: "Open tasks", vsLastMonth: "vs. last month",
    recentCases: "Recent cases", viewAll: "View all", upcoming: "Coming up",
    noCases: "Your case list is ready", noCasesSub: "Add your first matter to start organizing your practice.",
    createFirst: "Create your first case", noTasks: "Nothing scheduled yet",
    noTasksSub: "Add a reminder or hearing date to stay on top of deadlines.",
    noTasksShort: "No upcoming reminders", noTasksLong: "Add a task or hearing date to keep track of deadlines.",
    addTask: "Add a task", priority: "Your next steps", allCaughtUp: "You’re all caught up",
    caseList: "Case list", casesSub: "Keep matters, clients, and next dates in one place.",
    searchCases: "Search by case, client, or court…", allStatuses: "All matters",
    active: "Active", pending: "Pending", closed: "Closed", client: "Client",
    matter: "Matter", court: "Court", nextDate: "Next date", status: "Status",
    openCase: "Open case", delete: "Delete", cancel: "Cancel", saveCase: "Save case",
    addNewCase: "Add a new matter", caseName: "Case / matter name", clientName: "Client name",
    caseNumber: "Case number", courtName: "Court / tribunal", category: "Category",
    description: "Brief description", nextHearingDate: "Next hearing date", required: "Required",
    caseCreated: "Case added to your workspace.", caseDeleted: "Case deleted.",
    statusUpdated: "Case status updated.",
    taskCreated: "Reminder added.", taskUpdated: "Task updated.",
    titleRequired: "Please fill in the required fields.", saveTask: "Save reminder",
    addReminder: "Add a reminder", taskTitle: "What needs to be done?",
    dueDate: "Due date", linkedCase: "Link to a case (optional)", noLinkedCase: "No linked case",
    current: "Current", researchTitle: "Find potentially relevant law",
    researchSub: "Describe the issue in your own words. Your text stays on this device and is compared with a small, curated legal reference library.",
    issuePlaceholder: "For example: Someone took my phone without permission and is now threatening me…",
    findSections: "Find relevant sections", searching: "Checking references…",
    suggestions: "Try a sample question", sample1: "Someone took my belongings",
    sample2: "I was threatened over a phone call", sample3: "A relative is demanding dowry",
    matches: "Potentially relevant references", noMatches: "No close matches in the starter library.",
    noMatchesSub: "That doesn’t mean no law applies. Ask a lawyer to research the complete facts.",
    section: "Section", under: "under", source: "Official source", matched: "Matched terms",
    researchDisclaimer: "This tool provides preliminary, keyword-based research — not legal advice. References are illustrative and not exhaustive. Laws may change. Always confirm the current text on India Code and consult a qualified Indian lawyer.",
    privateNote: "For your privacy, case descriptions are processed locally and are not sent to an AI service.",
    hearingsTitle: "Hearings & tasks", hearingsSub: "A simple view of upcoming dates and the work behind each matter.",
    upcomingHearings: "Upcoming reminders", overdue: "Due today or earlier", completed: "Completed",
    markDone: "Mark complete", markOpen: "Reopen", noTasksYet: "No reminders yet",
    reportTitle: "Practice snapshot", reportSub: "A quick overview of matters in your workspace.",
    mattersByStatus: "Matters by status", total: "Total", categoryBreakdown: "Matter categories",
    detail: "Matter details", created: "Added", analyzeThis: "Research this matter",
    deleteConfirm: "Delete this case? Linked reminders will stay but no longer refer to it.",
    taskDeleteNote: "Tasks keep your schedule organized and can be linked to a case.",
    courtPlaceholder: "e.g. District Court, Delhi", clientPlaceholder: "e.g. Client A",
    categoryCivil: "Civil", categoryCriminal: "Criminal", categoryFamily: "Family",
    categoryConstitutional: "Constitutional", categoryOther: "Other",
    statusActive: "Active", statusPending: "Pending", statusClosed: "Closed",
    error: "Something went wrong", apiOffline: "Could not connect to the server. Please make sure the application is running.",
    todayDate: "Today", loading: "Loading your workspace…",
    welcomeHi: "आपका स्वागत है", welcomeSubHi: "आज आपके कार्यक्षेत्र की जानकारी यहाँ है।",
    newCaseHi: "नया केस", totalCasesHi: "कुल मामले", activeCasesHi: "सक्रिय मामले",
    closedCasesHi: "बंद मामले", openTasksHi: "खुले कार्य", recentCasesHi: "हाल के मामले",
    upcomingHi: "आगामी", noCasesHi: "आपकी केस सूची तैयार है",
    noCasesSubHi: "अपना कार्य व्यवस्थित करने के लिए पहला मामला जोड़ें।",
    createFirstHi: "पहला मामला जोड़ें", noTasksHi: "अभी कुछ निर्धारित नहीं है",
    noTasksSubHi: "समय-सीमा याद रखने के लिए रिमाइंडर या सुनवाई की तारीख जोड़ें।",
    addTaskHi: "कार्य जोड़ें", activeHi: "सक्रिय", pendingHi: "लंबित", closedHi: "बंद",
    loginTitle: "Welcome back", loginSubtitle: "Sign in to continue to your private workspace.",
    setupTitle: "Set up your workspace", setupSubtitle: "Create a password to keep this device's legal workspace private.",
    fullName: "Full name", email: "Email address", password: "Password",
    signIn: "Sign in", createAccount: "Create account", firstAccount: "First time here?",
    existingAccount: "Already set up?", passwordHint: "Use at least 10 characters.",
    localAccountNote: "Your account and matters are stored on this device. Each account has a separate workspace.",
    signOut: "Sign out", secureWorkspace: "A private space for your legal practice",
    createAccountTitle: "Create your account",
    secureWorkspaceSub: "Organize matters, keep track of important dates, and explore legal references — all in one place.",
    notificationsSummary: "Your open reminders", noNotifications: "You're all caught up",
    noNotificationsDescription: "New hearing dates and reminders will appear here.",
    viewAllNotifications: "View all reminders", profileLabel: "SIGNED IN AS",
    accountCreated: "Create account", signInInstead: "Sign in instead",
    signupSubtitle: "Create a private workspace for your legal practice.",
  },
  hi: {
    dashboard: "अवलोकन", cases: "मेरे मामले",
    research: "कानूनी शोध", hearings: "सुनवाई और कार्य", reports: "रिपोर्ट",
    search: "मामले, ग्राहक खोजें…", notifications: "सूचनाएँ",
    welcome: "आपका स्वागत है", welcomeSub: "आज आपके कार्यक्षेत्र की जानकारी यहाँ है।",
    today: "आज", newCase: "नया मामला", totalCases: "कुल मामले", activeCases: "सक्रिय मामले",
    closedCases: "बंद मामले", openTasks: "खुले कार्य", vsLastMonth: "पिछले महीने से",
    recentCases: "हाल के मामले", viewAll: "सभी देखें", upcoming: "आगामी",
    noCases: "आपकी केस सूची तैयार है", noCasesSub: "अपना कार्य व्यवस्थित करने के लिए पहला मामला जोड़ें।",
    createFirst: "पहला मामला जोड़ें", noTasks: "अभी कुछ निर्धारित नहीं है",
    noTasksSub: "समय-सीमा याद रखने के लिए रिमाइंडर या सुनवाई की तारीख जोड़ें।",
    noTasksShort: "कोई आगामी रिमाइंडर नहीं", noTasksLong: "समय-सीमा याद रखने के लिए कार्य या सुनवाई की तारीख जोड़ें।",
    addTask: "कार्य जोड़ें", priority: "अगले कदम", allCaughtUp: "सभी कार्य पूरे हैं",
    caseList: "मामलों की सूची", casesSub: "मामले, ग्राहक और अगली तारीख एक जगह रखें।",
    searchCases: "मामला, ग्राहक या अदालत खोजें…", allStatuses: "सभी मामले",
    active: "सक्रिय", pending: "लंबित", closed: "बंद", client: "ग्राहक",
    matter: "मामला", court: "अदालत", nextDate: "अगली तारीख", status: "स्थिति",
    openCase: "मामला खोलें", delete: "हटाएँ", cancel: "रद्द करें", saveCase: "मामला सहेजें",
    addNewCase: "नया मामला जोड़ें", caseName: "मामले का नाम", clientName: "ग्राहक का नाम",
    caseNumber: "केस नंबर", courtName: "अदालत / न्यायाधिकरण", category: "श्रेणी",
    description: "संक्षिप्त विवरण", nextHearingDate: "अगली सुनवाई की तारीख", required: "आवश्यक",
    caseCreated: "मामला आपके कार्यक्षेत्र में जोड़ा गया।", caseDeleted: "मामला हटा दिया गया।",
    statusUpdated: "मामले की स्थिति अपडेट हो गई।",
    taskCreated: "रिमाइंडर जोड़ दिया गया।", taskUpdated: "कार्य अपडेट हो गया।",
    titleRequired: "कृपया आवश्यक जानकारी भरें।", saveTask: "रिमाइंडर सहेजें",
    addReminder: "रिमाइंडर जोड़ें", taskTitle: "क्या करना है?",
    dueDate: "नियत तारीख", linkedCase: "मामले से जोड़ें (वैकल्पिक)", noLinkedCase: "कोई मामला नहीं",
    current: "वर्तमान", researchTitle: "संभावित रूप से लागू कानून खोजें",
    researchSub: "समस्या अपने शब्दों में लिखें। आपका पाठ इसी डिवाइस पर एक छोटी, चयनित कानूनी संदर्भ सूची से मिलाया जाएगा।",
    issuePlaceholder: "उदाहरण: किसी ने बिना अनुमति मेरा फोन लिया और अब मुझे धमकी दे रहा है…",
    findSections: "संबंधित धाराएँ खोजें", searching: "संदर्भ देख रहे हैं…",
    suggestions: "उदाहरण आज़माएँ", sample1: "किसी ने मेरा सामान ले लिया",
    sample2: "मुझे फोन पर धमकी दी गई", sample3: "एक रिश्तेदार दहेज माँग रहा है",
    matches: "संभावित रूप से संबंधित संदर्भ", noMatches: "शुरुआती संदर्भ सूची में निकट मेल नहीं मिला।",
    noMatchesSub: "इसका अर्थ यह नहीं कि कोई कानून लागू नहीं होता। पूरे तथ्यों पर वकील से शोध कराएँ।",
    section: "धारा", under: "के अंतर्गत", source: "आधिकारिक स्रोत", matched: "मेल खाते शब्द",
    researchDisclaimer: "यह साधन प्रारंभिक, कीवर्ड-आधारित शोध देता है — कानूनी सलाह नहीं। संदर्भ केवल उदाहरण हैं और पूरी सूची नहीं हैं। कानून बदल सकते हैं। India Code पर वर्तमान पाठ की पुष्टि करें और योग्य भारतीय वकील से सलाह लें।",
    privateNote: "आपकी गोपनीयता के लिए, मामले का विवरण स्थानीय रूप से संसाधित होता है और किसी AI सेवा को नहीं भेजा जाता।",
    hearingsTitle: "सुनवाई और कार्य", hearingsSub: "आगामी तारीखों और मामलों से जुड़े कार्यों की सरल सूची।",
    upcomingHearings: "आगामी रिमाइंडर", overdue: "आज या उससे पहले", completed: "पूरे हुए",
    markDone: "पूरा करें", markOpen: "फिर खोलें", noTasksYet: "अभी कोई रिमाइंडर नहीं",
    reportTitle: "अभ्यास सारांश", reportSub: "आपके कार्यक्षेत्र के मामलों का संक्षिप्त विवरण।",
    mattersByStatus: "स्थिति के अनुसार मामले", total: "कुल", categoryBreakdown: "मामले की श्रेणियाँ",
    detail: "मामले का विवरण", created: "जोड़ा गया", analyzeThis: "इस मामले पर शोध करें",
    deleteConfirm: "क्या यह मामला हटाना है? जुड़े रिमाइंडर रहेंगे, लेकिन मामला लिंक नहीं रहेगा।",
    taskDeleteNote: "कार्य आपकी समय-सारणी व्यवस्थित रखते हैं और मामले से जोड़े जा सकते हैं।",
    courtPlaceholder: "उदा. जिला न्यायालय, दिल्ली", clientPlaceholder: "उदा. ग्राहक A",
    categoryCivil: "दीवानी", categoryCriminal: "आपराधिक", categoryFamily: "पारिवारिक",
    categoryConstitutional: "संवैधानिक", categoryOther: "अन्य",
    statusActive: "सक्रिय", statusPending: "लंबित", statusClosed: "बंद",
    error: "कुछ गलत हो गया", apiOffline: "सर्वर से कनेक्ट नहीं हो पाया। कृपया जाँचें कि एप्लिकेशन चल रहा है।",
    todayDate: "आज", loading: "आपका कार्यक्षेत्र लोड हो रहा है…",
    welcomeHi: "आपका स्वागत है", welcomeSubHi: "आज आपके कार्यक्षेत्र की जानकारी यहाँ है।",
    newCaseHi: "नया मामला", totalCasesHi: "कुल मामले", activeCasesHi: "सक्रिय मामले",
    closedCasesHi: "बंद मामले", openTasksHi: "खुले कार्य", recentCasesHi: "हाल के मामले",
    upcomingHi: "आगामी", noCasesHi: "आपकी केस सूची तैयार है",
    noCasesSubHi: "अपना कार्य व्यवस्थित करने के लिए पहला मामला जोड़ें।",
    createFirstHi: "पहला मामला जोड़ें", noTasksHi: "अभी कुछ निर्धारित नहीं है",
    noTasksSubHi: "समय-सीमा याद रखने के लिए रिमाइंडर या सुनवाई की तारीख जोड़ें।",
    addTaskHi: "कार्य जोड़ें", activeHi: "सक्रिय", pendingHi: "लंबित", closedHi: "बंद",
    loginTitle: "वापस स्वागत है", loginSubtitle: "अपने निजी कार्यक्षेत्र में जाने के लिए साइन इन करें।",
    setupTitle: "अपना कार्यक्षेत्र बनाएँ", setupSubtitle: "इस डिवाइस पर अपने कानूनी कार्यक्षेत्र को सुरक्षित रखने के लिए पासवर्ड बनाएँ।",
    fullName: "पूरा नाम", email: "ईमेल पता", password: "पासवर्ड",
    signIn: "साइन इन करें", createAccount: "खाता बनाएँ", firstAccount: "पहली बार आए हैं?",
    existingAccount: "पहले से खाता है?", passwordHint: "कम से कम 10 अक्षर इस्तेमाल करें।",
    localAccountNote: "आपका खाता और मामले इसी डिवाइस पर सहेजे जाते हैं। हर खाते का कार्यक्षेत्र अलग है।",
    signOut: "साइन आउट", secureWorkspace: "आपके कानूनी अभ्यास के लिए निजी कार्यक्षेत्र",
    createAccountTitle: "अपना खाता बनाएँ",
    secureWorkspaceSub: "मामलों को व्यवस्थित करें, महत्त्वपूर्ण तारीखें याद रखें और कानूनी संदर्भ खोजें — सब एक जगह।",
    notificationsSummary: "आपके खुले रिमाइंडर", noNotifications: "अभी कोई नया रिमाइंडर नहीं",
    noNotificationsDescription: "नई सुनवाई की तारीखें और रिमाइंडर यहाँ दिखेंगे।",
    viewAllNotifications: "सभी रिमाइंडर देखें", profileLabel: "साइन इन किया है",
    accountCreated: "खाता बनाएँ", signInInstead: "साइन इन करें",
    signupSubtitle: "अपने कानूनी अभ्यास के लिए निजी कार्यक्षेत्र बनाएँ।",
  },
};

const navItems = [
  { id: "dashboard", icon: LayoutDashboard },
  { id: "cases", icon: BriefcaseBusiness },
  { id: "research", icon: BookOpen },
  { id: "hearings", icon: CalendarDays },
  { id: "reports", icon: FileText },
];

const categoryOptions = ["Civil", "Criminal", "Family", "Constitutional", "Other"];

function dateLabel(value, language) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }).format(date);
}

function todayISO() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

async function request(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem("nyaya-language") || "en");
  const [page, setPage] = useState("dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [cases, setCases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState({ hasAccount: false, authenticated: false, user: null });
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [serverError, setServerError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mobileNav, setMobileNav] = useState(false);
  const [activePopover, setActivePopover] = useState(null);
  const t = copy[language];

  const refresh = useCallback(async () => {
    const [summary, caseList, taskList] = await Promise.all([
      request("/api/dashboard"), request("/api/cases"), request("/api/tasks"),
    ]);
    setDashboard(summary);
    setCases(caseList);
    setTasks(taskList);
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        const status = await request("/api/auth/status");
        setAuthStatus(status);
        if (status.authenticated) await refresh();
      } catch (error) {
        setServerError(error.message);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [refresh]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(timer);
  }, [notice]);

  function changeLanguage(next) {
    localStorage.setItem("nyaya-language", next);
    setLanguage(next);
  }

  const filteredCases = useMemo(() => cases.filter((item) => {
    const haystack = `${item.title} ${item.client} ${item.caseNumber} ${item.court}`.toLowerCase();
    return haystack.includes(search.toLowerCase())
      && (statusFilter === "all" || item.status.toLowerCase() === statusFilter);
  }), [cases, search, statusFilter]);

  async function submitAuthentication(values, mode) {
    setAuthBusy(true);
    setAuthError("");
    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const result = await request(endpoint, { method: "POST", body: JSON.stringify(values) });
      setAuthStatus({ hasAccount: true, authenticated: true, user: result.user });
      await refresh();
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthBusy(false);
    }
  }

  async function signOut() {
    try {
      await request("/api/auth/logout", { method: "POST" });
      setActivePopover(null);
      setAuthStatus((current) => ({ ...current, authenticated: false, user: null }));
      setDashboard(null);
      setCases([]);
      setTasks([]);
      setSelectedCase(null);
      setPage("dashboard");
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function createCase(values) {
    const created = await request("/api/cases", { method: "POST", body: JSON.stringify(values) });
    await refresh();
    setNotice(t.caseCreated);
    setModal("");
    setSelectedCase(created);
  }

  async function deleteCase(id) {
    if (!window.confirm(t.deleteConfirm)) return;
    try {
      await request(`/api/cases/${id}`, { method: "DELETE" });
      setSelectedCase(null);
      await refresh();
      setNotice(t.caseDeleted);
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function updateCaseStatus(id, status) {
    try {
      const updated = await request(`/api/cases/${id}`, {
        method: "PATCH", body: JSON.stringify({ status }),
      });
      setSelectedCase(updated);
      await refresh();
      setNotice(t.statusUpdated);
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function createTask(values) {
    await request("/api/tasks", { method: "POST", body: JSON.stringify(values) });
    await refresh();
    setNotice(t.taskCreated);
    setModal("");
  }

  async function toggleTask(task) {
    try {
      await request(`/api/tasks/${task.id}`, {
        method: "PATCH", body: JSON.stringify({ done: !task.done }),
      });
      await refresh();
      setNotice(t.taskUpdated);
    } catch (error) {
      setNotice(error.message);
    }
  }

  function openResearch(description = "") {
    setSelectedCase(null);
    setPage("research");
    setModal("");
    setMobileNav(false);
    window.setTimeout(() => {
      const event = new CustomEvent("nyaya:research-prompt", { detail: description });
      window.dispatchEvent(event);
    }, 0);
  }

  function navigate(id) {
    setPage(id);
    setMobileNav(false);
    setActivePopover(null);
  }

  useEffect(() => {
    function closePopover(event) {
      if (!event.target.closest("[data-popover-anchor]")) setActivePopover(null);
    }
    function closeWithEscape(event) {
      if (event.key === "Escape") setActivePopover(null);
    }
    document.addEventListener("pointerdown", closePopover);
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closePopover);
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

  if (loading) {
    return <div className="loading-screen"><div className="brand-mark"><Gavel size={24} /></div><p>{t.loading}</p></div>;
  }

  if (!authStatus.authenticated) {
    return <AuthPage
      language={language}
      t={t}
      hasAccount={authStatus.hasAccount}
      busy={authBusy}
      error={authError || serverError}
      onLanguageChange={changeLanguage}
      onSubmit={(values, mode) => submitAuthentication(values, mode)}
      onClearError={() => setAuthError("")}
      onRetry={() => {
        setServerError("");
        request("/api/auth/status").then(setAuthStatus).catch((error) => setServerError(error.message));
      }}
    />;
  }

  const initials = authStatus.user?.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "NY";

  return (
    <div className={`app-shell ${language === "hi" ? "hindi" : ""}`}>
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <button className="brand-home" onClick={() => navigate("dashboard")} aria-label="Nyaya home">
            <div className="brand-mark"><Gavel size={20} strokeWidth={2} /></div>
            <span>nyaya<span className="brand-dot">.</span></span>
          </button>
          <button className="icon-btn sidebar-close" aria-label="Close navigation" onClick={() => setMobileNav(false)}><X size={19} /></button>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(({ id, icon: Icon }) => (
            <button key={id} className={`nav-link ${page === id ? "selected" : ""}`} onClick={() => navigate(id)}>
              <Icon size={18} strokeWidth={1.8} /><span>{t[id]}</span>
              {id === "cases" && cases.length > 0 && <span className="nav-count">{cases.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="privacy-card"><ShieldCheck size={17} /><span>{language === "hi" ? "आपका डेटा इस डिवाइस पर सहेजा जाता है।" : "Your data stays on this device."}</span></div>
          <div className="profile">
            <div className="avatar">{initials}</div>
            <div className="profile-meta"><strong>{authStatus.user?.name}</strong><span>{authStatus.user?.email}</span></div>
            <button className="icon-btn profile-more" aria-label={t.signOut} title={t.signOut} onClick={signOut}><LogOut size={16} /></button>
          </div>
        </div>
      </aside>
      {mobileNav && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="icon-btn mobile-menu" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={20} /></button>
          <label className="global-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} onFocus={() => navigate("cases")} placeholder={t.search} /></label>
          <div className="topbar-actions">
            <div className="language-toggle" aria-label="Language">
              <Globe2 size={15} />
              <button className={language === "en" ? "language-active" : ""} onClick={() => changeLanguage("en")}>EN</button>
              <span />
              <button className={language === "hi" ? "language-active" : ""} onClick={() => changeLanguage("hi")}>हि</button>
            </div>
            <div className="popover-anchor" data-popover-anchor>
              <button
                className="icon-btn notification-btn"
                aria-label={t.notifications}
                aria-expanded={activePopover === "notifications"}
                onClick={() => setActivePopover((current) => current === "notifications" ? null : "notifications")}
              >
                <Bell size={18} />{tasks.some((task) => !task.done) && <i />}
              </button>
              {activePopover === "notifications" && <NotificationsPopover t={t} language={language} tasks={tasks} onOpen={() => navigate("hearings")} />}
            </div>
            <div className="popover-anchor" data-popover-anchor>
              <button
                className="top-avatar profile-trigger"
                aria-label={authStatus.user?.name || t.profileLabel}
                aria-expanded={activePopover === "profile"}
                onClick={() => setActivePopover((current) => current === "profile" ? null : "profile")}
              >{initials}</button>
              {activePopover === "profile" && <ProfilePopover t={t} user={authStatus.user} onSignOut={signOut} />}
            </div>
          </div>
        </header>
        {serverError && <div className="server-banner"><CircleHelp size={17} /><span>{serverError || t.apiOffline}</span><button onClick={() => refresh().then(() => setServerError("")).catch((error) => setServerError(error.message))}>{language === "hi" ? "फिर कोशिश करें" : "Try again"}</button></div>}
        {!serverError && (
          <div className="page-content">
            {page === "dashboard" && <Dashboard t={t} language={language} data={dashboard} cases={cases} tasks={tasks} onNavigate={navigate} onNewCase={() => setModal("case")} onNewTask={() => setModal("task")} onOpenCase={setSelectedCase} onToggleTask={toggleTask} />}
            {page === "cases" && <CasesPage t={t} language={language} cases={filteredCases} search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onNewCase={() => setModal("case")} onOpenCase={setSelectedCase} />}
            {page === "research" && <ResearchPage t={t} language={language} />}
            {page === "hearings" && <HearingsPage t={t} language={language} tasks={tasks} onNewTask={() => setModal("task")} onToggleTask={toggleTask} />}
            {page === "reports" && <ReportsPage t={t} language={language} cases={cases} tasks={tasks} />}
          </div>
        )}
      </main>
      {modal === "case" && <CaseModal t={t} onClose={() => setModal("")} onSave={createCase} />}
      {modal === "task" && <TaskModal t={t} cases={cases} onClose={() => setModal("")} onSave={createTask} />}
      {selectedCase && <CaseDetail t={t} language={language} item={selectedCase} onClose={() => setSelectedCase(null)} onDelete={deleteCase} onAnalyze={openResearch} onStatusChange={updateCaseStatus} />}
      {notice && <div className="toast"><CheckCircle2 size={17} /><span>{notice}</span><button className="icon-btn" onClick={() => setNotice("")}><X size={15} /></button></div>}
    </div>
  );
}

function PageHeading({ eyebrow, title, subtitle, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

function AuthPage({ language, t, hasAccount, busy, error, onLanguageChange, onSubmit, onClearError, onRetry }) {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState(hasAccount ? "login" : "register");
  const creatingAccount = mode === "register";

  function submit(event) {
    event.preventDefault();
    onSubmit(values, mode);
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    onClearError();
  }

  return (
    <main className={`auth-page ${language === "hi" ? "hindi" : ""}`}>
      <section className="auth-story">
        <div className="auth-brand"><div className="brand-mark"><Gavel size={20} /></div><span>nyaya<span className="brand-dot">.</span></span></div>
        <div className="auth-story-copy">
          <div className="auth-eyebrow"><ShieldCheck size={14} />{language === "hi" ? "आपका निजी कार्यक्षेत्र" : "YOUR PRIVATE WORKSPACE"}</div>
          <h1>{t.secureWorkspace}</h1>
          <p>{t.secureWorkspaceSub}</p>
          <div className="auth-feature"><span><BriefcaseBusiness size={17} /></span><div><strong>{language === "hi" ? "मामला प्रबंधन" : "Matter management"}</strong><small>{language === "hi" ? "अपने अभ्यास को व्यवस्थित रखें" : "Keep your practice organized"}</small></div></div>
          <div className="auth-feature"><span><CalendarDays size={17} /></span><div><strong>{language === "hi" ? "सुनवाई और रिमाइंडर" : "Hearings & reminders"}</strong><small>{language === "hi" ? "महत्त्वपूर्ण तारीखें याद रखें" : "Stay on top of important dates"}</small></div></div>
          <div className="auth-feature"><span><BookOpen size={17} /></span><div><strong>{language === "hi" ? "कानूनी शोध" : "Legal research"}</strong><small>{language === "hi" ? "चुनिंदा कानूनी संदर्भ खोजें" : "Explore selected legal references"}</small></div></div>
        </div>
        <p className="auth-story-foot"><ShieldCheck size={14} />{language === "hi" ? "आपका डेटा इस डिवाइस पर रहता है" : "Your data stays on this device"}</p>
      </section>
      <section className="auth-form-side">
        <div className="auth-language">
          <Globe2 size={15} />
          <button className={language === "en" ? "language-active" : ""} onClick={() => onLanguageChange("en")}>EN</button>
          <span />
          <button className={language === "hi" ? "language-active" : ""} onClick={() => onLanguageChange("hi")}>हि</button>
        </div>
        <div className="auth-card">
          <div className="auth-mobile-brand"><div className="brand-mark"><Gavel size={19} /></div><span>nyaya<span className="brand-dot">.</span></span></div>
          <div className="auth-card-icon">{creatingAccount ? <Gavel size={20} /> : <ShieldCheck size={20} />}</div>
          <div className="eyebrow">{language === "hi" ? (creatingAccount ? "नया निजी कार्यक्षेत्र" : "सुरक्षित साइन इन") : (creatingAccount ? "CREATE A PRIVATE WORKSPACE" : "SECURE SIGN IN")}</div>
          <h2>{creatingAccount ? (hasAccount ? t.createAccountTitle : t.setupTitle) : t.loginTitle}</h2>
          <p className="auth-subtitle">{creatingAccount ? (hasAccount ? t.signupSubtitle : t.setupSubtitle) : t.loginSubtitle}</p>
          <form className="auth-form" onSubmit={submit}>
            {creatingAccount && <label className="auth-field"><span>{t.fullName}</span><input autoComplete="name" name="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} maxLength={100} placeholder={t.fullName} required /></label>}
            <label className="auth-field"><span>{t.email}</span><input type="email" autoComplete="email" name="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} maxLength={254} placeholder="you@example.com" required /></label>
            <label className="auth-field"><span>{t.password}</span><div className="password-input"><input type={showPassword ? "text" : "password"} autoComplete={creatingAccount ? "new-password" : "current-password"} name="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} minLength={creatingAccount ? 10 : 1} maxLength={200} placeholder={creatingAccount ? t.passwordHint : t.password} required /><button type="button" onClick={() => setShowPassword((current) => !current)}>{showPassword ? (language === "hi" ? "छिपाएँ" : "Hide") : (language === "hi" ? "दिखाएँ" : "Show")}</button></div></label>
            {error && <div className="auth-error" role="alert"><CircleHelp size={15} /><span>{error}</span>{error.includes("connect") || error.includes("fetch") ? <button type="button" onClick={onRetry}>{language === "hi" ? "फिर कोशिश करें" : "Retry"}</button> : null}</div>}
            <button type="submit" className="button-primary auth-submit" disabled={busy}>{busy ? <span className="spinner" /> : creatingAccount ? <Gavel size={16} /> : <ShieldCheck size={16} />}{creatingAccount ? t.createAccount : t.signIn}<ArrowRight size={16} /></button>
          </form>
          <div className="auth-switch">
            <span>{creatingAccount ? t.existingAccount : t.firstAccount}</span>
            <button type="button" onClick={() => changeMode(creatingAccount ? "login" : "register")}>{creatingAccount ? t.signInInstead : t.accountCreated}</button>
          </div>
          <div className="auth-local-note"><ShieldCheck size={15} /><span>{t.localAccountNote}</span></div>
        </div>
        <p className="auth-footer">{language === "hi" ? "Nyaya · कानूनी अभ्यास कार्यक्षेत्र" : "Nyaya · Legal practice workspace"}</p>
      </section>
    </main>
  );
}

function NotificationsPopover({ t, language, tasks, onOpen }) {
  const reminders = tasks.filter((task) => !task.done)
    .sort((left, right) => (left.dueDate || "9999-12-31").localeCompare(right.dueDate || "9999-12-31"))
    .slice(0, 5);

  return (
    <section className="popover-menu notification-popover" aria-label={t.notifications}>
      <div className="popover-heading">
        <div><strong>{t.notifications}</strong><span>{t.notificationsSummary}</span></div>
        <span className="notification-count">{reminders.length}</span>
      </div>
      {reminders.length ? <div className="notification-list">
        {reminders.map((task) => <button className="notification-item" key={task.id} onClick={onOpen}>
          <span className="notification-item-icon"><CalendarDays size={15} /></span>
          <span className="notification-item-copy"><strong>{task.title}</strong><small>{task.caseTitle || t.noLinkedCase}</small></span>
          <time>{dateLabel(task.dueDate, language)}</time>
        </button>)}
      </div> : <div className="notification-empty"><CheckCircle2 size={22} /><strong>{t.noNotifications}</strong><span>{t.noNotificationsDescription}</span></div>}
      <button className="popover-footer" onClick={onOpen}>{t.viewAllNotifications}<ArrowRight size={14} /></button>
    </section>
  );
}

function ProfilePopover({ t, user, onSignOut }) {
  return (
    <section className="popover-menu profile-popover" aria-label={t.profileLabel}>
      <div className="profile-popover-user">
        <span>{t.profileLabel}</span>
        <strong>{user?.name}</strong>
        <small>{user?.email}</small>
      </div>
      <button className="profile-signout" onClick={onSignOut}><LogOut size={15} />{t.signOut}</button>
    </section>
  );
}

function Dashboard({ t, language, data, cases, tasks, onNavigate, onNewCase, onNewTask, onOpenCase, onToggleTask }) {
  const stats = [
    { title: t.totalCases, value: data?.total ?? 0, icon: BriefcaseBusiness, color: "navy", trend: <ArrowUpRight size={14} /> },
    { title: t.activeCases, value: data?.active ?? 0, icon: Gavel, color: "green", trend: null },
    { title: t.closedCases, value: data?.completed ?? 0, icon: CheckCircle2, color: "purple", trend: null },
    { title: t.openTasks, value: data?.pendingTasks ?? 0, icon: Clock3, color: "amber", trend: <ArrowDownRight size={14} /> },
  ];
  const upcoming = (data?.upcoming ?? []).slice(0, 4);
  const recent = data?.recent ?? [];
  const today = new Date();
  const openTasks = tasks.filter((task) => !task.done).slice(0, 4);
  return (
    <>
      <PageHeading eyebrow={`${t.today} · ${new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", { weekday: "long", day: "numeric", month: "long" }).format(today)}`} title={language === "hi" ? t.welcomeHi : t.welcome} subtitle={language === "hi" ? t.welcomeSubHi : t.welcomeSub} action={<button className="button-primary" onClick={onNewCase}><Plus size={17} />{language === "hi" ? t.newCaseHi : t.newCase}</button>} />
      <section className="stats-grid">
        {stats.map(({ title, value, icon: Icon, color, trend }) => (
          <article className="stat-card" key={title}>
            <div className="stat-top"><span>{title}</span><div className={`stat-icon ${color}`}><Icon size={17} /></div></div>
            <div className="stat-bottom"><strong>{value}</strong><span className="stat-trend">{trend}{t.current}</span></div>
          </article>
        ))}
      </section>
      <div className="dashboard-grid">
        <section className="panel recent-panel">
          <div className="panel-heading"><div><h2>{language === "hi" ? t.recentCasesHi : t.recentCases}</h2><p>{language === "hi" ? "आपके कार्यक्षेत्र में हाल ही में जोड़े गए मामले" : "The latest matters added to your workspace"}</p></div><button className="text-button" onClick={() => onNavigate("cases")}>{t.viewAll}<ArrowRight size={15} /></button></div>
          {recent.length ? <CaseTable t={t} language={language} cases={recent} onOpenCase={onOpenCase} /> : <EmptyState icon={BriefcaseBusiness} title={language === "hi" ? t.noCasesHi : t.noCases} description={language === "hi" ? t.noCasesSubHi : t.noCasesSub} action={<button className="button-secondary" onClick={onNewCase}><Plus size={16} />{language === "hi" ? t.createFirstHi : t.createFirst}</button>} />}
        </section>
        <section className="panel upcoming-panel">
          <div className="panel-heading"><div><h2>{language === "hi" ? t.upcomingHi : t.upcoming}</h2><p>{language === "hi" ? "अगली तारीखें और रिमाइंडर" : "Hearings and reminders ahead"}</p></div><button className="icon-btn panel-add" onClick={onNewTask} aria-label={t.addTask}><Plus size={17} /></button></div>
          {upcoming.length ? <div className="timeline">{upcoming.map((task) => <div className="timeline-item" key={task.id}><div className="timeline-dot" /><div className="timeline-info"><strong>{task.title}</strong><span>{task.caseTitle || (language === "hi" ? "सामान्य रिमाइंडर" : "General reminder")}</span><small><CalendarDays size={13} />{dateLabel(task.dueDate, language)}</small></div></div>)}</div> : <div className="empty-compact"><CalendarDays size={23} /><strong>{language === "hi" ? t.noTasksHi : t.noTasksShort}</strong><span>{language === "hi" ? t.noTasksSubHi : t.noTasksLong}</span><button className="text-button" onClick={onNewTask}><Plus size={15} />{language === "hi" ? t.addTaskHi : t.addTask}</button></div>}
          <button className="panel-footer-link" onClick={() => onNavigate("hearings")}>{language === "hi" ? "सभी कार्य देखें" : "View all tasks"}<ArrowRight size={14} /></button>
        </section>
      </div>
      <div className="dashboard-lower">
        <section className="panel task-panel"><div className="panel-heading"><div><h2>{t.priority}</h2><p>{language === "hi" ? "आपकी खुली कार्य सूची" : "A short list to keep your day moving"}</p></div><button className="icon-btn panel-add" onClick={onNewTask} aria-label={t.addTask}><Plus size={17} /></button></div>
          {openTasks.length ? <div className="task-list">{openTasks.map((task) => <label className="task-row" key={task.id}><button className="task-checkbox" onClick={() => onToggleTask(task)} aria-label={t.markDone}><Check size={13} /></button><span><strong>{task.title}</strong><small>{task.caseTitle || t.taskDeleteNote}</small></span><time>{task.dueDate ? dateLabel(task.dueDate, language) : "—"}</time></label>)}</div> : <div className="all-done"><CheckCircle2 size={18} />{t.allCaughtUp}</div>}
        </section>
        <button className="research-promo" onClick={() => onNavigate("research")}><div className="promo-icon"><Sparkles size={20} /></div><div><span>{language === "hi" ? "कानूनी शोध" : "LEGAL RESEARCH"}</span><strong>{language === "hi" ? "संभावित धाराएँ खोजें" : "Explore relevant sections"}</strong><p>{language === "hi" ? "एक विवरण लिखें और संदर्भ खोजें" : "Describe an issue to find starting-point references."}</p></div><ArrowRight size={18} className="promo-arrow" /></button>
      </div>
    </>
  );
}

function CasesPage({ t, language, cases, search, setSearch, statusFilter, setStatusFilter, onNewCase, onOpenCase }) {
  return <>
    <PageHeading eyebrow={language === "hi" ? "मामला प्रबंधन" : "MATTER MANAGEMENT"} title={language === "hi" ? t.caseList : t.cases} subtitle={language === "hi" ? "मामले, ग्राहक और अगली तारीख एक जगह रखें।" : t.casesSub} action={<button className="button-primary" onClick={onNewCase}><Plus size={17} />{language === "hi" ? t.newCaseHi : t.newCase}</button>} />
    <section className="panel cases-panel">
      <div className="case-toolbar"><label className="table-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchCases} /></label><label className="filter-select"><Filter size={15} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">{t.allStatuses}</option><option value="active">{language === "hi" ? t.activeHi : t.active}</option><option value="pending">{language === "hi" ? t.pendingHi : t.pending}</option><option value="closed">{language === "hi" ? t.closedHi : t.closed}</option></select></label><span className="result-count">{cases.length} {language === "hi" ? "मामले" : cases.length === 1 ? "matter" : "matters"}</span></div>
      {cases.length ? <CaseTable t={t} language={language} cases={cases} onOpenCase={onOpenCase} /> : <EmptyState icon={BriefcaseBusiness} title={search ? (language === "hi" ? "कोई मेल नहीं मिला" : "No matching matters") : (language === "hi" ? t.noCasesHi : t.noCases)} description={search ? t.searchCases : (language === "hi" ? t.noCasesSubHi : t.noCasesSub)} action={!search && <button className="button-secondary" onClick={onNewCase}><Plus size={16} />{language === "hi" ? t.createFirstHi : t.createFirst}</button>} />}
    </section>
  </>;
}

function CaseTable({ t, language, cases, onOpenCase }) {
  return <div className="table-wrap"><table className="case-table"><thead><tr><th>{t.matter}</th><th>{t.client}</th><th>{t.court}</th><th>{t.nextDate}</th><th>{t.status}</th><th /></tr></thead><tbody>
    {cases.map((item) => <tr key={item.id} onClick={() => onOpenCase(item)} tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onOpenCase(item)}>
      <td><div className="matter-cell"><div className="matter-icon"><Gavel size={15} /></div><span><strong>{item.title}</strong><small>{item.caseNumber || item.category}</small></span></div></td>
      <td>{item.client}</td><td>{item.court || "—"}</td><td>{dateLabel(item.nextDate, language)}</td>
      <td><span className={`status-pill ${item.status.toLowerCase()}`}>{language === "hi" ? t[`status${item.status}`] || item.status : item.status}</span></td><td><ArrowRight size={15} className="row-arrow" /></td>
    </tr>)}
  </tbody></table></div>;
}

function EmptyState({ icon: Icon, title, description, action }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={23} /></div><strong>{title}</strong><p>{description}</p>{action}</div>;
}

function ResearchPage({ t, language }) {
  const [description, setDescription] = useState("");
  const [matches, setMatches] = useState(null);
  const [disclaimer, setDisclaimer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function receivePrompt(event) {
      if (event.detail) setDescription(event.detail);
    }
    window.addEventListener("nyaya:research-prompt", receivePrompt);
    return () => window.removeEventListener("nyaya:research-prompt", receivePrompt);
  }, []);

  async function analyze(event) {
    event.preventDefault();
    setError("");
    setMatches(null);
    setBusy(true);
    try {
      const result = await request("/api/analyze", {
        method: "POST", body: JSON.stringify({ description, language }),
      });
      setMatches(result.matches);
      setDisclaimer(result.disclaimer);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  const samples = [
    { label: t.sample1, value: language === "hi" ? "किसी ने बिना अनुमति मेरा सामान चुरा लिया" : "Someone stole my belongings without permission" },
    { label: t.sample2, value: language === "hi" ? "मुझे फोन पर धमकी दी गई" : "I was threatened over a phone call" },
    { label: t.sample3, value: language === "hi" ? "एक रिश्तेदार दहेज की मांग कर रहा है" : "A relative is demanding dowry" },
  ];

  return <>
    <PageHeading eyebrow={language === "hi" ? "प्रारंभिक कानूनी शोध" : "PRELIMINARY LEGAL RESEARCH"} title={language === "hi" ? t.researchTitle : t.researchTitle} subtitle={language === "hi" ? t.researchSub : t.researchSub} />
    <div className="research-layout">
      <section className="panel research-form-panel">
        <div className="research-card-top"><div className="research-spark"><Sparkles size={19} /></div><span>{language === "hi" ? "विवरण से संदर्भ खोजें" : "DESCRIBE YOUR ISSUE"}</span></div>
        <form onSubmit={analyze}>
          <label className="form-label" htmlFor="issue-text">{language === "hi" ? "क्या हुआ?" : "What happened?"}</label>
          <textarea id="issue-text" value={description} maxLength={5000} onChange={(event) => setDescription(event.target.value)} placeholder={t.issuePlaceholder} rows={6} required minLength={8} />
          <div className="textarea-meta"><span>{language === "hi" ? t.privateNote : t.privateNote}</span><span>{description.length}/5000</span></div>
          {error && <p className="inline-error">{error}</p>}
          <button className="button-primary research-submit" disabled={busy || description.trim().length < 8}>{busy ? <><span className="spinner" />{t.searching}</> : <><Sparkles size={16} />{t.findSections}<ArrowRight size={16} /></>}</button>
        </form>
        <div className="sample-prompts"><span>{t.suggestions}</span>{samples.map((sample) => <button key={sample.label} onClick={() => { setDescription(sample.value); setMatches(null); }}>{sample.label}<ArrowUpRight size={13} /></button>)}</div>
      </section>
      <aside className="research-aside"><div className="research-disclaimer"><ShieldCheck size={18} /><strong>{language === "hi" ? "महत्वपूर्ण सूचना" : "A note on legal information"}</strong><p>{t.researchDisclaimer}</p><a href="https://www.indiacode.nic.in/" target="_blank" rel="noreferrer">{t.source}<ArrowUpRight size={13} /></a></div>
        <div className="laws-info"><BookOpen size={18} /><strong>{language === "hi" ? "प्रारंभिक संदर्भ संग्रह" : "Starter reference library"}</strong><p>{language === "hi" ? "BNS, BNSS, BSA और भारतीय संविधान के चुनिंदा प्रावधान। यह पूरी या अद्यतन कानूनी सूची नहीं है।" : "Selected provisions from the BNS, BNSS, BSA, and Constitution of India. This is not a complete or continuously updated legal database."}</p></div>
      </aside>
    </div>
    {matches && <section className="matches-section"><div className="panel-heading"><div><h2>{t.matches}</h2><p>{language === "hi" ? `${matches.length} संदर्भ मिले` : `${matches.length} references found`}</p></div><span className="local-badge"><ShieldCheck size={13} />{language === "hi" ? "स्थानीय खोज" : "LOCAL SEARCH"}</span></div>
      {matches.length ? <div className="results-grid">{matches.map((item) => <article className="law-result" key={item.id}><div className="law-result-header"><span>{item.lawName}</span><strong>{t.section} {item.section}</strong></div><h3>{language === "hi" ? item.titleHi : item.titleEn}</h3><p>{language === "hi" ? item.summaryHi : item.summaryEn}</p><div className="law-result-footer"><span>{t.matched}: {item.matchedTerms.join(", ")}</span><a href={item.sourceUrl} target="_blank" rel="noreferrer">{t.source}<ArrowUpRight size={13} /></a></div></article>)}</div> : <div className="no-match"><Search size={20} /><strong>{t.noMatches}</strong><p>{t.noMatchesSub}</p></div>}
      <div className="disclaimer-strip"><ShieldCheck size={15} />{disclaimer}</div>
    </section>}
  </>;
}

function HearingsPage({ t, language, tasks, onNewTask, onToggleTask }) {
  const pending = tasks.filter((task) => !task.done);
  const done = tasks.filter((task) => task.done);
  const overdueTasks = pending.filter((task) => task.dueDate && task.dueDate <= todayISO());
  function taskGroup(label, items, accent) {
    return <section className="panel hearing-group"><div className="panel-heading"><div><h2>{label}</h2><p>{items.length} {language === "hi" ? "कार्य" : items.length === 1 ? "reminder" : "reminders"}</p></div></div>{items.length ? <div className="hearing-list">{items.map((task) => <article className={`hearing-row ${accent || ""}`} key={task.id}><button className={`task-checkbox ${task.done ? "checked" : ""}`} onClick={() => onToggleTask(task)} aria-label={task.done ? t.markOpen : t.markDone}>{task.done && <Check size={13} />}</button><div className="hearing-info"><strong>{task.title}</strong><span>{task.caseTitle || (language === "hi" ? "सामान्य रिमाइंडर" : "General reminder")}</span></div><time><CalendarDays size={14} />{dateLabel(task.dueDate, language)}</time><button className="text-button" onClick={() => onToggleTask(task)}>{task.done ? t.markOpen : t.markDone}</button></article>)}</div> : <div className="hearing-empty"><CalendarDays size={21} /><span>{t.noTasksYet}</span></div>}</section>;
  }
  return <>
    <PageHeading eyebrow={language === "hi" ? "समय-सारणी" : "SCHEDULE"} title={t.hearingsTitle} subtitle={t.hearingsSub} action={<button className="button-primary" onClick={onNewTask}><Plus size={17} />{language === "hi" ? t.addTaskHi : t.addTask}</button>} />
    <div className="hearing-summary"><div className="summary-box"><span>{t.openTasks}</span><strong>{pending.length}</strong></div><div className="summary-box alert"><span>{t.overdue}</span><strong>{overdueTasks.length}</strong></div><div className="summary-box complete"><span>{t.completed}</span><strong>{done.length}</strong></div></div>
    {taskGroup(t.upcomingHearings, pending, "")}
    {done.length > 0 && taskGroup(t.completed, done, "done-group")}
  </>;
}

function ReportsPage({ t, language, cases, tasks }) {
  const statuses = ["Active", "Pending", "Closed"].map((status) => ({ status, count: cases.filter((item) => item.status === status).length }));
  const categories = categoryOptions.map((category) => ({ category, count: cases.filter((item) => item.category === category).length })).filter((item) => item.count);
  const maxStatus = Math.max(1, ...statuses.map((item) => item.count));
  const maxCategory = Math.max(1, ...categories.map((item) => item.count));
  return <>
    <PageHeading eyebrow={language === "hi" ? "कार्य क्षेत्र" : "WORKSPACE"} title={t.reportTitle} subtitle={t.reportSub} />
    <div className="report-stats"><div className="report-stat"><BriefcaseBusiness size={18} /><span>{t.total}</span><strong>{cases.length}</strong></div><div className="report-stat"><Gavel size={18} /><span>{t.activeCases}</span><strong>{cases.filter((item) => item.status === "Active").length}</strong></div><div className="report-stat"><Clock3 size={18} /><span>{t.openTasks}</span><strong>{tasks.filter((item) => !item.done).length}</strong></div><div className="report-stat"><Users size={18} /><span>{t.client}</span><strong>{new Set(cases.map((item) => item.client)).size}</strong></div></div>
    <div className="reports-grid"><section className="panel report-panel"><div className="panel-heading"><div><h2>{t.mattersByStatus}</h2><p>{language === "hi" ? "आपके सभी मामलों की स्थिति" : "Current distribution of all matters"}</p></div></div><div className="bar-list">{statuses.map(({ status, count }) => <div className="bar-row" key={status}><div className="bar-label"><span>{language === "hi" ? t[`status${status}`] : status}</span><strong>{count}</strong></div><div className="bar-track"><span className={`bar-fill ${status.toLowerCase()}`} style={{ width: `${(count / maxStatus) * 100}%` }} /></div></div>)}</div></section>
    <section className="panel report-panel"><div className="panel-heading"><div><h2>{t.categoryBreakdown}</h2><p>{language === "hi" ? "प्रत्येक श्रेणी के मामले" : "Matters grouped by category"}</p></div></div>{categories.length ? <div className="bar-list">{categories.map(({ category, count }) => <div className="bar-row" key={category}><div className="bar-label"><span>{language === "hi" ? t[`category${category}`] : category}</span><strong>{count}</strong></div><div className="bar-track"><span className="bar-fill category" style={{ width: `${(count / maxCategory) * 100}%` }} /></div></div>)}</div> : <div className="hearing-empty">{language === "hi" ? "मामले जोड़ने के बाद श्रेणियाँ यहाँ दिखेंगी।" : "Categories will appear as you add matters."}</div>}</section></div>
  </>;
}

function CaseModal({ t, onClose, onSave }) {
  const [values, setValues] = useState({ title: "", client: "", caseNumber: "", court: "", category: "Civil", nextDate: "", description: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function update(event) { setValues((current) => ({ ...current, [event.target.name]: event.target.value })); }
  async function submit(event) {
    event.preventDefault();
    if (!values.title.trim() || !values.client.trim()) { setError(t.titleRequired); return; }
    setBusy(true); setError("");
    try { await onSave(values); } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  }
  return <Modal title={t.addNewCase} onClose={onClose}><form className="modal-form" onSubmit={submit}>
    <div className="form-two"><Field label={t.caseName} required><input name="title" value={values.title} onChange={update} placeholder={t.caseName} maxLength={160} /></Field><Field label={t.clientName} required><input name="client" value={values.client} onChange={update} placeholder={t.clientPlaceholder} maxLength={120} /></Field></div>
    <div className="form-two"><Field label={t.caseNumber}><input name="caseNumber" value={values.caseNumber} onChange={update} placeholder="e.g. CS/123/2026" maxLength={100} /></Field><Field label={t.courtName}><input name="court" value={values.court} onChange={update} placeholder={t.courtPlaceholder} maxLength={160} /></Field></div>
    <div className="form-two"><Field label={t.category}><select name="category" value={values.category} onChange={update}>{categoryOptions.map((item) => <option key={item} value={item}>{t[`category${item}`] || item}</option>)}</select></Field><Field label={t.nextHearingDate}><input type="date" name="nextDate" value={values.nextDate} onChange={update} /></Field></div>
    <Field label={t.description}><textarea name="description" rows={3} value={values.description} onChange={update} maxLength={2000} placeholder={t.description} /></Field>
    {error && <p className="inline-error">{error}</p>}<div className="modal-actions"><button type="button" className="button-secondary" onClick={onClose}>{t.cancel}</button><button type="submit" className="button-primary" disabled={busy}>{busy ? <span className="spinner" /> : <Plus size={16} />}{t.saveCase}</button></div>
  </form></Modal>;
}

function TaskModal({ t, cases, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [caseId, setCaseId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (!title.trim()) { setError(t.titleRequired); return; }
    setBusy(true); setError("");
    try { await onSave({ title, dueDate, caseId: caseId || null }); } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  }
  return <Modal title={t.addReminder} onClose={onClose}><form className="modal-form" onSubmit={submit}>
    <Field label={t.taskTitle} required><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} placeholder={t.taskTitle} /></Field>
    <div className="form-two"><Field label={t.dueDate}><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></Field><Field label={t.linkedCase}><select value={caseId} onChange={(event) => setCaseId(event.target.value)}><option value="">{t.noLinkedCase}</option>{cases.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field></div>
    <p className="modal-hint"><CalendarDays size={15} />{t.taskDeleteNote}</p>
    {error && <p className="inline-error">{error}</p>}<div className="modal-actions"><button type="button" className="button-secondary" onClick={onClose}>{t.cancel}</button><button type="submit" className="button-primary" disabled={busy}>{busy ? <span className="spinner" /> : <Plus size={16} />}{t.saveTask}</button></div>
  </form></Modal>;
}

function Field({ label, required, children }) {
  return <label className="field"><span>{label}{required && <i>*</i>}</span>{children}</label>;
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    function onKey(event) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><h2 id="modal-title">{title}</h2><button className="icon-btn" aria-label="Close" onClick={onClose}><X size={18} /></button></div>{children}</section></div>;
}

function CaseDetail({ t, language, item, onClose, onDelete, onAnalyze, onStatusChange }) {
  return <div className="modal-backdrop detail-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title">
    <div className="detail-head"><div className="detail-heading-icon"><Gavel size={19} /></div><button className="icon-btn" aria-label="Close" onClick={onClose}><X size={18} /></button></div>
    <span className={`status-pill ${item.status.toLowerCase()}`}>{language === "hi" ? t[`status${item.status}`] || item.status : item.status}</span>
    <h2 id="detail-title">{item.title}</h2><p className="detail-client"><Users size={15} />{item.client}</p>
    <div className="detail-actions"><button className="button-primary" onClick={() => onAnalyze(item.description || item.title)}><Sparkles size={15} />{t.analyzeThis}</button><button className="button-danger" onClick={() => onDelete(item.id)}><Trash2 size={15} />{t.delete}</button></div>
    <div className="detail-fields"><div className="detail-field"><span>{t.status}</span><select value={item.status} onChange={(event) => onStatusChange(item.id, event.target.value)}>{["Active", "Pending", "Closed"].map((status) => <option value={status} key={status}>{language === "hi" ? t[`status${status}`] : status}</option>)}</select></div><DetailField label={t.caseNumber} value={item.caseNumber} /><DetailField label={t.courtName} value={item.court} /><DetailField label={t.category} value={language === "hi" ? t[`category${item.category}`] || item.category : item.category} /><DetailField label={t.nextDate} value={dateLabel(item.nextDate, language)} /><DetailField label={t.created} value={dateLabel(item.createdAt?.slice(0, 10), language)} /></div>
    <div className="detail-description"><h3>{t.description}</h3><p>{item.description || (language === "hi" ? "कोई विवरण नहीं जोड़ा गया।" : "No description added.")}</p></div>
    <div className="detail-privacy"><ShieldCheck size={15} />{language === "hi" ? "स्थानीय डिवाइस पर सहेजा गया" : "Stored on this device"}</div>
  </section></div>;
}

function DetailField({ label, value }) {
  return <div className="detail-field"><span>{label}</span><strong>{value || "—"}</strong></div>;
}

export default App;
