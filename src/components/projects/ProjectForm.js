// src/components/projects/ProjectForm.js
import React, { useState } from 'react';

const ProjectForm = ({ onSubmit }) => {
  const [project, setProject] = useState({
    client: '',
    project_name: '',
    hourly_rate: 0,
    hours_per_month: 0,
    start_date: '',
    end_date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedProject = {
      ...project,
      hourly_rate: parseFloat(project.hourly_rate),
      hours_per_month: parseInt(project.hours_per_month),
      monthly_value: parseFloat(project.hourly_rate) * parseInt(project.hours_per_month)
    };
    onSubmit(formattedProject);
    // Reset form
    setProject({
      client: '',
      project_name: '',
      hourly_rate: 0,
      hours_per_month: 0,
      start_date: '',
      end_date: ''
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Nieuw Project Toevoegen</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="client"
            placeholder="Klant"
            className="p-2 border rounded"
            value={project.client}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="project_name"
            placeholder="Project Naam"
            className="p-2 border rounded"
            value={project.project_name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="hourly_rate"
            placeholder="Uurtarief"
            className="p-2 border rounded"
            value={project.hourly_rate}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
          <input
            type="number"
            name="hours_per_month"
            placeholder="Uren per maand"
            className="p-2 border rounded"
            value={project.hours_per_month}
            onChange={handleChange}
            min="0"
            required
          />
          <input
            type="date"
            name="start_date"
            placeholder="Startdatum"
            className="p-2 border rounded"
            value={project.start_date}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="end_date"
            placeholder="Einddatum"
            className="p-2 border rounded"
            value={project.end_date}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Project Toevoegen
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;