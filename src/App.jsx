import { useState } from 'react'
import {Home, ChatArea, Chatbar, ChatList, HamburgerMenu, Login, Profile, ProfileBar, Register, SearchBar } from './components'
import { Outlet } from 'react-router'
function App() {
  return (
    <>
      <Home/>
      <Outlet/>
    </>
  )
}

export default App
