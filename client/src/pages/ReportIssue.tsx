import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/ui/PageTransition";
import useUnits from "../features/maintenance/hooks/useUnits";
import useCreateMaintenanceRequest from "../features/maintenance/hooks/useCreateMaintenanceRequest";

function ReportIssue() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [unitId, setUnitId] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const createRequest = useCreateMaintenanceRequest();
  const { data, isLoading: unitsLoading } = useUnits();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const requestData = {
      title,
      description,
      category: category === "OTHER" ? otherCategory : category,
      priority: priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      unitId: Number(unitId),
      photos,
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

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    setPhotos((currentPhotos) => {
      const combinedPhotos = [...currentPhotos, ...selectedFiles];

      const uniquePhotos = combinedPhotos.filter(
        (photo, index, array) =>
          index ===
          array.findIndex(
            (item) =>
              item.name === photo.name &&
              item.size === photo.size &&
              item.lastModified === photo.lastModified,
          ),
      );

      return uniquePhotos.slice(0, 5);
    });

    event.target.value = "";
  };

  const removePhoto = (indexToRemove: number) => {
    setPhotos((currentPhotos) =>
      currentPhotos.filter((_, index) => index !== indexToRemove),
    );
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Maintenance
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Report an Issue
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Tell us about a maintenance issue in your home or community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Issue Details
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Provide enough information so the maintenance team can
              understand the problem.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
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
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white dark:focus:ring-white/10"
            />

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Give your issue a short and clear title.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
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
              className="mt-2 block w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white dark:focus:ring-white/10"
            />

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Include details such as where the problem is and when you
              noticed it.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
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
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Please specify
                </label>

                <input
                  id="otherCategory"
                  name="otherCategory"
                  type="text"
                  value={otherCategory}
                  onChange={(event) =>
                    setOtherCategory(event.target.value)
                  }
                  placeholder="e.g. Pest control, security issue..."
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white dark:focus:ring-white/10"
                />

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Please tell us what type of issue you are reporting.
                </p>
              </div>
            )}

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Choose the category that best describes the issue.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Priority
            </label>

            <select
              id="priority"
              name="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
            >
              <option value="" disabled>
                Select priority
              </option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Select urgent only when the issue requires immediate
              attention.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="unitId"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Unit
            </label>

            <select
              id="unitId"
              name="unitId"
              value={unitId}
              onChange={(event) => setUnitId(event.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
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

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Select the unit where the issue is located.
            </p>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Photos
            </label>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Add up to 5 photos to help explain the issue.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900 sm:hidden">
                <span className="text-lg">📷</span>
                <span>Take Photo</span>

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>

              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900">
                <span className="text-lg">📁</span>
                <span>Choose from Device</span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            {photos.length > 0 && (
              <div className="mt-4 space-y-3">
                {photos.map((photo, index) => (
                  <div
                    key={`${photo.name}-${photo.lastModified}-${index}`}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Selected issue ${index + 1}`}
                        className="h-20 w-20 shrink-0 rounded-lg object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                          {photo.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Photo {index + 1} of {photos.length}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createRequest.isPending}
              className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
            >
              {createRequest.isPending ? "Submitting..." : "Report Issue"}
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}

export default ReportIssue;