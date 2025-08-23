import React from 'react'
import { NavLink } from 'react-router-dom'
// import './Footer.css'

function Footer() {
  return (
    // <div>
    //   <footer className="footer">
    //   <section className="footer__container">

    //     <div className="footer__logo">
    //       <a href="index.html">
    //         <img src="./../../public/images/logo.svg" alt="Logo" width="416" height="56" />
    //       </a>
    //     </div>

    //     <div className="footer__redes">
    //       <div className="footer__titulo">
    //         <h2>Redes sociais do site de receitas originais</h2>
    //       </div>

    //       <section className="footer__icons">
    //         <a href="https://www.tudogostoso.com.br/" className="footer__icon" aria-label="Site" title="Site"><i className="ph-bold ph-globe"></i></a>
    //         <a href="https://www.youtube.com/user/tudogostoso" className="footer__icon" aria-label="YouTube" title="YouTube"><i className="ph-bold ph-youtube-logo"></i></a>
    //         <a href="https://twitter.com/tudo_gostoso" className="footer__icon" aria-label="Twitter" title="Twitter"><i className="ph-bold ph-twitter-logo"></i></a>
    //         <a href="https://br.pinterest.com/tudogostoso/" className="footer__icon" aria-label="Pinterest" title="Pinterest"><i className="ph-bold ph-pinterest-logo"></i></a>
    //       </section>
    //     </div>
    //   </section>
    // </footer>
    // </div>

    <footer style={{backgroundColor:'rgb(255, 219, 99)'}} className="text-gray-800">
        <div className="container mx-auto max-w-6xl py-10 px-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                
                {/* <!-- Brand and Slogan --> */}
                <div className="mb-6 md:mb-0">
                    <h2 className="text-2xl font-bold text-black">Dishly</h2>
                    <p className="text-sm text-gray-700 mt-1">Your guide to authentic flavors.</p>
                </div>

                {/* <!-- Navigation Links --> */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-6 md:mb-0">
                    <NavLink to={'/'}><a className="hover:text-black transition-colors duration-300">Home</a></NavLink>
                    <NavLink to={'/recipe'}><a className="hover:text-black transition-colors duration-300">All Recipes</a></NavLink>
                    <NavLink to={''}><a className="hover:text-black transition-colors duration-300">About Us</a></NavLink>
                    <NavLink to={''}><a className="hover:text-black transition-colors duration-300">Contact</a></NavLink>
                </div>

                {/* <!-- Social Media Links --> */}
                <div className="flex justify-center gap-6">
                    <a href="" aria-label="Facebook" className="text-gray-600 hover:text-black transition-colors duration-300">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/_ni_y_ad?utm_source=ig_web_button_share_sheet&igsh=NnJhY2NrMjJ0d2o=" aria-label="Instagram" className="text-gray-600 hover:text-black transition-colors duration-300">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-10.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" />
                        </svg>
                    </a>
                    <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-black transition-colors duration-300">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* <!-- Copyright Notice --> */}
            <div className="mt-8 pt-8 border-t border-yellow-400 text-center text-sm text-gray-600">
                <p>&copy; 2025 Dishly. All Rights Reserved.</p>
                <p>Made with ❤️ from Kerala.</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer
