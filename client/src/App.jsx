import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community' 
import { AppContextProvider } from './context/AppContext'
import { useState } from 'react'
import {assets} from './assets/assets'
import './assets/prism.css'

const App = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <AppContextProvider>
      {!isMenuOpen && <img src={assets.menu_icon} className='absolute top-3 left-3 
      w-8 h-8 cursor-pointer md:hiddden not-dark:invert'  onClick={()=> setIsMenuOpen(true)}/>}
    <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000]
    dark:text-white'>
    {/*<div className="flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1" style={{backgroundColor: 'red'}}>*/}
    <div className='flex h-screen w-screen'>
      <Sidebar isMenuOpen = {isMenuOpen} setIsMenuOpen = {setIsMenuOpen} />
      <Routes>
          <Route path= '/' element={<ChatBox />} />
          <Route path= '/Credits' element={<Credits />} />
          <Route path= '/Community' element={<Community />} />
      </Routes>

    </div>
    </div>
    </AppContextProvider>
  )
}

export default App