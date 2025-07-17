import ProjectForm from "../../../components/projects/project-form";
import { useUser } from "@supabase/auth-helpers-react";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/layouts/dashboard-layout";

export default function CreateProjectPage() {
  const user = useUser();

  if (!user) return <div>Loading...</div>;

  return (
    <AuthGuard>
        <DashboardLayout>
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">Create New Project</h1>
                <ProjectForm userId={user.id} />
            </div>
            
        </DashboardLayout>

    </AuthGuard>
    
  );
}
