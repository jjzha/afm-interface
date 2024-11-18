// pages/_app.js
import '../styles/global.css';
import Frame from '../layouts/Frame';
import { HeaderProvider} from '../contexts/HeaderContext';

function App({ Component, pageProps }) {

    return (
      <HeaderProvider>
        <Frame >
            <Component {...pageProps} />
        </Frame>
      </HeaderProvider>
    );
}

export default App;
