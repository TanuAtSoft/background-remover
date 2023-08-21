import logo from './logo.svg';
import './App.css';
import BackgroundRemovalApp from "./BcakgroundRemover"
import ImageEditor from './ImageEditor';

function App() {
  return (
    <div className="App">
     <ImageEditor/>
     <img src="/newTest.png" alt="test"/>
    </div>
  );
}

export default App;
