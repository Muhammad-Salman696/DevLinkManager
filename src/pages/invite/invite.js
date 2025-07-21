// import { useState } from "react";
// import { supabase } from "../../../lib/supabaseClient";
// import { v4 as uuidv4 } from "uuid";

// export default function InviteModal({ projectId, onClose, projectName }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [inviteLink, setInviteLink] = useState("");

//   const sendInvite = async () => {
//   setLoading(true);

//   const res = await fetch("/api/send-invite", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       email,
//       projectId,
//       projectName, // if you have it
//     }),
//   });

//   const result = await res.json();

//   if (res.ok) {
//     alert("Invitation sent!");
//     onClose(); // close modal
//   } else {
//     setError(result.error || "Failed to send invite.");
//   }

//   setLoading(false);
// };


//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
//         <h2 className="text-lg font-semibold mb-4">Invite Collaborator</h2>

//         {inviteLink ? (
//           <div>
//             <p className="mb-2">Invitation Link:</p>
//             <div className="bg-gray-100 p-2 rounded text-sm break-all">
//               {inviteLink}
//             </div>
//             <button
//               className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
//               onClick={onClose}
//             >
//               Close
//             </button>
//           </div>
//         ) : (
//           <form onSubmit={sendInvite} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Name"
//               className="w-full border p-2 rounded"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full border p-2 rounded"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <div className="flex justify-end space-x-2">
//               <button
//                 type="button"
//                 className="bg-gray-400 text-white px-4 py-2 rounded"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 disabled={loading}
//               >
//                 {loading ? "Sending..." : "Send Invite"}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState } from "react";

export default function InviteModal({ projectId, onClose, projectName }) {
  const [name, setName] = useState(""); // Optional if not used
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [error, setError] = useState("");

  const sendInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/send-invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        projectId,
        projectName,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      setInviteSent(true);
    } else {
      setError(result.error || "Failed to send invite.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Invite Collaborator</h2>

        {inviteSent ? (
          <div>
            <p className="mb-2 text-green-600 font-medium">Invitation sent successfully!</p>
            <button
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={sendInvite} className="space-y-4">
            <input
              type="text"
              placeholder="Name (optional)"
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
