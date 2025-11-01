import React from 'react'
import { Register } from './components/Register'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';





const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/register' element={<Register />} />

      </Routes>
    </div>

  )
}

export default App