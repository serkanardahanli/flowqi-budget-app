import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState('clients');
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });

  useEffect(() => {
    fetchClients();
    fetchProjects();
    fetchSubscriptions();
  }, []);

  const fetchClients = async () => {
    try {
      // Mockdata voor demonstratiedoeleinden
      // In echte implementatie: haal data op uit Supabase
      // const { data, error } = await supabase.from('clients').select('*');
      // if (error) throw error;
      
      const mockClients = [
        { id: 1, name: 'ABC Corporation', contact_person: 'John Doe', email: 'john@abc.com', phone: '0201234567', address: 'Amsterdam', status: 'active', created_at: '2023-05-15' },
        { id: 2, name: 'XYZ Solutions', contact_person: 'Jane Smith', email: 'jane@xyz.com', phone: '0301234567', address: 'Rotterdam', status: 'active', created_at: '2023-06-20' },
        { id: 3, name: 'Tech Innovators', contact_person: 'Robert Johnson', email: 'robert@tech.com', phone: '0401234567', address: 'Utrecht', status: 'inactive', created_at: '2023-04-10' },
        { id: 4, name: 'Design Masters', contact_person: 'Emma Williams', email: 'emma@design.com', phone: '0501234567', address: 'Den Haag', status: 'active', created_at: '2023-07-05' },
        { id: 5, name: 'Global Services', contact_person: 'Michael Brown', email: 'michael@global.com', phone: '0601234567', address: 'Eindhoven', status: 'active', created_at: '2023-08-12' },
      ];
      
      setClients(mockClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      // Mockdata voor demonstratiedoeleinden
      const mockProjects = [
        { id: 101, client_id: 1, name: 'Website Redesign', start_date: '2023-06-01', end_date: '2023-08-15', status: 'completed', budget: 15000, hours_spent: 120 },
        { id: 102, client_id: 1, name: 'Mobile App Development', start_date: '2023-09-01', end_date: '2023-12-15', status: 'in_progress', budget: 35000, hours_spent: 85 },
        { id: 103, client_id: 2, name: 'CRM Implementation', start_date: '2023-07-15', end_date: '2023-10-30', status: 'in_progress', budget: 25000, hours_spent: 95 },
        { id: 104, client_id: 4, name: 'Brand Identity', start_date: '2023-08-01', end_date: '2023-09-30', status: 'completed', budget: 12000, hours_spent: 75 },
        { id: 105, client_id: 5, name: 'ERP Integration', start_date: '2023-10-01', end_date: '2024-02-28', status: 'in_progress', budget: 50000, hours_spent: 40 },
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      // Mockdata voor demonstratiedoeleinden
      const mockSubscriptions = [
        { id: 201, client_id: 1, plan: 'Basic', start_date: '2023-01-15', renewal_date: '2024-01-15', status: 'active', monthly_fee: 250 },
        { id: 202, client_id: 2, plan: 'Pro', start_date: '2023-03-10', renewal_date: '2024-03-10', status: 'active', monthly_fee: 500 },
        { id: 203, client_id: 3, plan: 'Basic', start_date: '2023-02-20', renewal_date: '2024-02-20', status: 'inactive', monthly_fee: 250 },
        { id: 204, client_id: 4, plan: 'Enterprise', start_date: '2023-07-05', renewal_date: '2024-07-05', status: 'active', monthly_fee: 1000 },
        { id: 205, client_id: 5, plan: 'Pro', start_date: '2023-05-15', renewal_date: '2024-05-15', status: 'active', monthly_fee: 500 },
      ];
      
      setSubscriptions(mockSubscriptions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setIsLoading(false);
    }
  };

  const handleAddClient = async () => {
    try {
      const id = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
      const newClientWithId = {
        ...newClient,
        id,
        created_at: new Date().toISOString().split('T')[0]
      };
      
      // In echte implementatie: voeg toe aan Supabase
      // const { error } = await supabase.from('clients').insert(newClientWithId);
      // if (error) throw error;
      
      setClients([...clients, newClientWithId]);
      setShowAddClientForm(false);
      setNewClient({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(project => {
    const client = clients.find(c => c.id === project.client_id);
    return client && (
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredSubscriptions = subscriptions.filter(sub => {
    const client = clients.find(c => c.id === sub.client_id);
    return client && (
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CRM & Klantbeheer</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Zoeken..."
            className="px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setShowAddClientForm(true)}
          >
            + Nieuwe klant
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button
            className={`pb-3 px-4 ${activeTab === 'clients' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'}`}
            onClick={() => setActiveTab('clients')}
          >
            Klanten
          </button>
          <button
            className={`pb-3 px-4 ${activeTab === 'projects' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'}`}
            onClick={() => setActiveTab('projects')}
          >
            Projecten
          </button>
          <button
            className={`pb-3 px-4 ${activeTab === 'subscriptions' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            Abonnementen
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Laden...</p>
        </div>
      ) : (
        <div>
          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left">Naam</th>
                    <th className="py-3 px-4 text-left">Contactpersoon</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Telefoon</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-right">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">{client.name}</td>
                      <td className="py-3 px-4">{client.contact_person}</td>
                      <td className="py-3 px-4">{client.email}</td>
                      <td className="py-3 px-4">{client.phone}</td>
                      <td className="py-3 px-4">
                        <span className={`py-1 px-2 rounded-full text-xs ${
                          client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {client.status === 'active' ? 'Actief' : 'Inactief'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">
                          Bewerken
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          Verwijderen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left">Project naam</th>
                    <th className="py-3 px-4 text-left">Klant</th>
                    <th className="py-3 px-4 text-left">Start datum</th>
                    <th className="py-3 px-4 text-left">Eind datum</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-right">Budget</th>
                    <th className="py-3 px-4 text-right">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => {
                    const client = clients.find(c => c.id === project.client_id);
                    return (
                      <tr key={project.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4">{project.name}</td>
                        <td className="py-3 px-4">{client?.name || 'Onbekend'}</td>
                        <td className="py-3 px-4">{project.start_date}</td>
                        <td className="py-3 px-4">{project.end_date}</td>
                        <td className="py-3 px-4">
                          <span className={`py-1 px-2 rounded-full text-xs ${
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status === 'completed' ? 'Afgerond' :
                              project.status === 'in_progress' ? 'In uitvoering' : 'Gepland'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">€{project.budget.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-blue-600 hover:text-blue-800 mr-2">
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left">Klant</th>
                    <th className="py-3 px-4 text-left">Plan</th>
                    <th className="py-3 px-4 text-left">Start datum</th>
                    <th className="py-3 px-4 text-left">Verlengingsdatum</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-right">Maandelijks bedrag</th>
                    <th className="py-3 px-4 text-right">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((subscription) => {
                    const client = clients.find(c => c.id === subscription.client_id);
                    const today = new Date();
                    const renewalDate = new Date(subscription.renewal_date);
                    const isExpiringSoon = renewalDate > today && 
                      renewalDate <= new Date(today.setMonth(today.getMonth() + 2));
                      
                    return (
                      <tr key={subscription.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4">{client?.name || 'Onbekend'}</td>
                        <td className="py-3 px-4">{subscription.plan}</td>
                        <td className="py-3 px-4">{subscription.start_date}</td>
                        <td className="py-3 px-4">
                          {subscription.renewal_date}
                          {isExpiringSoon && (
                            <span className="ml-2 py-1 px-2 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                              Verloopt binnenkort
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`py-1 px-2 rounded-full text-xs ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {subscription.status === 'active' ? 'Actief' : 'Inactief'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">€{subscription.monthly_fee.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-blue-600 hover:text-blue-800 mr-2">
                            Verlengen
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nieuwe klant toevoegen</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrijfsnaam</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contactpersoon</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={newClient.contact_person}
                  onChange={(e) => setNewClient({...newClient, contact_person: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefoon</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={newClient.address}
                  onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newClient.status}
                  onChange={(e) => setNewClient({...newClient, status: e.target.value})}
                >
                  <option value="active">Actief</option>
                  <option value="inactive">Inactief</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setShowAddClientForm(false)}
              >
                Annuleren
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleAddClient}
              >
                Toevoegen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Voeg getLayout functie toe voor consistente layout
CrmPage.getLayout = (page) => Layout.getLayout(page); 