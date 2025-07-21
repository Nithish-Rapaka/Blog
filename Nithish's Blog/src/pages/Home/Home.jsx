import React from 'react';
import TrendingBlog from '../../components/TrendingBlog/TrendingBlog';
import blogs from '../../Utils/MockData';
import Banner from '../../components/Banner/Banner';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="body">
      <Banner />
      <div className="my-2">
        <h1>Read PDFs</h1>
        <div className="d-flex justify-content-center column-gap-3">
          <Link to={`/subjects`}>
            <div className="card" style={{ width: '18rem' }}>
              <img src="/media/Theory.png" className="card-img-top" alt="Theory" />
              <div className="card-body">
                <h5 className="card-title">Theory</h5>
              </div>
            </div>
          </Link>
          <Link to={`/labs`}>
            <div className="card" style={{ width: '18rem' }}>
              <img src="/media/Labs.png" className="card-img-top" alt="Labs" />
              <div className="card-body">
                <h5 className="card-title">Labs</h5>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <h2>Trips</h2>
      <div className="trending-blogs-section d-flex justify-content-center flex-wrap">
        {blogs.map(blog => (
          <TrendingBlog key={blog.id || blog.title} blog={blog} />
        ))}
      </div>
    </div>
  );
}

export default Home;
