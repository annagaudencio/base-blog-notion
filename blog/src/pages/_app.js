import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // Importa o componente Footer

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer /> {/* Adiciona o componente Footer */}
    </>
  );
}

export default MyApp;