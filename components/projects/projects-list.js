import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ProjectCard from './project-card';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error.message);
      } else {
        setProjects(data);
      }

      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleDelete = (id)=>{
    setProjects((prev) => prev.filter((project) => project.id !== id));
  }

  if (loading) return <p className="text-center">Loading projects...</p>;
  if (!projects.length) return <p className="text-center">No projects yet.</p>;

  return (
    <div className="grid gap-4">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
      ))}
    </div>
  );
}
