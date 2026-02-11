import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { MainLayout } from '@/views/MainLayout';
import { ProtectedRoute } from '@/views/ProtectedRoute';
import { Splash } from '@/views/Splash';
import { Twister } from '@/views/Twister';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<Splash />} />
      <Route path='twister' element={<ProtectedRoute />}>
        <Route index element={<Twister />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
