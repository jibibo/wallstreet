import './style';
import Loading from './components/loading';

import { Suspense, lazy } from 'preact/compat'

const App = lazy(() => import('./components/app'));

const Root = () => {
  return (
    <Suspense fallback={<Loading />}>
      {<App />}
    </Suspense>
  );
};

export default Root;
