import { Link } from "react-router-dom";

const Updates = () => {
    return (
        <div className="legal">
            <div className="content">
                <h1 className="legal-header">Future</h1>

                <div className="legal-paragraph">
                    <h1 className="legal-paragraph-header">
                        Bugs/Issues Fixes
                    </h1>
                    <ul className="legal-paragraph-list">
                        <li></li>
                    </ul>
                </div>

                <div className="legal-paragraph">
                    <h1 className="legal-paragraph-header">
                        Enhancements
                    </h1>
                    <ul className="legal-paragraph-list">
                        <li>*Add workout categories (strength training and cardiovascular training).</li>
                        <li>*Exercise Max.</li>
                        <li>*Add description input box for each exercise in a workout.</li>
                        <li>*Reconfigure exercise analytics screen to include more useful information.</li>
                        <li>*Provide feedback summary of a workout (energy systems, heart rate zones, and rep range zones).</li>
                        <li>A feed of athlete workouts.</li>
                        <li>Figure out multiple ways to provide the user valuable information by using the user's health and fitness data.</li>
                        <li>Add timer into workout.</li>
                        <li>Workout Recommendations.</li>
                        <li>Full Redesign (Future)</li>
                    </ul>
                </div>

                <div className="legal-paragraph">
                    <p className="legal-paragraph-sub-header">
                        Please let us know if there is anything you would like for us to add or any comments in regards to the above possible tools/services.
                    </p>
                    <div className='legal-paragraph-link'>
                        <Link to='/feedback' className="legal-paragraph-link">Feedback</Link>
                    </div>
                    <p className="legal-paragraph-sub-header">
                        or
                    </p>
                    <div className='legal-paragraph-link'>
                        <Link to='/contact' className="legal-paragraph-link">Contact Us</Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Updates;