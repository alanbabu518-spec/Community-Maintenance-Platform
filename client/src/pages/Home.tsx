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
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <main>
        <section
          id="hero"
          className="relative scroll-mt-16 overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.08),_transparent_40%)]" />

          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                Smarter community maintenance
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Keep your community
                <span className="block text-slate-500">
                  running smoothly.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                CommunityCare makes it simple for residents and management teams
                to report, organize, assign, track, and resolve maintenance
                issues in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/maintenance/new"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Report an Issue
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Explore Dashboard
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-200 pt-6">
                <div>
                  <p className="text-2xl font-bold text-slate-900">24/7</p>
                  <p className="text-sm text-slate-500">Request tracking</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900">1</p>
                  <p className="text-sm text-slate-500">Central platform</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-sm text-slate-500">Digital workflow</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/60">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Maintenance Overview
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Community activity
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                      <UsersRound size={18} />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">Open</p>

                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        12
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">Resolved</p>

                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        28
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Water leakage
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Building A · Unit 204
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        In Progress
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Corridor light
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Building B · Floor 3
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Open
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl sm:block">
                <p className="text-xs font-medium text-slate-500">
                  Average response
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  2.4 hrs
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-16 border-t border-slate-200 bg-slate-50"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Platform Features
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Everything your community needs
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                From reporting maintenance problems to keeping residents
                informed, CommunityCare brings everyday community operations
                together.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <ClipboardPlus size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  Report Issues
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Residents can quickly report maintenance problems with
                  descriptions, priorities, and supporting photos.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <ClipboardCheck size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  Track Requests
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Follow every maintenance request through its complete
                  lifecycle from open to resolved.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <UserRoundCog size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  Smart Assignment
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Management teams can assign maintenance requests to
                  technicians and monitor their progress.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Megaphone size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  Community Updates
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Share important announcements and keep residents updated
                  about community activities.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Building2 size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  Centralized Management
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Organize residents, buildings, units, technicians, and
                  maintenance activity from one centralized platform.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Sparkles size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  AI-Powered Assistance
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Future AI capabilities can help summarize requests,
                  prioritize issues, and assist community management teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="workflow"
          className="scroll-mt-16 border-t border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                How It Works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                From issue to resolution
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                CommunityCare keeps every maintenance request moving through a
                clear and transparent workflow.
              </p>
            </div>

            <div className="mt-14">
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    01
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-slate-900">
                    Submit
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Residents report an issue with details and photos.
                  </p>
                </div>

                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    02
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-slate-900">
                    Acknowledge
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Management reviews and acknowledges the request.
                  </p>
                </div>

                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    03
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-slate-900">
                    Assign
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The request is assigned to the appropriate technician.
                  </p>
                </div>

                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    04
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-slate-900">
                    Work
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The technician works on the reported maintenance issue.
                  </p>
                </div>

                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    05
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-slate-900">
                    Resolve
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The completed maintenance work is marked as resolved.
                  </p>
                </div>

                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    06
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-slate-900">
                    Close
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The request is closed after the issue has been completed.
                  </p>
                </div>
              </div>

              <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      Have a maintenance issue?
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Submit a request and let your community team take care
                      of the rest.
                    </p>
                  </div>

                  <Link
                    to="/maintenance/new"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
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
          className="scroll-mt-16 border-t border-slate-200 bg-slate-50"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  About CommunityCare
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  One platform for better community operations
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  CommunityCare connects residents, management teams, and
                  technicians through a centralized maintenance platform
                  designed to make everyday community operations simpler,
                  clearer, and more organized.
                </p>

                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                  From the moment a resident reports an issue to the moment it
                  is resolved, everyone involved can follow the same workflow
                  and stay informed.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    Residents
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Report issues, attach photos, and track maintenance
                    requests.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    Management
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Organize requests, assign technicians, and monitor
                    progress.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    Technicians
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
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