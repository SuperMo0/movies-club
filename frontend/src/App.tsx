import { createContext, use, useState } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
  ScrollRestoration
} from "react-router-dom";
import Home from './pages/home-page'
import SocialMainPage from './pages/social-main-page'
import SocialProfile from './pages/social-profile-page'

import Login from './components/social-components/login'
import Signup from './components/social-components/signup'
import Header from './components/movies-components/header'
import SocialLayout from './components/social-components/social-layout'
import LoadingScreen from './components/ui/LoadingScreen'

import { useSession } from './hooks/use-auth-queries'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<><ScrollRestoration /> <RootLayout /></>}>
      <Route index element={<Home />} />
      <Route path='social' element={<SocialLayout />}>
        <Route path='main' element={<SocialMainPage />} />
        <Route path='users/:username' element={<SocialProfile />} />
      </Route>
    </Route>
  )
);


type LoginContextType = {
  openLogin: () => void,
  openSignup: () => void
}

const LoginContext = createContext<LoginContextType>(null!);

function RootLayout() {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const { data: sessionData, isLoading } = useSession();

  if (isLoading) {
    return <LoadingScreen message="Loading MovieClub..." />;
  }

  const authUser = sessionData?.user

  const openLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  }

  const openSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  }

  const shouldOpenLogin = isLoginModalOpen && !authUser;
  const shouldOpenSignup = isSignupModalOpen && !authUser;

  return (
    <div className='max-w-5xl mx-auto min-h-screen relative'>
      <LoginContext.Provider value={{
        openLogin,
        openSignup
      }}>
        <Login
          open={shouldOpenLogin}
          onOpenChange={() => setIsLoginModalOpen(false)}
        />

        <Signup
          open={shouldOpenSignup}
          onOpenChange={() => setIsSignupModalOpen(false)}
        />

        <Header
          onLoginClick={openLogin}
          onSignupClick={openSignup}
        />
        <Outlet />
      </LoginContext.Provider>
    </div>
  )
}

function App() {
  return <RouterProvider router={router} />
}

export default App;
export const useLoginModal = () => use(LoginContext);