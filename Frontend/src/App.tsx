import { createContext, use, useMemo, useEffect, useState, useCallback } from 'react'
import { Routes, Route, Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/home-page'
import SocialMainPage from './pages/social-main-page'
import SocialProfile from './pages/social-profile-page'

import Login from './components/social-components/login'
import Signup from './components/social-components/signup'
import Header from './components/movies-components/header'
import SocialLayout from './components/social-components/social-layout'

import LoadingScreen from './components/ui/LoadingScreen'

// Stores
import { useAuthStore } from './stores/auth.store'


type LoginContextType = {
  openLogin: () => void,
  openSignup: () => void
}

const LoginContext = createContext<LoginContextType>(null!);

function App() {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const check = useAuthStore(s => s.check);
  const isChecking = useAuthStore(s => s.isChecking);
  const authUser = useAuthStore(s => s.authUser);

  useEffect(() => {
    check();
  }, []);


  const openLogin = useCallback(() => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  }, []);

  const openSignup = useCallback(() => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  }, []);

  const loginContextValue = useMemo(() => ({ openLogin, openSignup }), [openLogin, openSignup]);

  const isDataNotReady = isChecking;

  if (isDataNotReady) {
    return <LoadingScreen message="Loading MovieClub..." />;
  }


  const shouldOpenLogin = isLoginModalOpen && !authUser;
  const shouldOpenSignup = isSignupModalOpen && !authUser;

  return (
    <div className='max-w-5xl mx-auto min-h-screen relative'>
      <ToastContainer theme="dark" position="bottom-right" />
      <LoginContext.Provider value={loginContextValue}>
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

        <Routes>
          <Route path='/' element={<Outlet />}>
            <Route index element={<Home />} />
            <Route element={<SocialLayout />}>
              <Route path='social' element={<SocialMainPage />} />
              <Route path='social/user/:id' element={<SocialProfile />} />
            </Route>
          </Route>
        </Routes>

      </LoginContext.Provider>
    </div>
  )
}

export default App;

export const useLoginModal = () => use(LoginContext);