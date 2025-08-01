import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import InviteModal from "@/pages/invite/invite";


export default function ProjectCard({ project, onDelete }) {
    const [loading, setLoading] = useState(false);
    const [ showInvite, setShowInvite] = useState(false);

    const handleDelete = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    setLoading(false);
    if (!error) {
      onDelete(project.id); // notify parent to remove from list
    } else {
      alert("Failed to delete project");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
      <h3 className="text-lg font-bold">{project.title}</h3>
      <p className="text-sm text-gray-600">{project.description}</p>
      <div className="mt-2 flex gap-3">
        <Link href={`/projects/edit/${project.id}`}>
          <button className="bg-yellow-600 text-white px-3 py-1 rounded">
            Edit
          </button>
        </Link>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
        <button
          onClick={() => setShowInvite(true)} // when clicked, show the form
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Invite
        </button>
        {showInvite && (<InviteModal projectId={project.id} onClose={()=> setShowInvite(false)} projectName={project.title} />)}
      </div>
    </div>
  );
}
