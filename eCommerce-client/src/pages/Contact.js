import React from 'react'
import Layout from '../components/layout/Layout.js'
import { MdOutlineMailOutline } from "react-icons/md"
import { MdCall } from "react-icons/md"
import { MdHeadsetMic } from "react-icons/md";
import "./css styles/contactus.css"

const Contact = () => {
  return (
    <Layout title={'Contact us - Trivikram\'s Ecommerce App'}>
      <div className='contact-container'>
        <div>
          <img src="/images/contact.jpeg" alt='Contact us'  className='contact-img'/>
        </div>
        <div className='contact-info'>
          <h4>Contact us</h4>
          <p>In case of any queries or info realted to product. We are available 24x7.</p>
          <ul>
            <li><MdOutlineMailOutline className='contact-icons'/> help@companyemail.com</li>
            <li><MdCall className='contact-icons'/> +91 1234567890</li>
            <li><MdHeadsetMic className='contact-icons'/> 1800 0000 0000 (Toll Free)</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default Contact
