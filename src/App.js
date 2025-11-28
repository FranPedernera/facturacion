import Navbar from "./components/layout/Navbar"
import './index.css';
import './components/layout/LayoutAuth'


function App() {
  return (
    <>
      <Navbar />
      <div className="pt-20 p-6 text-white">
        <h1 className="text-3xl">Contenido de tu sistema ARCA</h1>
      </div>
    </>
  );
  
}

export default App;
