import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { formStyles } from '../../lib/styles';

export default function ProfileSetup() {
  const [fullName, setFullName] = useState('');
  const [profileName, setProfileName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null); // ✅ use null instead of empty string for a file
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');


  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Auth error:", error.message);
        router.push('/login');
        return;
      }

      if (!data.user) {
        router.push('/login');
      } else {
        setUser(data.user); // ✅ Fix: assign the actual user
        console.log('Authenticated user ID:', data.user.id);
      }
    }

    fetchUser();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not found");
      return;
    }

    let avatar_url = '';

    if (avatarFile) {
  const fileExt = avatarFile.name.split('.').pop();
  const fileName = `${user.id}.${fileExt}`;
  const filePath = `${fileName}`; // Example: "4eae43b1.jpg"

  // ✅ Step 1: Remove the file if it exists (to avoid 400 error)
  await supabase.storage.from('avatars').remove([filePath]);

  // ✅ Step 2: Upload new file
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, avatarFile);

  if (uploadError) {
    alert('Upload failed: ' + uploadError.message);
    return;
  }

  // ✅ Step 3: Get public URL
  const { data } = await supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  avatar_url = data.publicUrl;
}



    // ✅ Insert profile info into the 'profiles' table
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: user.id,
          full_name: fullName,
          profile_name: profileName,
          avatar_url: avatar_url,
        },
      ]);

    if (insertError) {
      alert('Profile creation failed: ' + insertError.message);
    } else {
      router.push('/dashboard'); // ✅ Redirect to dashboard on success
    }
  };

  return (
    <form onSubmit={handleSubmit} className={formStyles.form}>
      <h3 className={formStyles.title}>Profile Setup</h3>
      <input
        className={formStyles.input}
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <input
        className={formStyles.input}
        type="text"
        placeholder="Profile Name"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        required
      />
      {/* <input
        type="file"
        accept="image/*"
        onChange={(e) => setAvatarFile(e.target.files[0])}
      /> */}

      <label
          htmlFor="avatar"
          className={formStyles.avatar}
        >
          Choose File
        </label>

        <input
        className="hidden"
        id="avatar"
        type="file"
        accept="image/*"
        // onChange={(e) => setAvatarFile(e.target.files[0])}
        onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
                setAvatarFile(file);
                setAvatarUrl(URL.createObjectURL(file)); // Show preview immediately
            }
            }}

      />

      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar"
          width={100}
          style={{ marginTop: '10px', borderRadius: '50%' }}
        />
      )}

      <button className={formStyles.button} type="submit">Create Profile</button>
    </form>
  );
}

      