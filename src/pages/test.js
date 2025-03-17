import { useEffect, useState } from 'react';

export default function TestPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    fetch('/api/test-supabase')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Log raw response voor debugging
        return response.text().then(text => {
          console.log('Raw response:', text);
          // Als het een lege string is, return een geldige JSON
          if (!text) return { empty: true };
          // Anders, probeer te parsen als JSON
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error('Failed to parse JSON:', e);
            throw new Error('Invalid JSON response');
          }
        });
      })
      .then(data => {
        console.log('Parsed data:', data);
        setData(data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Test</h1>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p><strong>Success!</strong> Data received from Supabase.</p>
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}