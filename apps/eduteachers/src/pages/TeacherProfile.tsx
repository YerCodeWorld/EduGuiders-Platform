// src/pages/TeacherProfile.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useTeachers} from '../contexts';
import {useAuth, UserRole} from '@repo/ui/contexts/AuthContext';
import {getRandomInt} from "../../../../packages/ui/src/methods.ts";
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileNavigation from '../components/profile/ProfileNavigation';
import Availability from '../components/profile/Availability';
import Bio from '../components/profile/Bio';
import CV from '../components/profile/CV';
import Contact from '../components/profile/Contact';
import {ProfileSectionType} from "@/types";
import TeachingStyle from '../components/profile/TeachingStyle';
import PersonalRules from '../components/profile/PersonalRules';
import Posts from '../components/profile/Posts';
import '../styles/pages/teacherProfile.css';


// Previous implementation: type SectionType = 'availability' | 'bio' | 'cv' | 'contact';
// now:

const TeacherProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // with enhanced teacher context, will be adding a 'error' value
    const { getTeacher, loading } = useTeachers();
    const { user, hasRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // useState for toggling sections. Setting availability as default.
    const [activeSection, setActiveSection] = useState<ProfileSectionType>('availability');
    const [isEditing, setIsEditing] = useState(false);

    // Get teacher data ensuring null/undefined handling
    const teacherId = id || '';
    const teacher = teacherId? getTeacher(teacherId) : undefined;

    const loadingPhrases = [
        "Yahir is the best teacher in the world",
        "Paying in DOP is cheaper than dollars",
        "More than teachers, we are your close friends",
        "Did you know you can set modes? Agressive teaching, compassionate teaching, ...",
        "Why are some people so intelligent?"
    ]


    // Check URL parameters on load ??
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const action = params.get('action');
        const section = params.get('section') as ProfileSectionType | null;

        // Set active section
        if (section && isValidSection(section)) {
            setActiveSection(section);
        }

        // Making sure book availability is the active section if action is booking.
        if (action === 'book') {
            setActiveSection('availability');
        }
    }, [location]);

    // booleansssss
    const isValidSection = (section: string): section is ProfileSectionType => {
        return ['availability', 'bio', 'cv', 'teachingStyle', 'personalRules'].includes(section);
    }

    // Changing to new section, update document title
    useEffect(() => {
        if (teacher) {
            // This is a nice touch, isn't it?
            document.title = `${teacher.name} | Teacher Profile`;
        } else {
            document.title = 'Teacher Profile';
        }
    }, [teacher])

    // By identifying the type of user if any, we set up this boolean
    const canEdit: boolean | undefined = hasRole(UserRole.TEACHER) &&
        teacher && user?.id === teacherId;

    console.log('Can the user edit? ', canEdit);
    console.log(`Has role: ${UserRole.TEACHER}`);
    console.log('Teacher:', teacher);
    console.log(`User Id: ${user?.id} \n TeacherId: ${teacher.id}`);

    // Changing section logic
    const handleSectionChange = useCallback((section: ProfileSectionType) => {
        setActiveSection(section);
        // Reseting editing mode when switching sections ??
        setIsEditing(false);

        // This is supposed to allow us to update the URL without reloading the page
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('section', section);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });

    }, [location.pathname, location.search, navigate]);

    // Only for teachers: Toggle editing mode
    const toggleEditMode = useCallback(() => {
        if (canEdit) {
            // Negate yourself! Negate yourself!
            setIsEditing(prevState => !prevState);
        }
    }, [canEdit])

    // ??? Is there a back button or something?
    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    // Show loader. With custom random phrases of course.
    if (loading) {
        return (
            <div className="Loading">
                <p>{loadingPhrases[getRandomInt(0, loadingPhrases.length - 1)]}</p>
            </div>
        );
    }

    // Implement error state
    //
    //
    //
    //
    //

    if (!teacher) {
        return (
            <div className="teacher-not-found">
                <h2>Error loading this profile.</h2>
                {/*Add p element showing error*/}
                {/*OH, there IS a back button...*/}
                <button className="back-button" onClick={handleBack}>Back to teachers</button>
            </div>
        )
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
                isEditing={isEditing && activeSection === 'bio'}
                onToggleEdit={toggleEditMode}
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
                        isEditable={canEdit}
                        isEditing={isEditing}
                        teacherId={teacher.id}
                        onEditToggle={toggleEditMode}
                    />
                )}

                {activeSection === 'cv' && (
                    <CV
                        cv={teacher.cv}
                        isEditable={canEdit}
                        isEditing={isEditing}
                        teacherId={teacher.id}
                        onEditToggle={toggleEditMode}
                    />
                )}

                {activeSection === 'contact' && (
                    <Contact
                        contact={teacher.contact}
                        teacherId={teacher.id}
                        teacherName={teacher.name}
                        isEditable={canEdit}
                        isEditing={isEditing}
                        onEditToggle={toggleEditMode}
                    />
                )}

                {activeSection === 'teachingStyle' && (
                    <TeachingStyle
                        teachingStyle={teacher.teachingStyle || { approaches: [], philosophy: '', methodology: '' }}
                        isEditable={canEdit}
                        isEditing={isEditing}
                        teacherId={teacher.id}
                        onEditToggle={toggleEditMode}
                    />
                )}

                {activeSection === 'personalRules' && (
                    <PersonalRules
                        personalRules={teacher.personalRules || { rules: [], disclaimer: '' }}
                        isEditable={canEdit}
                        isEditing={isEditing}
                        teacherId={teacher.id}
                        onEditToggle={toggleEditMode}
                    />
                )}

            </div>

            <Posts
                posts={teacher.posts}
                isEditable={canEdit && isEditing}
                teacherId={teacher.id}
            />
        </div>
    );
};

export default TeacherProfile;