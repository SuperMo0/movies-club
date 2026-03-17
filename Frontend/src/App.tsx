import { createContext, use, useContext, useEffect, useState } from 'react'
import { Routes, Route, Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/Home'
import SocialMainPage from './pages/SocialMainPage'
import SocialProfile from './pages/SocialProfile'

import Login from './components/social-components/Login'
import Signup from './components/social-components/Signup'
import Header from './components/movies-components/Header'
import SocialLayout from './components/social-components/SocialLayout'

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

  const { check, isChecking, authUser } = useAuthStore()

  useEffect(() => {
    check();
  }, []);

  const isDataNotReady = isChecking;

  if (isDataNotReady) {
    return <LoadingScreen message="Loading MovieClub..." />;
  }

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
      <ToastContainer theme="dark" position="bottom-right" />
      <LoginContext.Provider value={{
        openLogin,
        openSignup
      }}>
        <Login
          isOpen={shouldOpenLogin}
          onClose={() => setIsLoginModalOpen(false)}
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