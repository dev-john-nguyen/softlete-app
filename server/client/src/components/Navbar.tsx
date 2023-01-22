import { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LogoSvg } from '../assets/logo.svg';

const Navbar = () => {
    const [hidden, setHidden] = useState(true);

    return (
        <>
            <div className={`mobile-menu ${hidden ? 'hide' : 'show'}`}>
                <div className="mobile-menu-content">
                    <div className='link'>
                        <Link to='/' onClick={() => setHidden(true)}>Home</Link>
                    </div>
                    <div className='link'>
                        <Link to='/about' onClick={() => setHidden(true)}>About</Link>
                    </div>
                    <div className='link'>
                        <Link to='/updates' onClick={() => setHidden(true)}>Future</Link>
                    </div>
                    <div className='link'>
                        <Link to='/privacy-policy' onClick={() => setHidden(true)}>Privacy</Link>
                    </div>
                    <div className='link'>
                        <Link to='/terms' onClick={() => setHidden(true)}>Terms</Link>
                    </div>
                    <div className='link'>
                        <Link to='/feedback' onClick={() => setHidden(true)}>Feedback</Link>
                    </div>
                    <button className="mobile-menu-close" onClick={() => setHidden(true)}>X</button>
                </div>
            </div>
            <nav className='nav'>
                <div className="nav-content">
                    <div className='nav_logo'>
                        <Link to='/'>
                            <LogoSvg />
                        </Link>
                    </div>
                    <div className="nav-menu">
                        <div className='link'>
                            <Link to='/'>Home</Link>
                        </div>
                        <div className='link'>
                            <Link to='/about'>About</Link>
                        </div>
                        <div className='link'>
                            <Link to='/updates'>Future</Link>
                        </div>
                        <div className='link'>
                            <Link to='/privacy-policy'>Privacy</Link>
                        </div>
                        <div className='link'>
                            <Link to='/terms'>Terms</Link>
                        </div>
                        <div className='link'>
                            <Link to='/feedback'>Feedback</Link>
                        </div>

                        <a className="icon" onClick={() => setHidden(false)}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </a>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;