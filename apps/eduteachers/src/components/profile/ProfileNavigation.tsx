// src/components/profile/ProfileNavigation.tsx
import React from 'react';
import '../../styles/components/profile/profileNavigation.css';

type SectionType = 'availability' | 'bio' | 'cv' | 'contact' | 'teachingStyle' | 'personalRules' ;

interface ProfileNavigationProps {
    activeSection: SectionType;
    onSectionChange: (section: SectionType) => void;
    canEdit: boolean;
    isEditing: boolean;
    onToggleEdit: () => void;
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
                                                                 activeSection,
                                                                 onSectionChange,
                                                                 canEdit,
                                                                 isEditing,
                                                                 onToggleEdit
                                                             }) => {
    return (
        <nav className="profile-navigation">
            <div className="nav-buttons">
                <button
                    className={`nav-btn ${activeSection === 'availability' ? 'active' : ''}`}
                    onClick={() => onSectionChange('availability')}
                >
                    <i className="fas fa-calendar-alt"></i> Availability
                </button>

                <button
                    className={`nav-btn ${activeSection === 'bio' ? 'active' : ''}`}
                    onClick={() => onSectionChange('bio')}
                >
                    <i className="fas fa-user"></i> Bio
                </button>

                <button
                    className={`nav-btn ${activeSection === 'cv' ? 'active' : ''}`}
                    onClick={() => onSectionChange('cv')}
                >
                    <i className="fas fa-file-alt"></i> CV
                </button>

                <button
                    className={`nav-btn ${activeSection === 'teachingStyle' ? 'active' : ''}`}
                    onClick={() => onSectionChange('teachingStyle')}
                >
                    <i className="fas fa-envelope"></i> Teaching Styles
                </button>

                <button
                    className={`nav-btn ${activeSection === 'personalRules' ? 'active' : ''}`}
                    onClick={() => onSectionChange('personalRules')}
                >
                    <i className="fas fa-envelope"></i> Personal Rules
                </button>


                <button
                    className={`nav-btn ${activeSection === 'contact' ? 'active' : ''}`}
                    onClick={() => onSectionChange('contact')}
                >
                    <i className="fas fa-envelope"></i> Contact
                </button>
            </div>

            {canEdit && (
                <div className="edit-controls">
                    <button
                        className={`edit-toggle-btn ${isEditing ? 'editing' : ''}`}
                        onClick={onToggleEdit}
                    >
                        {isEditing ? (
                            <>
                                <i className="fas fa-times"></i> Cancel Editing
                            </>
                        ) : (
                            <>
                                <i className="fas fa-edit"></i> Edit {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                            </>
                        )}
                    </button>
                </div>
            )}
        </nav>
    );
};

export default ProfileNavigation;