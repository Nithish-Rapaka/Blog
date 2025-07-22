import React from 'react'
import './App.css'; 
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import CategoryBlog from './pages/CategoryBlog/catBlog'
import DedicatedBlog from './pages/DedicatedBlog/Dedicated'
import Attendance from './pages/Attendance/Attendance';
import { Routes,Route } from 'react-router-dom'
import BlogForm from './pages/Theory/TheorySubject';
import LabsManager from './pages/LabManager/LabManager';
function App() 
{
  return (
     <div className="app-background">
      <Navbar/>
      <Routes>
      <Route path='/Attendance'element={<Attendance/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/Blogs/:category' element={<CategoryBlog/>}/>
      <Route path='/Blog/:id' element={<DedicatedBlog/>}/>
      <Route path='/subjects' element={<BlogForm />} /> 
      <Route path='/labs' element={<LabsManager/>} /> 
      </Routes>
      <Footer/>
      </div> 
  )
}

export default App
