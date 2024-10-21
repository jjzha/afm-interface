import { Route, Routes } from 'react-router-dom'; 

import LogIn from './pages/LogInPage';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import DemographicsPage from './pages/DemographicsPage';
import ChatPage from './pages/ChatPage';


function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/demographics" element={<DemographicsPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
