// import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
// import { loadStripe, Stripe } from '@stripe/stripe-js';
import './styles/main.scss';
// import './services/initFirebase';
// import { onAuthStateChanged, getAuth } from 'firebase/auth';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
// import axios from 'axios';
import Home from './components/Home';
import Feedback from './components/Feedback';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import About from './components/About';
import NotFound from './components/NotFound';
import Updates from './components/Updates';
// import Login from './components/Login';
// import PrivateRoute from './components/PrivateRoute';
// import Unsubscribe from './components/Unsubscribe';
// import Subscribe from './components/Subscribe';

function App() {
  // const [authUser, setAuthUser] = useState(false);
  // const [stripePromise, setStripePromise] = useState<Stripe | null>()

  // useEffect(() => {
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       await user.getIdToken()
  //         .then((token) => {
  //           axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //         })
  //       setAuthUser(true)
  //     } else {
  //       setAuthUser(false)
  //     }
  //   })
  // }, [])

  // const fetchStripePromise = async () => {
  //   const { data: pubKey }: { data: string } = await axios.get('/api/subscription/pub-key')
  //   const stripePromise = await loadStripe(pubKey)
  //   setStripePromise(stripePromise)
  // }

  // useEffect(() => {
  //   if (authUser) {
  //     fetchStripePromise()
  //   }
  // }, [authUser])

  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <Switch>
        {/* <PrivateRoute path="/subscribe"
          component={Subscribe}
          authUser={authUser}
          stripePromise={stripePromise}
        />
        <PrivateRoute
          path="/payment-method"
          component={Subscribe}
          authUser={authUser}
          stripePromise={stripePromise}
        />
        <PrivateRoute
          path="/unsubscribe"
          component={Unsubscribe}
          authUser={authUser}
        />
        <Route path='/signin'>
          <Login />
        </Route> */}
        <Route path='/privacy-policy'>
          <Privacy />
        </Route>
        <Route path='/terms'>
          <Terms />
        </Route>
        <Route path='/feedback'>
          <Feedback />
        </Route>
        <Route path='/contact'>
          <Contact />
        </Route>
        <Route path='/about'>
          <About />
        </Route>
        <Route path='/updates'>
          <Updates />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
      <Footer />
    </Router>
  )
}

export default App;
