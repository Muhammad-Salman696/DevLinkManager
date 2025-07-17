import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { formStyles } from "../../lib/styles";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const [action, setAction] = useState("deactivate");
  const [loading, setLoading] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
  ];

    useEffect(() => {
    async function fetchProfile() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        router.push('/login');
        return;
      }

      setUser(authData?.user)

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (error || !profileData) {
        router.push('/profile-setup');
      } else {
        setProfile(profileData);
      }
    }

    fetchProfile();
  }, []);

  const toggleNav = () => {
    setIsProfileOpen(false);
    setIsNavOpen((prev) => !prev);
  };

  const toggleProfile = () => {
    setIsNavOpen(false);
    setIsProfileOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut(); // Add await
    if (error) alert(error.message);
    else window.location.href = "/login"; // Full reload to clear state
  };

  const handleEditRoute = ()=>{
    router.push('/edit-profile')
  };

  const handleAccountAction = async (e) => {
    e.preventDefault();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Not authenticated.");
      router.push("/login");
      return;
    }

    if (action === "deactivate") {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "inactive" })
        .eq("user_id", user.id);

      if (error) {
        alert("Deactivation failed: " + error.message);
      } else {
        alert("Profile deactivated. You'll be logged out.");
        await supabase.auth.signOut();
        router.push("/reactivate");
      }
    } else if (action === "delete") {
        if (!confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
        return;
        }

        const res = await fetch("/api/delete-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        const result = await res.json();

        if (res.ok) {
          alert("Account deleted permanently.");
          router.push("/signup");
        } else {
          alert("Error: " + result.error);
        }
    }
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center relative">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-gray-800">
        DevLinkHub
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-gray-700 hover:text-blue-600"
          >
            {link.name}
          </Link>
        ))}

        {/* Profile dropdown for desktop */}
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Mobile toggle buttons */}
      <div className="md:hidden flex items-center gap-4">
        <button onClick={toggleNav}>
          {isNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <button onClick={toggleProfile}>
          <User size={24} />
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isNavOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden z-40">
          <ul className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setIsNavOpen(false)}
                  className="block text-gray-700 hover:text-blue-600"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mobile Profile Sidebar */}
      {isProfileOpen && profile && (
        <div className="absolute top-14 right-0 w-68 shadow-lg  z-40 p-4 bg-gray-200">
          <div>
              <h1 className={formStyles.title}>{profile.full_name}</h1>
              <img className={formStyles.avatar} src={profile.avatar_url} alt="Avatar" />
              
            </div>
            
                <button onClick={handleEditRoute} className={formStyles.button}>Edit Account</button>
                <br />
                <button 
                    onClick={handleSignOut} 
                    disabled={loading}
                    className={formStyles.button}
                    >
                    {loading ? "Signing out..." : "Sign Out"}
                </button>
                <br />

                <form className={formStyles.form} onSubmit={handleAccountAction}>
                    <h3 className={formStyles.title}>Account Actions</h3>
                    <select value={action} onChange={(e) => setAction(e.target.value)}>
                        <option value="deactivate">Deactivate Profile</option>
                        <option value="delete">Permanently Delete Account</option>
                    </select>
                    <button type="submit" className={formStyles.button}>
                        Proceed
                    </button>
                </form>
            
        </div>
      )}
    </nav>
  );
}
