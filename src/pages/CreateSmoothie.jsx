import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, GlassWater, LoaderCircle, Save, Star } from "lucide-react";
import { supabase } from "../utils/supabase";
import Header from "../components/Header";

const CreateSmoothie = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    method: "",
    rating: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

    setSubmitError("");
  }

  function validateForm() {
    const newErrors = {};
    const title = formData.title.trim();
    const method = formData.method.trim();
    const rating = Number(formData.rating);

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

    if (formData.rating.trim() === "") {
      newErrors.rating = "Rating is required.";
    } else if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
      newErrors.rating = "Rating must be between 0 and 10.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const { error } = await supabase.from("smoothies").insert({
        title: formData.title.trim(),
        method: formData.method.trim(),
        rating: Number(formData.rating),
      });

      if (error) {
        setSubmitError(error.message);
        return;
      }

      navigate("/");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />

      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
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
              Create a Smoothie
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Add a new smoothie recipe to your collection.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6 p-6 sm:p-8"
          >
            {/* Smoothie title */}
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
                placeholder="e.g. Strawberry Delight"
                maxLength={80}
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

            {/* Description */}
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
                placeholder="Describe the ingredients and how to prepare your smoothie..."
                rows={6}
                maxLength={1000}
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
                  <p className="text-sm text-gray-500">
                    Minimum 10 characters.
                  </p>
                )}

                <span className="shrink-0 text-xs text-gray-400">
                  {formData.method.length}/1000
                </span>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label
                htmlFor="rating"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Rating <span className="text-red-600">*</span>
              </label>

              <div className="relative">
                <Star
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-amber-500"
                />

                <input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="Rate from 0 to 10"
                  aria-invalid={Boolean(errors.rating)}
                  aria-describedby={
                    errors.rating ? "rating-error" : "rating-help"
                  }
                  className={`w-full rounded-lg border py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                    errors.rating
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-green-600 focus:ring-green-100"
                  }`}
                />
              </div>

              {errors.rating ? (
                <p
                  id="rating-error"
                  role="alert"
                  className="mt-1.5 text-sm text-red-600"
                >
                  {errors.rating}
                </p>
              ) : (
                <p id="rating-help" className="mt-1.5 text-sm text-gray-500">
                  Enter a rating between 0 and 10. Decimals are allowed.
                </p>
              )}
            </div>

            {/* Submission error */}
            {submitError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {submitError}
              </div>
            )}

            {/* Actions */}
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Smoothie
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateSmoothie;
