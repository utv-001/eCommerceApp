import React from 'react'
import Header from './Header.js'
import Footer from './Footer.js'
import {Helmet} from 'react-helmet'
import {Toaster} from 'react-hot-toast'

const Layout = ({children, title, description, keywords, author}) => {
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name='description' content={description}/>
                <meta name='keywords' content={keywords}/>
                <meta name='author' content={author}/>
                <title>{title}</title>
            </Helmet>
            <Header />
            <main style={{minHeight: '70vh'}}>
                <Toaster/>
                {children}
            </main>
            <Footer />
        </>
    )
}

Layout.defaultProps={
    title:"Trivikram's Ecommerce App",
    description: 'mern stack project',
    keyword: "express, react, node, mongodb"
}

export default Layout