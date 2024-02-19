import './App.css';
import { FooterVisibilityProvider } from './Layouts/FooterVisibilityContext';
import Layout from './Layouts/Layout';


function App() {
  return (
    <div className='app'>
      <FooterVisibilityProvider>
      <Layout/>
      </FooterVisibilityProvider>
    </div>
  );
}

export default App;
