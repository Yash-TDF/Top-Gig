import SignUpForm from './components/SignUpForm.jsx'
import Login from './components/LoginForm.jsx'
import RoleSelection from './components/RoleSelection.jsx';  
import MenteeProfile from './profile/mentee/MenteeProfile.jsx';
import MenteeDashboard from './profile/mentee/MenteeDashboard.jsx';
import {Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<SignUpForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/role-selection" element={<ProtectedRoute><RoleSelection/></ProtectedRoute>} />
      <Route path="/create-profile/mentee" element={<ProtectedRoute><MenteeProfile/></ProtectedRoute>}/>
      <Route path="/mentee-dashboard" element={<ProtectedRoute><MenteeDashboard/></ProtectedRoute>}/>
    </Routes>
    </>
  )
}

export default App