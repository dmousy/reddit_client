/* import logo from './logo.svg'; */
import './App.css';
import Home from './features/Home/Home';
import Header from './features/Header/Header';
import Subreddits from './features/Subreddits/Subreddits';


function App() {
  return (
    <div>
      <Header />
      <aside>
        <Subreddits />
      </aside>
      <main>
        <Home />
      </main>
    </div>
  );
}

export default App;
