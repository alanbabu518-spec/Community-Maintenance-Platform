import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Droplet,
  Zap,
  Hammer,
  Sparkles,
  Wind,
  MoreHorizontal,
  ImagePlus,
  Camera,
  X,
  AlertTriangle,
  Home,
} from "lucide-react";
import PageTransition from "../components/ui/PageTransition";
import useCreateMaintenanceRequest from "../features/maintenance/hooks/useCreateMaintenanceRequest";
import { useAuth } from "../context/AuthContext";

const CATEGORY_OPTIONS = [
  { value: "PLUMBING", label: "Plumbing", icon: Droplet },
  { value: "ELECTRICAL", label: "Electrical", icon: Zap },
  { value: "CARPENTRY", label: "Carpentry", icon: Hammer },
  { value: "CLEANING", label: "Cleaning", icon: Sparkles },
  { value: "HVAC", label: "HVAC", icon: Wind },
  { value: "OTHER", label: "Other", icon: MoreHorizontal },
] as const;

const PRIORITY_OPTIONS = [
  {
    value: "LOW",
    label: "Low",
    hint: "No rush",
    dot: "bg-emerald-500",
    ring: "ring-emerald-500/30 border-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    hint: "Within a few days",
    dot: "bg-amber-500",
    ring: "ring-amber-500/30 border-amber-500",
    text: "text-amber-700 dark:text-amber-400",
  },
  {
    value: "HIGH",
    label: "High",
    hint: "Needs attention soon",
    dot: "bg-orange-500",
    ring: "ring-orange-500/30 border-orange-500",
    text: "text-orange-700 dark:text-orange-400",
  },
  {
    value: "URGENT",
    label: "Urgent",
    hint: "Immediate attention",
    dot: "bg-red-500",
    ring: "ring-red-500/30 border-red-500",
    text: "text-red-700 dark:text-red-400",
  },
] as const;

function ReportIssue() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [priority, setPriority] = useState("");
  const { user, loading: authLoading } = useAuth();
  const unitId = user?.unitId ?? null;
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const createRequest = useCreateMaintenanceRequest();

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!title.trim()) {
      nextErrors.title = "Please enter an issue title.";
    }

    if (!description.trim()) {
      nextErrors.description = "Please describe the issue.";
    }

    if (!category) {
      nextErrors.category = "Please select a category.";
    }

    if (category === "OTHER" && !otherCategory.trim()) {
      nextErrors.otherCategory = "Please specify the issue category.";
    }

    if (!priority) {
      nextErrors.priority = "Please select a priority.";
    }

    if (!unitId) {
      nextErrors.unitId = "Your unit information is not available.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    if (!unitId) {
      return;
    }

    const requestData = {
      title,
      description,
      category: category === "OTHER" ? otherCategory : category,
      priority: priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      unitId,
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
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit your maintenance request. Please try again.",
      );
    }
  };

  const handleCancel = () => {
    navigate("/maintenance");
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    const maxFileSize = 5 * 1024 * 1024; 

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxFileSize) {
        return false;
      }

      return file.type.startsWith("image/");
    });

    setPhotos((currentPhotos) => {
      const combinedPhotos = [...currentPhotos, ...validFiles];

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

  useEffect(() => {
    const previewUrls = photos.map((photo) => URL.createObjectURL(photo));

    setPhotoPreviews(previewUrls);

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Home className="h-4 w-4" />
            <span>Maintenance</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Report an issue
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Tell us what's wrong and where — the maintenance team will take it
            from there.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{submitError}</p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              What's going on?
            </h2>

            <div className="mt-5">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Title
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

              {errors.title && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Where is the problem, when did it start, anything else that helps..."
                className="mt-2 block w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white dark:focus:ring-white/10"
              />

              {errors.description && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Category
            </h2>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {CATEGORY_OPTIONS.map(({ value, label, icon: Icon }) => {
                const isSelected = category === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCategory(value)}
                    aria-pressed={isSelected}
                    className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium leading-tight">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {errors.category && (
              <p className="mt-3 text-xs text-red-600 dark:text-red-400">
                {errors.category}
              </p>
            )}

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
                  onChange={(event) => setOtherCategory(event.target.value)}
                  placeholder="e.g. Pest control, security issue..."
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white dark:focus:ring-white/10"
                />

                {errors.otherCategory && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {errors.otherCategory}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Priority
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRIORITY_OPTIONS.map(
                ({ value, label, hint, dot, ring, text }) => {
                  const isSelected = priority === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPriority(value)}
                      aria-pressed={isSelected}
                      className={`rounded-xl border px-3 py-3 text-left transition ${
                        isSelected
                          ? `bg-slate-50 ring-2 dark:bg-slate-800/60 ${ring}`
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${dot}`} />
                        <span
                          className={`text-sm font-semibold ${
                            isSelected
                              ? text
                              : "text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {label}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                        {hint}
                      </span>
                    </button>
                  );
                },
              )}
            </div>

            {errors.priority && (
              <p className="mt-3 text-xs text-red-600 dark:text-red-400">
                {errors.priority}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <label
              htmlFor="unitId"
              className="text-base font-semibold text-slate-900 dark:text-white"
            >
              Unit
            </label>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Where is the issue located?
            </p>

            <div className="mt-4 block w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              {authLoading
                ? "Loading your unit..."
                : (user?.unitNumber ?? "Unit information unavailable")}
            </div>

            {errors.unitId && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                {errors.unitId}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Photos
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add up to 5 photos to help explain the issue ({photos.length}/5).
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900 sm:hidden">
                <Camera className="h-4 w-4" />
                <span>Take photo</span>

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900">
                <ImagePlus className="h-4 w-4" />
                <span>Choose from device</span>

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
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((photo, index) => (
                  <div
                    key={`${photo.name}-${photo.lastModified}-${index}`}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
                  >
                    <img
                      src={photoPreviews[index]}
                      alt={`Selected issue ${index + 1}`}
                      className="h-28 w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/70 to-transparent px-2 py-1.5 text-[11px] font-medium text-white">
                      {photo.name}
                    </div>

                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      aria-label={`Remove ${photo.name}`}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={createRequest.isPending}
              className="w-full rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createRequest.isPending}
              className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
            >
              {createRequest.isPending ? "Submitting..." : "Report issue"}
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}

export default ReportIssue;
