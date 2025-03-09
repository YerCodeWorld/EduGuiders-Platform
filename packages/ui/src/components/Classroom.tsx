// src/pages/Classroom.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UnderConstruction } from '../exports';
import { ROUTES } from '../routes';

const Classroom = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();

    return (
        <div className="classroom-container">
            <UnderConstruction
                title="Virtual Classroom Coming Soon"
                message="We're working on integrating our virtual classroom experience with Jitsi Meet. For now, please use the meeting link provided on the session preparation page."
                iconName="chalkboard-teacher"
                estimatedCompletion="End of Q2 2025"
            />

            <div className="under-construction-actions">
                <button
                    className="btn-primary"
                    onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}
                >
                    Return to Dashboard
                </button>

                <button
                    className="btn-secondary"
                    onClick={() => navigate(`/session/${sessionId}/prep`)}
                >
                    Go to Session Preparation
                </button>
            </div>
        </div>
    );
};

export default Classroom;