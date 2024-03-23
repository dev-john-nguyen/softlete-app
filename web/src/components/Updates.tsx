const Updates = () => {
  return (
    <div className="legal">
      <div className="content">
        <h1 className="legal-header">Future Changes</h1>
        <a
          href="https://github.com/users/dev-john-nguyen/projects/1/views/1"
          style={{ fontSize: 16 }}
        >
          View Project On Github
        </a>

        <div className="legal-paragraph">
          <h1 className="legal-paragraph-header">Bugs/Issues Fixes</h1>
          <ul className="legal-paragraph-list">
            <li>N/A</li>
          </ul>
        </div>

        <div className="legal-paragraph">
          <h1 className="legal-paragraph-header">Enhancements</h1>
          <ul className="legal-paragraph-list">
            <li>
              Complete redesign of the flow of both endurance and strength
              training workouts. The current UI/UX doesn't seem user friendly
              and complicated. It's difficult to navigate, especially during my
              training sessions.
            </li>
            <li>
              Make it easier to search for exercises. Be able to organize by
              most recent or most frequently used.
            </li>
          </ul>
        </div>

        <div className="legal-paragraph">
          <h1 className="legal-paragraph-header">Future</h1>
          <ul className="legal-paragraph-list">
            <li>
              Implement an AI algorithm that continuously analyzes users' health
              data, such as heart rate, sleep quality, activity levels, and
              nutrition intake. This algorithm can identify patterns and trends
              in the data to offer personalized training recommendations.
            </li>
            <li>
              Use AI to dynamically adjust training plans based on the user's
              progress and any new health data. For example, if a user is not
              getting enough rest, the AI could suggest a lighter training day
              or emphasize activities that might improve sleep quality.
            </li>
            <li>
              By analyzing workout intensity, frequency, and health metrics, AI
              can identify when a user might be at risk of overtraining or
              injury. It can then suggest modifications to prevent harm.
            </li>
            <li>
              Develop a chatbot or virtual coach powered by AI to offer
              immediate feedback, answer health-related questions, and provide
              motivational support. This can help users understand their health
              metrics in real-time and encourage them to stay on track with
              their goals.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Updates;
