import logo from './logo.svg';
import './App.css';
import Home from './features/Home/Home';
import Header from './features/Header/Header';
import Subreddits from './features/Subreddits/Subreddits';


function App() {
  return (
    <div>
      <header />
      <main>
        <Home />
      </main>
      <aside>
        <Subreddits />
      </aside>
    </div>
  );
}

export default App;
