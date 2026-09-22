import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  Home,
  UsersRound,
} from "lucide-react";
import {
  getBuildings,
  getCommunities,
  getUnits,
  type Building,
  type Community,
  type Unit,
} from "../services/location.api";
import apiClient from "../services/apiClient";
import Spinner from "../components/ui/Spinner";
import PageTransition from "../components/ui/PageTransition";

interface CompleteGoogleRegistrationResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";
    communityId: number | null;
  };
}

function GoogleSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const registrationToken = searchParams.get("token");

  const [communities, setCommunities] = useState<Community[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const [communityId, setCommunityId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [unitId, setUnitId] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!registrationToken) {
      setError(
        "Your Google registration session is missing or invalid. Please register again.",
      );
      setLoading(false);
      return;
    }

    async function loadCommunities() {
      try {
        const result = await getCommunities();

        setCommunities(result.communities);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load communities.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadCommunities();
  }, [registrationToken]);

  async function handleCommunityChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value;

    setCommunityId(value);
    setBuildingId("");
    setUnitId("");
    setBuildings([]);
    setUnits([]);
    setError("");

    if (!value) {
      return;
    }

    try {
      setLoadingBuildings(true);

      const result = await getBuildings(Number(value));

      setBuildings(result.buildings);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load buildings.",
      );
    } finally {
      setLoadingBuildings(false);
    }
  }

  async function handleBuildingChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value;

    setBuildingId(value);
    setUnitId("");
    setUnits([]);
    setError("");

    if (!value) {
      return;
    }

    try {
      setLoadingUnits(true);

      const result = await getUnits(Number(value));

      setUnits(result.units);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load units.",
      );
    } finally {
      setLoadingUnits(false);
    }
  }

  async function handleContinue(event: React.FormEvent) {
    event.preventDefault();

    if (!registrationToken) {
      setError(
        "Your Google registration session is missing or expired. Please register again.",
      );
      return;
    }

    if (!communityId) {
      setError("Please select your community.");
      return;
    }

    if (!buildingId) {
      setError("Please select your building.");
      return;
    }

    if (!unitId) {
      setError("Please select your unit.");
      return;
    }

    try {
      setError("");
      setSubmitting(true);

      await apiClient<CompleteGoogleRegistrationResponse>(
        "/auth/google/register/complete",
        {
          method: "POST",
          body: JSON.stringify({
            registrationToken,
            communityId: Number(communityId),
            buildingId: Number(buildingId),
            unitId: Number(unitId),
          }),
        },
      );

      window.location.href = "/";
      
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to complete Google registration.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-6 sm:px-6">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#0d0d0d] shadow-2xl">
          <div className="p-6 sm:p-8">
            <button
              type="button"
              onClick={() => navigate("/register")}
              disabled={submitting}
              className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft size={15} />
              Back
            </button>

            <div className="mb-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-white">
                <UsersRound size={22} />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white">
                Set up your community
              </h1>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Select your community, building, and unit to complete your
                account.
              </p>
            </div>

            <form onSubmit={handleContinue} className="space-y-4">
              {/* Community */}
              <div>
                <label
                  htmlFor="google-community"
                  className="mb-1.5 block text-xs font-medium text-slate-400"
                >
                  Community
                </label>

                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <select
                    id="google-community"
                    value={communityId}
                    onChange={handleCommunityChange}
                    disabled={loading || submitting}
                    required
                    className="h-11 w-full appearance-none rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-10 text-sm text-white outline-none transition focus:border-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="" className="bg-[#090909]">
                      {loading
                        ? "Loading communities..."
                        : "Select your community"}
                    </option>

                    {communities.map((community) => (
                      <option
                        key={community.id}
                        value={community.id}
                        className="bg-[#090909]"
                      >
                        {community.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                </div>
              </div>

              {/* Building */}
              <div>
                <label
                  htmlFor="google-building"
                  className="mb-1.5 block text-xs font-medium text-slate-400"
                >
                  Building
                </label>

                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <select
                    id="google-building"
                    value={buildingId}
                    onChange={handleBuildingChange}
                    disabled={!communityId || loadingBuildings || submitting}
                    required
                    className="h-11 w-full appearance-none rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-10 text-sm text-white outline-none transition focus:border-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="" className="bg-[#090909]">
                      {loadingBuildings
                        ? "Loading buildings..."
                        : "Select your building"}
                    </option>

                    {buildings.map((building) => (
                      <option
                        key={building.id}
                        value={building.id}
                        className="bg-[#090909]"
                      >
                        {building.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                </div>
              </div>

              {/* Unit */}
              <div>
                <label
                  htmlFor="google-unit"
                  className="mb-1.5 block text-xs font-medium text-slate-400"
                >
                  Unit
                </label>

                <div className="relative">
                  <Home
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <select
                    id="google-unit"
                    value={unitId}
                    onChange={(event) => {
                      setUnitId(event.target.value);
                      setError("");
                    }}
                    disabled={!buildingId || loadingUnits || submitting}
                    required
                    className="h-11 w-full appearance-none rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-10 text-sm text-white outline-none transition focus:border-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="" className="bg-[#090909]">
                      {loadingUnits ? "Loading units..." : "Select your unit"}
                    </option>

                    {units.map((unit) => (
                      <option
                        key={unit.id}
                        value={unit.id}
                        className="bg-[#090909]"
                      >
                        {unit.unitNumber}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-xs text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading || loadingBuildings || loadingUnits || submitting
                }
                className="flex h-11 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    Creating Account...
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default GoogleSetup;
