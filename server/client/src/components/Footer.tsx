import { Link } from "react-router-dom";
import { ReactComponent as LogoSvg } from '../assets/logo.svg';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <div className="footer-logo-content">
                        <div className='footer_logo'>
                            <Link to='/'>
                                <LogoSvg />
                            </Link>
                        </div>
                        <h1>Softlete</h1>
                        <p>@2022 softlete</p>
                    </div>
                </div>
                <div className="footer-menu">
                    <h1>Menu</h1>
                    <div className='link'>
                        <Link to='/about'>About Us</Link>
                    </div>
                    <div className='link'>
                        <Link to='/updates'>Future</Link>
                    </div>
                    <div className='link'>
                        <Link to='/privacy-policy'>Privacy Policy</Link>
                    </div>
                    <div className='link'>
                        <Link to='/terms'>Terms of Use</Link>
                    </div>
                    <div className='link'>
                        <Link to='/feedback'>Feedback</Link>
                    </div>
                    <div className='link'>
                        <Link to='/contact'>Contact</Link>
                    </div>
                </div>
                <div className="footer-social">
                    <h1>Social</h1>
                    <div className='link'>
                        <a href='https://www.instagram.com/softleteapp/'>Instagram</a>
                    </div>
                </div>
                <div className="footer-download">
                    <h1>Get Started</h1>
                    <a onClick={() => alert("Hi! Sorry, the app hasn't release yet. The app will be coming out soon.")}>Download</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;