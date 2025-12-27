import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TELEGRAM EXPAND
    if(window.Telegram?.WebApp) {
        window.Telegram.WebApp.expand();
    }

    // --- RENDER API CALL ---
    // Yaha apna Render API URL daalna
    fetch('/public/updates.json') 
      .then(res => res.json())
      .then(result => {
        setData(result); // Maan lo result ek array hai updates ka
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        // Fallback fake data agar API abhi ready nahi hai
        setData([
            {id:1, title: "Server Connecting...", desc: "Waiting for Render API"}
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">USG INDIA</h1>
        <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
            LIVE
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg mb-6">
        <h2 className="text-xl font-bold">Student Portal</h2>
        <p className="opacity-90 text-sm mt-1">Real-time updates directly from server.</p>
      </div>

      {/* Content Area */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Latest Updates</h3>
        
        {loading ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-800">{item.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{item.desc || "Tap to view details"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
