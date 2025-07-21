
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";

export default function InvitePage() {
  const router = useRouter();
  const { token } = router.query;

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchInvite = async () => {
      const { data, error } = await supabase
        .from("invites")
        .select("*")
        .eq("token", token)
        .single();

      if (error || !data) {
        setError("Invalid or expired invite link.");
        setLoading(false);
        return;
      }

      // Check if expired
      const now = new Date();
      const createdAt = new Date(data.created_at);

      const fifteenMinutesLater = new Date(createdAt.getTime() + 15 * 60 * 1000);

      if (data.used || now >= fifteenMinutesLater) {
        setError("This invite link has expired or was already used.");
        setLoading(false);
        return;
      }

      setInvite(data);
      setLoading(false);
    };

    fetchInvite();
  }, [token]);

  const handleAccept =async () => {
    // Save token in localStorage for session tracking
    localStorage.setItem("active_invite_token", token);
    localStorage.setItem("invited_project_id", invite.project_id);

    // ✅ Step 1: Get logged-in user ID
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        const userId = user?.id;

        const { error: insertError } = await supabase
        .from("project_collaborators")
        .insert({
        project_id: invite.project_id,
        user_id: userId,
        });

    if (insertError) {
        setError("Failed to join project. Try again.");
        setLoading(false);
        return;
    }

    await supabase
    .from("invites")
    .update({ used: true })
    .eq("token", token);

    // Redirect to project chat or dashboard page
    router.push(`/projects/${invite.project_id}/chat`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-2xl font-semibold mb-4">You’ve been invited!</h1>
      <p className="mb-6">Project: <strong>{invite.project_name}</strong></p>
      <button
        onClick={handleAccept}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Accept & Join Chat
      </button>
    </div>
  );
}
