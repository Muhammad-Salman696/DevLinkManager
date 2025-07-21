import { supabase } from "../../../lib/supabaseClient";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, projectId, projectName } = req.body;

  if (!email || !projectId || !projectName) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  // ✅ Log fields before insert
  console.log("📤 Inserting invite:", { email, projectId, projectName, token, expiresAt });

  // 🛠 Insert into invites
  const { error } = await supabase.from("invites").insert({
    email,
    project_id: projectId,
    project_name: projectName,
    token,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("❌ Supabase insert error:", error);
    return res.status(500).json({ error: "Failed to create invite." });
  }

try {
  const inviteLink = `${req.headers.origin}/invite/${token}`;

  const { data, error: emailError } = await resend.emails.send({
    from: "onboarding@resend.dev", // ✅ Must be a verified domain/sender in Resend
    to: email,
    subject: `You're invited to join project "${projectName}"`,
    html: `
      <p>You’ve been invited to collaborate on <strong>${projectName}</strong>.</p>
      <p><a href="${inviteLink}">Click here to accept the invitation</a>.</p>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  if (emailError) {
    console.error("❌ Resend email error:", emailError);
    return res.status(500).json({ error: "Invite created but email failed to send." });
  }

  return res.status(200).json({ message: "Invitation sent successfully." });

} catch (err) {
  console.error("❌ Email sending failed:", err.message);
  return res.status(500).json({ error: "Unexpected error while sending email." });
}
}
