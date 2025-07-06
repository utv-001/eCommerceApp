import React from 'react'
import Layout from '../components/layout/Layout.js'
import './css styles/policy.css'

const Policy = () => {
  return (
    <Layout title={'Policy - Trivikram\'s Ecommerce App'}>
      <div className='policy-container'>
        <div>
          <img src="/images/contactus.jpeg" alt="privacy policy" className='policy-img'/>
        </div>
        <div className="policy-info">
          <h4>Privacy Policy</h4>
          <p>
            We value your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and safeguard your information. We only collect necessary data and ensure it is securely stored. Your information will never be shared or sold without your explicit consent. We may use cookies to enhance your user experience. You can opt out of non-essential data collection at any time. By using our services, you agree to the terms of this policy. We comply with all applicable data protection laws. For questions or concerns, please contact us at [your contact email]. Updates to this policy will be posted on our website.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Policy
