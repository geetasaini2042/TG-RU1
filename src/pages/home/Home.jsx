import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import Components
import WelcomeHeader from './components/WelcomeHeader';
import BannerSlider from './components/BannerSlider';
import QuickGrid from './components/QuickGrid';
import SectionHeader from './components/SectionHeader';
import TelegramList from './components/content/TelegramList';
import SyllabusList from './components/content/SyllabusList';
import CustomAlert from '../../components/ui/CustomAlert';

const Home = ({ userData }) => {
  const [alert, setAlert] = useState(null);

  const handleViewAll = (sectionName) => {
      // Future: Navigate to full list page
      setAlert({ message: `Opening all ${sectionName}...`, type: "success" });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24 px-5 pt-6 transition-colors duration-300"
    >
      {/* Alert System */}
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      {/* 1. Header Area */}
      <WelcomeHeader user={userData} />

      {/* 2. Dynamic Banners (API) */}
      <BannerSlider />

      {/* 3. Quick Actions Grid */}
      <QuickGrid />

      {/* 4. Official Channels (API) */}
      <div className="mb-8">
         <SectionHeader title="Official Channels" onViewAll={() => handleViewAll("Channels")} />
         <TelegramList />
      </div>

      {/* 5. Syllabus (API) */}
      <div className="mb-6">
         <SectionHeader title="Latest Syllabus" onViewAll={() => handleViewAll("Syllabus")} />
         <SyllabusList />
      </div>

      {/* Footer Branding */}
      <div className="text-center mt-10 mb-6 opacity-40">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold tracking-[0.2em] uppercase">
              GNIKNAP ACADEMY
          </p>
      </div>

    </motion.div>
  );
};

export default Home;
