import './Dedicated.css';
import Banner from '../../components/Banner/Banner';
import { useParams } from 'react-router-dom';
import blogs from '../../Utils/MockData';

function DedicatedBlog() {
  const { id } = useParams();
  const blogId = parseInt(id); // convert string to number
  const blog = blogs.find(b => b.id === blogId); // get the correct blog object

  if (!blog) return <p>Blog not found.</p>;

  return (
    <>
      <Banner />
      <div className="dedicated-container">
        <h1>{blog.title}</h1>
        <h5 className="text-muted">{blog.category}</h5>
        <p>{blog.content}</p>
        <ul>
        </ul>
      </div>
    </>
  );
}

export default DedicatedBlog;
