import { createContext, use, useContext, useEffect, useState } from 'react'
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

import { useQuery } from "@tanstack/react-query"
import { checkSession } from './api/auth'
import { useSession } from './hooks/use-auth-queries'


type LoginContextType = {
  openLogin: () => void,
  openSignup: () => void
}

const LoginContext = createContext<LoginContextType>(null!);

function App() {

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
      <ToastContainer theme="dark" position="bottom-right" />
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