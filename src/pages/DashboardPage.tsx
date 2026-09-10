import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../styles/callsheet.css";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  link: string;
  goLabel: string;
  roles: Array<"PARTICIPANT" | "ORGANIZER" | "ADMIN">;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "become-organizer",
    title: "Become an Organizer",
    description: "Apply to create and manage your own events.",
    link: "/apply-organizer",
    goLabel: "Start application",
    roles: ["PARTICIPANT"],
  },
  {
    id: "my-events",
    title: "My Events",
    description: "View, edit, and manage all your events.",
    link: "/events/mine",
    goLabel: "Open events",
    roles: ["ORGANIZER"],
  },
  {
    id: "admin-applications",
    title: "Organizer Applications",
    description: "Review and approve organizer requests.",
    link: "/admin/applications",
    goLabel: "Review queue",
    roles: ["ADMIN"],
  },
];

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const role = (user?.role ?? "PARTICIPANT") as "PARTICIPANT" | "ORGANIZER" | "ADMIN";

  const actions = QUICK_ACTIONS.filter((action) => action.roles.includes(role));

  return (
    <div className="callsheet-page">
      <div className="callsheet-container">
        <CallSheetHeader userName={user?.name} userRole={role} />

        <section className="callsheet-section">
          <div className="callsheet-section-head">
            <h2 className="callsheet-section-title">Quick Actions</h2>
            <div className="callsheet-section-rule" />
          </div>

          <div className="cue-grid">
            {actions.map((action, i) => (
              <CueCard key={action.id} action={action} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function CallSheetHeader({
  userName,
  userRole,
}: {
  userName?: string;
  userRole: string;
}) {
  return (
    <header className="callsheet-header">
      <div className="callsheet-header-stripe" />
      <div className="callsheet-header-body">
        <div>
          <p className="callsheet-eyebrow">Tonight&rsquo;s Call</p>
          <h1 className="callsheet-title">{userName ?? "Guest"}</h1>
        </div>
        <div className="callsheet-role-badge">
          <span className="callsheet-role-dot" />
          {userRole}
        </div>
      </div>
    </header>
  );
}

function CueCard({ action, index }: { action: QuickAction; index: number }) {
  const cueNumber = String(index + 1).padStart(2, "0");

  return (
    <Link
      to={action.link}
      className="cue-card"
      style={{ ["--card-delay" as string]: `${index * 80}ms` }}
    >
      <div className="cue-card-meta">
        <span className="cue-card-number">{cueNumber}</span>
        <span className="cue-card-status">
          <span className="cue-card-status-dot" />
          Ready
        </span>
      </div>

      <h3 className="cue-card-title">{action.title}</h3>
      <p className="cue-card-desc">{action.description}</p>

      <div className="cue-card-perf" />

      <span className="cue-card-go">{action.goLabel} →</span>
    </Link>
  );
}