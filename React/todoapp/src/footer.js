import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-light shadow py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <a href="/" className="d-flex align-items-center text-dark text-decoration-none">
              <img alt="logo" src="logo" width="30" height="30" />
              <span className="ms-3 h5 fw-bold mb-0">Palak's</span>
            </a>
            <p className="my-3">
              We are creating High Quality Resources and tools to Aid developers during the
              development of their projects
            </p>
            <div className="d-flex mt-4">
              <button className="btn btn-outline-dark me-3">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="btn btn-outline-dark me-3">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="btn btn-outline-dark">
                <i className="fab fa-instagram"></i>
              </button>
            </div>
          </div>
          
          <div className="col-md-2 mb-4">
            <h5 className="fw-semibold mb-4">Palak's</h5>
            <div className="d-flex flex-column">
              <a href="/" className="text-dark text-decoration-none mb-2">Resources</a>
              <a href="/" className="text-dark text-decoration-none mb-2">About Us</a>
              <a href="/" className="text-dark text-decoration-none mb-2">Contact</a>
              <a href="/" className="text-dark text-decoration-none mb-2">Blog</a>
            </div>
          </div>
          
          <div className="col-md-2 mb-4">
            <h5 className="fw-semibold mb-4">Help</h5>
            <div className="d-flex flex-column">
              <a href="/" className="text-dark text-decoration-none mb-2">Support</a>
              <a href="/" className="text-dark text-decoration-none mb-2">Sign Up</a>
              <a href="/" className="text-dark text-decoration-none mb-2">Sign In</a>
            </div>
          </div>
          
          <div className="col-md-2 mb-4">
            <h5 className="fw-semibold mb-4">Products</h5>
            <div className="d-flex flex-column">
              <a href="/" className="text-dark text-decoration-none mb-2">Windframe</a>
              <a href="/" className="text-dark text-decoration-none mb-2">Loop</a>
              <a href="/" className="text-dark text-decoration-none mb-2">Contrast</a>
            </div>
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-12">
            <small className="text-center d-block">&copy; Palak's, 2025. All rights reserved.</small>
          </div>
        </div>
      </div>
    </footer>
  );
};