import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProjectForm from "../../../../components/projects/project-form";
import { supabase } from "../../../../lib/supabaseClient";
import AuthGuard from "../../../../components/AuthGuard";
import DashboardLayout from "../../../../components/layouts/dashboard-layout";

export default function EditProject() {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (!error) setProject(data);
      };

      fetchProject();
    }
  }, [id]);

  return (

    <AuthGuard>
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
                {project && <ProjectForm project={project} mode="edit" />}
            </div>
        </DashboardLayout>
    </AuthGuard>
    
  );
}
