// packages/ui/src/components/common/NotFound.tsx
import { Link } from 'react-router-dom';
import '../../styles/common/notFound.css';

// This component is also easy to grasp
// It used to be a FC component but there was no necessity for this.
// Just return a normal component with hard coded text values.

const NotFound= () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-code">404</div>
                <h1 className="not-found-title">Page Not Found</h1>
                <p className="not-found-message">We are sorry, the page you requested could not be found.</p>

                <div className="not-found-actions">
                    <Link to='/' className="not-found-button">
                        Return to Home
                    </Link>

                    <button
                        className="not-found-back"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;