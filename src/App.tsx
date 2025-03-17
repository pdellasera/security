import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from "@/navigate"
import "./index.css";
import SplashScreen from '@/components/splashScreen';

const App = () => {
  return (
    <Suspense fallback={<SplashScreen />}>
        <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
