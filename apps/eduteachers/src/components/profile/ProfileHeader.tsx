// src/components/profile/ProfileHeader.tsx
import React, { useState } from 'react';
import { useTeachers } from '../../contexts';
import '../../styles/components/profile/profileHeader.css';

interface ProfileHeaderProps {
    name: string;
    title: string;
    profilePicture: string;
    landscapePicture: string;
    teacherId: string;
    onBack: () => void;
    canEdit: boolean | undefined
    isEditing: boolean
    onToggleEdit: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
                                                         name,
                                                         title,
                                                         profilePicture,
                                                         landscapePicture,
                                                         teacherId,
                                                         onBack,
                                                         canEdit
                                                     }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedProfilePic, setEditedProfilePic] = useState(profilePicture);
    const [editedLandscapePic, setEditedLandscapePic] = useState(landscapePicture);

    const { getTeacher, updateTeacher } = useTeachers();

    // Handle editing the header
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Handle saving changes
    const handleSaveClick = () => {
        // Get the current teacher data
        const teacher = getTeacher(teacherId);

        if (!teacher) return;

        // Update with edited values
        const updatedTeacher = {
            ...teacher,
            name: editedName,
            title: editedTitle,
            profilePicture: editedProfilePic,
            landscapePicture: editedLandscapePic
        };

        updateTeacher(updatedTeacher);
        setIsEditing(false);
    };

    // Simulate file upload by using a placeholder
    const handleImageUpload = (type: 'profile' | 'landscape') => {
        // In a real app, this would upload to a server and get a URL back
        const newImageUrl = `/api/placeholder/${type === 'profile' ? '160/160' : '1600/400'}?random=${Date.now()}`;

        if (type === 'profile') {
            setEditedProfilePic(newImageUrl);
        } else {
            setEditedLandscapePic(newImageUrl);
        }
    };

    return (
        <header className="profile-header">
            <div
                className="landscape-picture"
                style={{ backgroundImage: `url(${isEditing ? editedLandscapePic : landscapePicture})` }}
            >
                {isEditing && (
                    <button
                        className="edit-landscape-btn"
                        onClick={() => handleImageUpload('landscape')}
                    >
                        <i className="fas fa-camera"></i> Change Banner
                    </button>
                )}
                <div className="overlay"></div>

                <button className="back-button" onClick={onBack}>
                    <i className="fas fa-arrow-left"></i> Back
                </button>
            </div>

            <div className="profile-personal">
                <div
                    className="profile-picture"
                    style={{ backgroundImage: `url(${isEditing ? editedProfilePic : profilePicture})` }}
                >
                    {isEditing && (
                        <button
                            className="edit-profile-pic-btn"
                            onClick={() => handleImageUpload('profile')}
                        >
                            <i className="fas fa-camera"></i>
                        </button>
                    )}
                </div>

                <div className="profile-name-container">
                    {isEditing ? (
                        <div className="edit-name-container">
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="edit-name-input"
                                placeholder="Teacher Name"
                            />
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="edit-title-input"
                                placeholder="Professional Title"
                            />
                            <div className="edit-actions">
                                <button
                                    className="cancel-edit-btn"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="save-edit-btn"
                                    onClick={handleSaveClick}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="profile-name">{name}</h1>
                            <p className="profile-title">{title}</p>
                            {canEdit && (
                                <button
                                    className="edit-profile-btn"
                                    onClick={handleEditClick}
                                >
                                    <i className="fas fa-edit"></i> Edit Profile
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ProfileHeader;