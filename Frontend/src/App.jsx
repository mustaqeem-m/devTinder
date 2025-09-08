import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Body from './Components/Body';
import Login from './Components/Login';
import Profile from './Components/Profile';

function App() {
  return (
    <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <navbutton className="btn btn-primary">Hello DaisyUI 🚀</navbutton>
    </div>
  );
}

export default App;
