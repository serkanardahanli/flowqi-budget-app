// src/components/projects/ProjectList.js
import React from 'react';

const ProjectList = ({ projects }) => {
  if (projects.length === 0) {
    return <p className="text-gray-500">Geen projecten gevonden.</p>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Projecten</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarief</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uren/mnd</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Totaal/mnd</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Looptijd</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-3 whitespace-nowrap">{project.client}</td>
                <td className="px-4 py-3 whitespace-nowrap">{project.project_name}</td>
                <td className="px-4 py-3 whitespace-nowrap">€{project.hourly_rate}</td>
                <td className="px-4 py-3 whitespace-nowrap">{project.hours_per_month}</td>
                <td className="px-4 py-3 whitespace-nowrap">€{project.monthly_value || (project.hourly_rate * project.hours_per_month).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;