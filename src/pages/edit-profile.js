import { useState, useEffect  } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import { formStyles } from "../../lib/styles";

export default function UpdateProfile (){
    const [fullName, setFullName] = useState('');
    const [profileName, setProfileName] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect (()=>{
        async function fetchUser() {
            const { data : authData} = await supabase.auth.getUser();
            const user = authData.user;

            if(!user) return router.push("/login");
            setUser(user);

            const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

            if(error){
                alert(error.message)
                router.push('/login')
            }
            setFullName(data.full_name);
            setProfileName(data.profile_name);
            setAvatarUrl(data.avatar_url);
        }

        fetchUser();
    },[]);

    const handleUpdate = async(e) =>{
        e.preventDefault();
        let updatedAvatarUrl = avatarUrl;
        
        if(avatarFile){
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = fileName;

            const { error : uploadError} = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile);

            if(uploadError){
                alert('Upload fialed! '+ uploadError.message)
                return;
            }

            const { data } = await supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

            updatedAvatarUrl = data.publicUrl;

        }
         const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                profile_name: profileName,
                avatar_url: updatedAvatarUrl,
            })
            .eq('user_id', user.id);

            if (error) {
            alert('Update failed: ' + error.message);
            } else {
            alert('Profile updated!');
            router.push('/dashboard');
            }
    };

    const handleDashboard = ()=>{
        router.push("/dashboard")
    }
    return (
    <form onSubmit={handleUpdate} className={formStyles.form}>
      <h3 className={formStyles.title}>Edit Profile</h3>
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
      <button type="submit" className={formStyles.button}>Update Profile</button>
      <button type="button" onClick={handleDashboard} className={formStyles.button}>
                Dashboard
            </button>
    </form>
  );
}