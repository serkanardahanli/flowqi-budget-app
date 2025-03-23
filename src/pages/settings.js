import { useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState({
    name: 'Admin Gebruiker',
    email: 'admin@flowqi.nl',
    role: 'admin'
  });
  const [integrations, setIntegrations] = useState({
    exact: { connected: true, lastSync: '2023-10-15 14:30' },
    stripe: { connected: false, lastSync: null },
    google: { connected: true, lastSync: '2023-10-14 09:15' }
  });
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin Gebruiker', email: 'admin@flowqi.nl', role: 'admin', lastLogin: '2023-10-15 09:30' },
    { id: 2, name: 'Manager', email: 'manager@flowqi.nl', role: 'manager', lastLogin: '2023-10-14 14:45' },
    { id: 3, name: 'Gebruiker', email: 'user@flowqi.nl', role: 'user', lastLogin: '2023-10-13 10:20' }
  ]);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Instellingen</h1>
      
      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          {['profile', 'users', 'integrations', 'notifications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab === 'profile' && 'Profiel'}
              {tab === 'users' && 'Gebruikersbeheer'}
              {tab === 'integrations' && 'Integraties'}
              {tab === 'notifications' && 'Notificaties'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab content */}
      <div className="mt-8">
        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Persoonlijk profiel
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Naam
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Wachtwoord
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">Laat leeg om ongewijzigd te laten</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rol
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    value={userProfile.role}
                    onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
                    disabled
                  >
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="user">Gebruiker</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Neem contact op met een administrator om je rol te wijzigen</p>
                </div>
              </div>

              <div className="mt-6">
                <button className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Profiel bijwerken
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Gebruikersbeheer
                  </h2>
                  <p className="mt-2 text-sm text-gray-700">
                    Beheer gebruikers en hun toegangsrechten
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                    + Gebruiker toevoegen
                  </button>
                </div>
              </div>

              {/* Users table with modern styling */}
              <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left">Naam</th>
                      <th className="py-3 px-4 text-left">E-mail</th>
                      <th className="py-3 px-4 text-left">Rol</th>
                      <th className="py-3 px-4 text-left">Laatste login</th>
                      <th className="py-3 px-4 text-right">Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`py-1 px-2 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role === 'admin' ? 'Administrator' :
                             user.role === 'manager' ? 'Manager' : 'Gebruiker'}
                          </span>
                        </td>
                        <td className="py-3 px-4">{user.lastLogin}</td>
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
            </div>
          </div>
        )}

        {/* Integrations Tab Content */}
        {activeTab === 'integrations' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Integraties
              </h2>
              
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Exact Online</h3>
                      <p className="text-sm text-gray-500 mt-1">Synchroniseer financiële data met Exact Online</p>
                      {integrations.exact.connected && (
                        <p className="text-xs text-gray-500 mt-1">Laatste synchronisatie: {integrations.exact.lastSync}</p>
                      )}
                    </div>
                    {integrations.exact.connected ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 text-sm">Verbonden</span>
                        <button className="px-3 py-1 bg-gray-100 text-sm rounded-md hover:bg-gray-200">
                          Synchroniseren
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-md hover:bg-red-200">
                          Ontkoppelen
                        </button>
                      </div>
                    ) : (
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                        Verbinden
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-sm text-gray-500 mt-1">Koppel betalingsverwerking via Stripe</p>
                      {integrations.stripe.connected && (
                        <p className="text-xs text-gray-500 mt-1">Laatste synchronisatie: {integrations.stripe.lastSync}</p>
                      )}
                    </div>
                    {integrations.stripe.connected ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 text-sm">Verbonden</span>
                        <button className="px-3 py-1 bg-gray-100 text-sm rounded-md hover:bg-gray-200">
                          Synchroniseren
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-md hover:bg-red-200">
                          Ontkoppelen
                        </button>
                      </div>
                    ) : (
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                        Verbinden
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Google OAuth</h3>
                      <p className="text-sm text-gray-500 mt-1">Authenticatie via Google accounts</p>
                      {integrations.google.connected && (
                        <p className="text-xs text-gray-500 mt-1">Laatste synchronisatie: {integrations.google.lastSync}</p>
                      )}
                    </div>
                    {integrations.google.connected ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 text-sm">Verbonden</span>
                        <button className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-md hover:bg-red-200">
                          Ontkoppelen
                        </button>
                      </div>
                    ) : (
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                        Verbinden
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab Content */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Notificatie instellingen
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <div>
                    <h3 className="font-medium">Contractwaarschuwingen</h3>
                    <p className="text-sm text-gray-500">Ontvang meldingen 2 maanden voor afloop van contracten</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b">
                  <div>
                    <h3 className="font-medium">Budgetoverschrijdingen</h3>
                    <p className="text-sm text-gray-500">Ontvang meldingen wanneer uitgaven het budget overschrijden</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b">
                  <div>
                    <h3 className="font-medium">Liquiditeitswaarschuwingen</h3>
                    <p className="text-sm text-gray-500">Ontvang meldingen bij lage liquiditeit</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b">
                  <div>
                    <h3 className="font-medium">Financiële samenvattingen</h3>
                    <p className="text-sm text-gray-500">Ontvang periodieke financiële samenvattingen</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Notificatiekanalen</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input id="email" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                      <label htmlFor="email" className="ml-2 text-sm font-medium text-gray-700">E-mail</label>
                    </div>
                    <div className="flex items-center">
                      <input id="app" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                      <label htmlFor="app" className="ml-2 text-sm font-medium text-gray-700">In-app notificaties</label>
                    </div>
                    <div className="flex items-center">
                      <input id="sms" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <label htmlFor="sms" className="ml-2 text-sm font-medium text-gray-700">SMS</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Instellingen opslaan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Voeg getLayout functie toe voor consistente layout
SettingsPage.getLayout = (page) => Layout.getLayout(page); 