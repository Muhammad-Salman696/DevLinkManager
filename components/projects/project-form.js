import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function ProjectForm({ project = null, mode = "create" }) {
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "edit") {
      await supabase
        .from("projects")
        .update({ title, description })
        .eq("id", project.id);
    } else {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from("projects").insert([
        {
          title,
          description,
          owner_id: user.id,
        },
      ]);
    }

    setLoading(false);
    window.location.href = "/projects/manage";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project Title"
        className="border p-2 w-full"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project Description"
        className="border p-2 w-full"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : mode === "edit" ? "Update Project" : "Create Project"}
      </button>
      <Link href="/dashboard">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded mt-3 ml-3">
                    Dashboard
                    </button>
                </Link>
    </form>
  );
}
