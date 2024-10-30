
import '../styles/global.css';
import Frame from '../layouts/Frame';


function App({ Component, pageProps }) {
  return (
    <Frame>
      <Component {...pageProps} />
    </Frame>
  );
}

export default App;
