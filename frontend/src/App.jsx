import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Body from './Components/Body';
import Login from './Components/Login';
import Profile from './Components/Profile';
import appStore from './utils/appStore';
import { Provider } from 'react-redux';
import Feed from './Components/Feed.jsx';
import Error from './Components/Error.jsx';
import Connections from './Components/Connections.jsx';
import Requests from './Components/Requests.jsx';
import Chat from './Components/Chat.jsx';
import SwipeDeck from './Components/SwipeDeck.jsx';

function App() {
  return (
    <div>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/conns" element={<Connections />} />
              <Route path="/discover" element={<SwipeDeck />} />
              <Route path="/reqs" element={<Requests />} />
              <Route path="/error" element={<Error />} />
              <Route path="/chat/:targetUserId" element={<Chat />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
