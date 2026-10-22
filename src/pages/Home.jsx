import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Pencil, Trash2, Plus, GlassWater } from "lucide-react";
import { supabase } from "../utils/supabase";
import Header from "../components/Header";

const Home = () => {
  const [smoothies, setSmoothies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSmoothies() {
      const { data, error } = await supabase
        .from("smoothies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setSmoothies(data);
      }

      setLoading(false);
    }

    fetchSmoothies();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this smoothie?",
    );

    if (!confirmed) return;

    const { error } = await supabase.from("smoothies").delete().eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setSmoothies((current) => current.filter((smoothie) => smoothie.id !== id));
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Header />
      <section className="p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-green-700">
              Fresh & Healthy
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              All Smoothies
            </h1>

            <p className="mt-2 text-gray-500">
              Discover and manage your favourite smoothie recipes.
            </p>
          </div>

          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-medium text-white transition hover:bg-green-800"
          >
            <Plus size={18} />
            Add Smoothie
          </Link>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-12 text-center text-gray-500">
            Loading smoothies...
          </p>
        ) : smoothies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
            <GlassWater className="mx-auto mb-4 text-green-700" size={40} />

            <h2 className="text-xl font-semibold text-gray-900">
              No smoothies yet
            </h2>

            <p className="mt-2 text-gray-500">
              Create your first smoothie recipe to get started.
            </p>

            <Link
              to="/create"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800"
            >
              <Plus size={16} />
              Create smoothie
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {smoothies.map((smoothie) => (
              <article
                key={smoothie.id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <GlassWater size={24} />
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  {smoothie.title}
                </h2>

                <p className="mt-2 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                  {smoothie.method || "No description provided."}
                </p>

                {smoothie.rating != null && (
                  <p className="mt-4 text-sm font-medium text-amber-600">
                    ★ {smoothie.rating}/10 rating
                  </p>
                )}

                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <Link
                    to={`/${smoothie.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(smoothie.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
