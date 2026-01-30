import React from "react";

function SchedulePanel() {
  return (
    <aside className="w-80 bg-white border-l border-slate-100 p-6 hidden lg:block">
      <h3 className="text-lg font-bold mb-4">Schedule</h3>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <h4 className="font-semibold">Today</h4>
          <p className="text-sm text-slate-500 mt-1">
            No sessions scheduled
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl">
          <h4 className="font-semibold">Upcoming</h4>
          <p className="text-sm text-slate-500 mt-1">
            You have no upcoming calls
          </p>
        </div>
      </div>
    </aside>
  );
}

export default SchedulePanel;
