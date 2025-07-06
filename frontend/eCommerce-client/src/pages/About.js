import React from 'react';
import Layout from '../components/layout/Layout.js';
import './css styles/about.css'

const About = () => {
    return (
        <Layout title={'About us - Trivikram\'s Ecommerce App'}>
            <div className='about-container'>
                <div>
                    <img src="/images/about.jpeg" alt="about us" className='about-imgage' />
                </div>
                <div className='about-info'>
                    <h4>About us</h4>
                    <p>
                        Welcome to ecommerce website, your one-stop shop for quality products at unbeatable value. We are dedicated to making online shopping smooth, personalized, and satisfying. Our curated selection combines quality, affordability, and the latest trends. Customer happiness drives everything we do, from product selection to service. Thank you for choosing ecommerce website — your journey starts here!
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default About;