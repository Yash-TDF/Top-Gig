import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MentorList from './MentorList';
import SchedulePanel from './SchedulePanel';
import EditProfile from './EditProfile';

function MenteeDashboard() {
  const [view, setView] = useState('call-booking');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar - Fixed width */}
      <Sidebar currentView={view} setView={setView} />

      {/* Main Content - Flexible width */}
      <main className="flex-1 overflow-y-auto p-8">
        {view === 'call-booking' && <MentorList />}
        {view === 'edit-profile' && <EditProfile />}
        {view === 'settings' && <Settings />}
      </main>

      {/* Right Panel - Calendar & Schedule */}
      <SchedulePanel />
    </div>
  );
}

export default MenteeDashboard