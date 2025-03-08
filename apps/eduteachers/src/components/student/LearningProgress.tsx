// src/components/student/LearningProgress.tsx
import React from 'react';
import '../../styles/components/student/learningProgress.css';

interface LearningStats {
    totalSessions: number;
    completedSessions: number;
    totalHours: number;
    subjectsLearned: string[];
    currentStreak: number;
    nextMilestone: number;
}

interface LearningProgressProps {
    stats: LearningStats;
}

const LearningProgress: React.FC<LearningProgressProps> = ({ stats }) => {
    // Calculate completion rate as a percentage
    const completionRate = stats.totalSessions > 0
        ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
        : 0;

    // Calculate streak progress as a percentage
    const streakProgress = stats.nextMilestone > 0
        ? Math.min(100, Math.round((stats.currentStreak / stats.nextMilestone) * 100))
        : 0;

    return (
        <div className="learning-progress-container">
            {/* Statistics section */}
            <div className="learning-stats">
                <div className="stat-item">
                    <div className="stat-value">{stats.totalSessions}</div>
                    <div className="stat-label">Total Sessions</div>
                </div>

                <div className="stat-item">
                    <div className="stat-value">{stats.totalHours.toFixed(1)}</div>
                    <div className="stat-label">Hours Learned</div>
                </div>

                <div className="stat-item">
                    <div className="stat-value">{stats.subjectsLearned.length}</div>
                    <div className="stat-label">Subjects</div>
                </div>
            </div>

            {/* Progress bars */}
            <div className="progress-section">
                {/* Completion rate progress */}
                <div className="progress-item">
                    <div className="progress-header">
                        <div className="progress-title">Completion Rate</div>
                        <div className="progress-value">{completionRate}%</div>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${completionRate}%` }}
                        ></div>
                    </div>

                    <div className="progress-detail">
                        <span className="completed">{stats.completedSessions} completed</span>
                        <span className="total">{stats.totalSessions} total</span>
                    </div>
                </div>

                {/* Learning streak progress */}
                <div className="progress-item">
                    <div className="progress-header">
                        <div className="progress-title">Learning Streak</div>
                        <div className="progress-value">{stats.currentStreak} days</div>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill streak"
                            style={{ width: `${streakProgress}%` }}
                        ></div>
                    </div>

                    <div className="progress-detail">
            <span className="milestone-info">
              Next milestone: {stats.nextMilestone} days
            </span>
                    </div>
                </div>
            </div>

            {/* Achievement badges (placeholder for future feature) */}
            <div className="achievements-section">
                <h3 className="achievements-title">Recent Achievements</h3>
                <div className="achievement-badges">
                    <div className="achievement-badge">
                        <i className="fas fa-award"></i>
                        <span>Fast Learner</span>
                    </div>
                    <div className="achievement-badge">
                        <i className="fas fa-fire"></i>
                        <span>5-Day Streak</span>
                    </div>
                    <div className="achievement-badge locked">
                        <i className="fas fa-lock"></i>
                        <span>10-Day Streak</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningProgress;