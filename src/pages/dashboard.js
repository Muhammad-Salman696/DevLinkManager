
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import AuthGuard from "../../components/AuthGuard"; 
import { useRouter } from "next/router";
import DashboardLayout from "../../components/layouts/dashboard-layout";
import { formStyles } from "../../lib/styles";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }
    }

    fetchProfile();
  }, []);

  return (
    <AuthGuard> 
      <DashboardLayout>
      <h1 className={formStyles.title}>Welcome to your dashboard!</h1>
      <p className="text-gray-600">Manage your projects and profile here.</p>
      <div className="flex justify-between items-center ">

        <div className="flex gap-2">
          <Link href="/projects/create">
            <button className={formStyles.button}>
              + New Project
            </button>
          </Link>

          <Link href="/projects/manage">
            <button className={formStyles.button}>
              View and Manage Projects
            </button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
    </AuthGuard>
  );
}