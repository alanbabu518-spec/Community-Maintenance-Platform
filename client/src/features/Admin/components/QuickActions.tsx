import { ArrowRight, BellPlus, ClipboardList, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

function QuickActions() {
  const actions = [
    {
      title: "Add Staff",
      description: "Create a manager or technician account.",
      icon: UserPlus,
      href: "/staff",
    },
    {
      title: "Create Announcement",
      description: "Publish an announcement to a community.",
      icon: BellPlus,
      href: "/announcements/new",
    },
    {
      title: "View Maintenance",
      description: "Review and manage maintenance requests.",
      icon: ClipboardList,
      href: "/maintenance",
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Common administrative actions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
              </div>

              <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">
                {action.title}
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActions;
