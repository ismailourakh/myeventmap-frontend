import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../styles/styles.css";

interface QuickAction {
  id: string;
  icon: string;
  title: string;
  description: string;
  link: string;
  roles: string[];
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "become-organizer",
    icon: "🚀",
    title: "Become an Organizer",
    description: "Apply to create and manage your own events.",
    link: "/apply-organizer",
    roles: ["USER"],
  },
  {
    id: "my-events",
    icon: "📅",
    title: "My Events",
    description: "View, edit, and manage all your events.",
    link: "/events/mine",
    roles: ["ORGANIZER"],
  },
  {
    id: "admin-applications",
    icon: "🛡️",
    title: "Organizer Applications",
    description: "Review and approve organizer requests.",
    link: "/admin/applications",
    roles: ["ADMIN"],
  },
];

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const filteredActions = QUICK_ACTIONS.filter((action) => {
    if (user?.role === "ORGANIZER") {
      return action.roles.includes("ORGANIZER");
    }
    if (user?.role === "ADMIN") {
      return action.roles.includes("ADMIN");
    }
    return action.roles.includes("USER");
  });

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <DashboardHeader userName={user?.name} userRole={user?.role} />

        {/* Quick Actions */}
        <QuickActionsSection actions={filteredActions} />
      </div>
    </div>
  );
}

interface DashboardHeaderProps {
  userName?: string;
  userRole?: string;
}

function DashboardHeader({ userName, userRole }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header text-white">
      <div className="dashboard-header-content">
        <p className="dashboard-header-greeting">Welcome back 👋</p>
        <h1 className="dashboard-header-title">{userName}</h1>
        <div className="dashboard-header-badge">{userRole}</div>
      </div>
    </header>
  );
}

interface QuickActionsSectionProps {
  actions: QuickAction[];
}

function QuickActionsSection({ actions }: QuickActionsSectionProps) {
  return (
    <section className="quick-actions-section">
      <h2 className="section-title">Quick Actions</h2>
      <div className="action-grid">
        {actions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>
    </section>
  );
}

interface ActionCardProps {
  action: QuickAction;
}

function ActionCard({ action }: ActionCardProps) {
  return (
    <Link to={action.link} className="action-card">
      <div className="action-card-icon">{action.icon}</div>
      <h3 className="action-card-title">{action.title}</h3>
      <p className="action-card-description">{action.description}</p>
    </Link>
  );
}
