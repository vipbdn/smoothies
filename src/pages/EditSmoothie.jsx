import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, GlassWater, LoaderCircle, Save } from "lucide-react";
import { supabase } from "../utils/supabase";

const EditSmoothie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    method: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");

  // Fetch the smoothie and populate the form.
  useEffect(() => {
    async function fetchSmoothie() {
      setLoading(true);
      setPageError("");

      const { data, error } = await supabase
        .from("smoothies")
        .select("id, title, method")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        setPageError(error.message);
      } else if (!data) {
        setPageError("Smoothie not found.");
      } else {
        setFormData({
          title: data.title ?? "",
          method: data.method ?? "",
        });
      }

      setLoading(false);
    }

    fetchSmoothie();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  function validateForm() {
    const newErrors = {};
    const title = formData.title.trim();
    const method = formData.method.trim();

    if (!title) {
      newErrors.title = "Smoothie title is required.";
    } else if (title.length < 3) {
      newErrors.title = "Title must contain at least 3 characters.";
    } else if (title.length > 80) {
      newErrors.title = "Title cannot exceed 80 characters.";
    }

    if (!method) {
      newErrors.method = "Description is required.";
    } else if (method.length < 10) {
      newErrors.method = "Description must contain at least 10 characters.";
    } else if (method.length > 1000) {
      newErrors.method = "Description cannot exceed 1000 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setPageError("");

    try {
      const { data, error } = await supabase
        .from("smoothies")
        .update({
          title: formData.title.trim(),
          method: formData.method.trim(),
        })
        .eq("id", id)
        .select("id")
        .maybeSingle();

      if (error) {
        setPageError(error.message);
        return;
      }

      if (!data) {
        setPageError(
          "No smoothie was updated. Check that it exists and that your update policy allows this operation.",
        );
        return;
      }

      navigate("/");
    } catch {
      setPageError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-gray-500">
        <LoaderCircle size={20} className="animate-spin" />
        Loading smoothie...
      </div>
    );
  }

  if (pageError && !formData.title && !formData.method) {
    return (
      <section className="mx-auto max-w-2xl py-12">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-semibold text-red-800">
            Unable to load smoothie
          </h1>
          <p className="mt-2 text-sm text-red-700">{pageError}</p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 font-medium text-green-700 hover:text-green-800"
          >
            <ArrowLeft size={18} />
            Back to smoothies
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl py-8 sm:py-12">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
      >
        <ArrowLeft size={18} />
        Back to smoothies
      </Link>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-green-50/70 px-6 py-6 sm:px-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <GlassWater size={26} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Edit Smoothie
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Update your smoothie title and description.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6 p-6 sm:p-8"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Smoothie title <span className="text-red-600">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              maxLength={80}
              placeholder="e.g. Strawberry Delight"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
              className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                errors.title
                  ? "border-red-400 focus:ring-red-100"
                  : "border-gray-300 focus:border-green-600 focus:ring-green-100"
              }`}
            />

            <div className="mt-1.5 flex justify-between gap-3">
              {errors.title ? (
                <p
                  id="title-error"
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {errors.title}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Give your smoothie a clear name.
                </p>
              )}

              <span className="shrink-0 text-xs text-gray-400">
                {formData.title.length}/80
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="method"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description <span className="text-red-600">*</span>
            </label>

            <textarea
              id="method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              rows={6}
              maxLength={1000}
              placeholder="Describe the ingredients and preparation..."
              aria-invalid={Boolean(errors.method)}
              aria-describedby={errors.method ? "method-error" : undefined}
              className={`w-full resize-y rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                errors.method
                  ? "border-red-400 focus:ring-red-100"
                  : "border-gray-300 focus:border-green-600 focus:ring-green-100"
              }`}
            />

            <div className="mt-1.5 flex justify-between gap-3">
              {errors.method ? (
                <p
                  id="method-error"
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {errors.method}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Minimum 10 characters.</p>
              )}

              <span className="shrink-0 text-xs text-gray-400">
                {formData.method.length}/1000
              </span>
            </div>
          </div>

          {pageError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {pageError}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditSmoothie;
