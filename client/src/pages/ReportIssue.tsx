import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/ui/PageTransition";
import useCreateMaintenanceRequest from "../features/maintenance/hooks/useMaintenanceRequest";
import useUnits from "../features/maintenance/hooks/useUnits";

function ReportIssue() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [unitId, setUnitId] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const createRequest = useCreateMaintenanceRequest();
  const { data, isLoading: unitsLoading } = useUnits();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requestData = {
      title,
      description,
      category: category === "OTHER" ? otherCategory : category,
      priority: priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      unitId: Number(unitId),
    };

    try {
      await createRequest.mutateAsync(requestData);

      navigate("/maintenance", {
        state: {
          successMessage: "Your issue has been submitted successfully.",
          successDescription:
            "The maintenance team can now review and process your request.",
        },
      });
    } catch (error) {
      console.error("Failed to create maintenance request:", error);
    }
  };
  const handleCancel = () => {
    navigate("/maintenance");
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">Maintenance</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Report an Issue
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Tell us about a maintenance issue in your home or community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Issue Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Provide enough information so the maintenance team can understand
              the problem.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700"
            >
              Issue Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Water leakage in bathroom"
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />

            <p className="mt-2 text-xs text-slate-500">
              Give your issue a short and clear title.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the issue in detail..."
              className="mt-2 block w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />

            <p className="mt-2 text-xs text-slate-500">
              Include details such as where the problem is and when you noticed
              it.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="PLUMBING">Plumbing</option>
              <option value="ELECTRICAL">Electrical</option>
              <option value="CARPENTRY">Carpentry</option>
              <option value="CLEANING">Cleaning</option>
              <option value="HVAC">HVAC</option>
              <option value="OTHER">Other</option>
            </select>

            {category === "OTHER" && (
              <div className="mt-4">
                <label
                  htmlFor="otherCategory"
                  className="block text-sm font-medium text-slate-700"
                >
                  Please specify
                </label>

                <input
                  id="otherCategory"
                  name="otherCategory"
                  type="text"
                  value={otherCategory}
                  onChange={(event) => setOtherCategory(event.target.value)}
                  placeholder="e.g. Pest control, security issue..."
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Please tell us what type of issue you are reporting.
                </p>
              </div>
            )}

            <p className="mt-2 text-xs text-slate-500">
              Choose the category that best describes the issue.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-slate-700"
            >
              Priority
            </label>

            <select
              id="priority"
              name="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="" disabled>
                Select priority
              </option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Select urgent only when the issue requires immediate attention.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="unitId"
              className="block text-sm font-medium text-slate-700"
            >
              Unit
            </label>

            <select
              id="unitId"
              name="unitId"
              value={unitId}
              onChange={(event) => setUnitId(event.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="" disabled>
                {unitsLoading ? "Loading units..." : "Select your unit"}
              </option>

              {data?.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unitNumber}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Select the unit where the issue is located.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-slate-700"
            >
              Photo
            </label>

            <div className="mt-2 rounded-xl border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-slate-400">
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
              />

              <p className="mt-3 text-xs text-slate-500">
                Upload a photo that helps explain the issue.
              </p>

              {photo && (
                <p className="mt-2 text-xs font-medium text-slate-700">
                  Selected: {photo.name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
            >
              Report Issue
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}

export default ReportIssue;
