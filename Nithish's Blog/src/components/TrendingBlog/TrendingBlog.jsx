import blogs from '../../Utils/MockData';
import { Link } from 'react-router-dom';
import './TrendingBlog.css'
function TrendingBlog({ blog }) {
    let image = '';
    switch (blog.title) {
        case "Trip":
            image = 'Trip1.jpg';
            break;
        case "InTrip":
            image = 'Trip2.jpg';
            break;
        default:
            image=''    
    }
    return (
        <Link to={`/Blog/${blog.id}`}>
        <div d-flex justify-content center column-gap-2>
            <div className="card" style={{ width: '18rem' }}>
                <img src={`/media/${image}`} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{blog.title}</h5>
                </div>
            </div>
        </div>
        </Link>
    )
}

export default TrendingBlog;
