// src/pages/projects.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectList from '../components/projects/ProjectList';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (project) => {
    try {
      const { error } = await supabase.from('projects').insert([project]);
      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      alert(`Fout bij toevoegen project: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Consultancy Projecten</h1>
      <div className="grid grid-cols-1 gap-6">
        <ProjectForm onSubmit={handleAddProject} />
        {loading ? (
          <p>Projecten laden...</p>
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;