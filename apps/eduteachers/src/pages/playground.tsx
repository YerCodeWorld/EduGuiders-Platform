// src/components/profile/ProfileNavigation.tsx
import React from 'react';
import { ProfileSectionType } from '../../pages/TeacherProfile';
import '../../styles/components/profile/profileNavigation.css';

interface ProfileNavigationProps {
    activeSection: ProfileSectionType;
    onSectionChange: (section: ProfileSectionType) => void;
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
    // Navigation items with icons and labels
    const navigationItems: Array<{
        id: ProfileSectionType;
        icon: string;
        label: string;
    }> = [
        { id: 'availability', icon: 'calendar-alt', label: 'Availability' },
        { id: 'bio', icon: 'user', label: 'Bio' },
        { id: 'cv', icon: 'file-alt', label: 'CV' },
        { id: 'teachingStyle', icon: 'chalkboard-teacher', label: 'Teaching Style' },
        { id: 'personalRules', icon: 'list-ul', label: 'Personal Rules' },
        { id: 'contact', icon: 'envelope', label: 'Contact' }
    ];

    return (
        <nav className="profile-navigation" aria-label="Profile navigation">
            <div className="nav-buttons">
                {navigationItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => onSectionChange(item.id)}
                        aria-current={activeSection === item.id ? 'page' : undefined}
                        aria-label={item.label}
                    >
                        <i className={`fas fa-${item.icon}`} aria-hidden="true"></i> {item.label}
                    </button>
                ))}
            </div>

            {canEdit && (
                <div className="edit-controls">
                    <button
                        className={`edit-toggle-btn ${isEditing ? 'editing' : ''}`}
                        onClick={onToggleEdit}
                        aria-pressed={isEditing}
                        aria-label={isEditing ? 'Cancel editing' : `Edit ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}`}
                    >
                        {isEditing ? (
                            <>
                                <i className="fas fa-times" aria-hidden="true"></i> Cancel Editing
                            </>
                        ) : (
                            <>
                                <i className="fas fa-edit" aria-hidden="true"></i> Edit {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                            </>
                        )}
                    </button>
                </div>
            )}
        </nav>
    );
};

export default ProfileNavigation;