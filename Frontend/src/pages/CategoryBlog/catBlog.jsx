import React, { useState,useEffect } from 'react'
import TrendingBlog from '../../components/TrendingBlog/TrendingBlog'
import blogs from '../../Utils/MockData'
import Banner from '../../components/Banner/Banner'
import { useParams} from 'react-router-dom'

function CategoryBlog() {
  const [currentcategory,setCurrentCategory]=useState("Labs");
  const {category}=useParams();
  console.log("Line-15",category);
  useEffect(()=>{
    if(category)
    {
      setCurrentCategory(category)
    }
  },[])
  
  return (
    <>
      <Banner />
      <h1>{currentcategory}</h1>
      <div className="trending-blogs-section d-flex justify-content-center flex-wrap">

        {
          blogs.map(blog => blog.category===currentcategory &&
            <TrendingBlog key={blog.id || blog.title} blog={blog} />
          )

        }
      </div>
    </>
  )
}
export default CategoryBlog
