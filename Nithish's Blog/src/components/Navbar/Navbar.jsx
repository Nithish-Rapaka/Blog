import React from 'react'
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Blogs</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/" className="nav-link mx-2">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/Attendance" className="nav-link mx-2">Attendance</Link>
                            </li>
                            <li className="nav-item">
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/subjects"
                                    className="nav-link mx-2"
                                    onClick={() => document.querySelector('.navbar-collapse').classList.remove('show')}
                                >
                                    📚 PDFs
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/Labs"
                                    className="nav-link mx-2"
                                    onClick={() => document.querySelector('.navbar-collapse').classList.remove('show')}
                                >
                                    📚 Labs
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;
