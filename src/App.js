import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout';
import { AppRoutes } from './router';


function App() {
  return (
    <Router>
      <Routes>
        {AppRoutes.map((e) => 
          <Route
            key={e.key}
            path={e.path}
            exact={e.exact}
            element={<DefaultLayout>{e.element}</DefaultLayout>}
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
