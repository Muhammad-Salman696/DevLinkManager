// pages/api/delete-user.js
import { supabaseServer } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      // Deleting the user from the profiles table
      const { error: profileError } = await supabaseServer
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        return res.status(500).json({ error: profileError.message });
      }

      // Deleting the user from the auth table (Supabase Auth)
      const { error: authError } = await supabaseServer.auth.admin.deleteUser(userId);

      if (authError) {
        console.error('Error deleting user from auth:', authError);
        return res.status(500).json({ error: authError.message });
      }

      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Something went wrong during deletion' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
