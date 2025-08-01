import React from 'react'
import Layout from '../components/layout/Layout.js';
import { Link } from 'react-router-dom';
const PageNotFound = () => {
  return (
    <Layout title={'Page Not Found - Trivikram\'s Ecommerce App'}>
      <div className="pnf">
        <h1 className="pnf-title">404</h1>
        <h2 className="pnf-heading">Oops! Page not found</h2>
        <Link to="/" className="pnf-btn">Go Back</Link>
      </div>
    </Layout>
  )
}

export default PageNotFound
