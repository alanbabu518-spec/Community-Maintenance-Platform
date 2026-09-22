import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardPlus,
  ClipboardCheck,
  UserRoundCog,
  Megaphone,
  Building2,
  Sparkles,
  UsersRound,
} from "lucide-react";

import Navbar from "../components/ui/Navbar";
import FAQs from "../components/ui/text-reveal-faqs";
import Footer from "../components/ui/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <Navbar />

      <main>
        <section
          id="hero"
          className="relative scroll-mt-16 overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(148,163,184,0.10),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_40%)]" />
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                Smarter community maintenance
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                Keep your community
                <span className="block text-slate-500 dark:text-slate-400">
                  running smoothly.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                CommunityCare makes it simple for residents and management teams
                to report, organize, assign, track, and resolve maintenance
                issues in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/maintenance/new"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Report an Issue
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Explore Dashboard
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    24/7
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Request tracking
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    1
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Central platform
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    100%
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Digital workflow
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
                <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Maintenance Overview
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Community activity
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                      <UsersRound size={18} />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Open
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        12
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Resolved
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        28
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Water leakage
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Building A · Unit 204
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        In Progress
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Corridor light
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Building B · Floor 3
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Open
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:block">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Average response
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  2.4 hrs
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Platform Features
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Everything your community needs
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                From reporting maintenance problems to keeping residents
                informed, CommunityCare brings everyday community operations
                together.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <ClipboardPlus size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Report Issues
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Residents can quickly report maintenance problems with
                  descriptions, priorities, and supporting photos.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <ClipboardCheck size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Track Requests
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Follow every maintenance request through its complete
                  lifecycle from open to resolved.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <UserRoundCog size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Smart Assignment
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Management teams can assign maintenance requests to
                  technicians and monitor their progress.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <Megaphone size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Community Updates
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Share important announcements and keep residents updated
                  about community activities.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <Building2 size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Centralized Management
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Organize residents, buildings, units, technicians, and
                  maintenance activity from one centralized platform.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <Sparkles size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  AI-Powered Assistance
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Future AI capabilities can help summarize requests,
                  prioritize issues, and assist community management teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="workflow"
          className="scroll-mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                How It Works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                From issue to resolution
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                CommunityCare keeps every maintenance request moving through a
                clear and transparent workflow.
              </p>
            </div>

            <div className="mt-14">
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
                {[
                  ["01", "Submit", "Residents report an issue with details and photos."],
                  ["02", "Acknowledge", "Management reviews and acknowledges the request."],
                  ["03", "Assign", "The request is assigned to the appropriate technician."],
                  ["04", "Work", "The technician works on the reported maintenance issue."],
                  ["05", "Resolve", "The completed maintenance work is marked as resolved."],
                  ["06", "Close", "The request is closed after the issue has been completed."],
                ].map(([number, title, description]) => (
                  <div
                    key={number}
                    className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                      {number}
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-white">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      Have a maintenance issue?
                    </p>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Submit a request and let your community team take care
                      of the rest.
                    </p>
                  </div>

                  <Link
                    to="/maintenance/new"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Report an Issue
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  About CommunityCare
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                  One platform for better community operations
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                  CommunityCare connects residents, management teams, and
                  technicians through a centralized maintenance platform
                  designed to make everyday community operations simpler,
                  clearer, and more organized.
                </p>

                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  From the moment a resident reports an issue to the moment it
                  is resolved, everyone involved can follow the same workflow
                  and stay informed.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Residents
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Report issues, attach photos, and track maintenance
                    requests.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Management
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Organize requests, assign technicians, and monitor
                    progress.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Technicians
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    View assigned work and keep maintenance requests moving
                    toward resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQs />
      </main>


      <Footer />
    </div>
  );
}

export default Home;