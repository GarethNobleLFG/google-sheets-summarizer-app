import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/main-page/MainPage';

export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* Add more routes here as needed */}
        </Routes>
    </Router>
  );
}