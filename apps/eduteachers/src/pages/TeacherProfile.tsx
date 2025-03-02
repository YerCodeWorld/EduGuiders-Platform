// src/pages/TeacherProfile.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTeachers } from '../contexts/TeachersContext.tsx';
import { useAuth, UserRole } from '../../../../packages/ui/src/contexts/AuthContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileNavigation from '../components/profile/ProfileNavigation';
import Availability from '../components/profile/Availability';
import Bio from '../components/profile/Bio';
import CV from '../components/profile/CV';
import Contact from '../components/profile/Contact';
import Posts from '../components/profile/Posts';
import '../styles/pages/teacherProfile.css';

type SectionType = 'availability' | 'bio' | 'cv' | 'contact';

const TeacherProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getTeacher, loading } = useTeachers();
    const { user, hasRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeSection, setActiveSection] = useState<SectionType>('availability');
    const [isEditing, setIsEditing] = useState(false);

    // Check if the URL has a query parameter for action
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const action = params.get('action');
        if (action === 'book') {
            setActiveSection('availability');
        }
    }, [location]);

    // Get teacher data
    const teacher = id ? getTeacher(id) : undefined;

    // Update document title
    useEffect(() => {
        if (teacher) {
            document.title = `${teacher.name} | Teacher Profile`;
        } else {
            document.title = 'Teacher Profile';
        }
    }, [teacher]);

    // Check if the current logged-in user is this teacher
    const canEdit = hasRole(UserRole.TEACHER) &&
        teacher && user?.id === id;

    // Handler for navigation
    const handleSectionChange = (section: SectionType) => {
        setActiveSection(section);
        // Reset editing mode when switching sections
        setIsEditing(false);
    };

    // Toggle edit mode (only for teachers editing their own profile)
    const toggleEditMode = () => {
        if (canEdit) {
            setIsEditing(!isEditing);
        }
    };

    // Handle going back
    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="loading">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="teacher-not-found">
                <h2>Teacher Not Found</h2>
                <p>The teacher you're looking for doesn't exist or has been removed.</p>
                <button className="back-button" onClick={handleBack}>
                    Back to Teachers
                </button>
            </div>
        );
    }

    return (
        <div className="teacher-profile-wrapper">
            <ProfileHeader
                name={teacher.name}
                title={teacher.title}
                profilePicture={teacher.profilePicture}
                landscapePicture={teacher.landscapePicture}
                teacherId={teacher.id}
                onBack={handleBack}
                canEdit={canEdit}
            />

            <ProfileNavigation
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                canEdit={canEdit}
                isEditing={isEditing}
                onToggleEdit={toggleEditMode}
            />

            <div className="profile-content-container">
                {activeSection === 'availability' && (
                    <Availability
                        teacherId={teacher.id}
                        availability={teacher.availability}
                        isEditable={canEdit && isEditing}
                    />
                )}

                {activeSection === 'bio' && (
                    <Bio
                        bio={teacher.bio}
                        isEditable={canEdit && isEditing}
                        teacherId={teacher.id}
                    />
                )}

                {activeSection === 'cv' && (
                    <CV
                        cv={teacher.cv}
                        isEditable={canEdit && isEditing}
                    />
                )}

                {activeSection === 'contact' && (
                    <Contact
                        contact={teacher.contact}
                        teacherId={teacher.id}
                        teacherName={teacher.name}
                    />
                )}
            </div>

            <Posts
                posts={teacher.posts}
                isEditable={canEdit && isEditing}
            />
        </div>
    );
};

export default TeacherProfile;