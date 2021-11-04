import './App.css';
import Mapper from './components/Mapper.js'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes
} from 'react-router-dom'

function App() {
  return (
    <Router>

      <div className="App">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/mapper"> Landmarks Mapper</Link>
          <Link to="/keyboard">Visual Keyboard</Link>
        </nav>
        <Routes>
          <Route exact path="/" element={ <h1>Hello</h1> } />
          <Route path="/mapper" element={ <Mapper /> } />
          <Route path="/keyboard">

          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
