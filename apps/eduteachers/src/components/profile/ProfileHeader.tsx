// src/components/profile/ProfileHeader.tsx
import React, {useState, useEffect, useCallback} from 'react';
import { useTeachers } from '../../contexts';
import background from '../../../../../packages/ui/src/images/background.jpg';
import photo from '../../../../../packages/ui/src/images/photo.jpeg';
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
                                                         canEdit,
                                                         isEditing,
                                                         onToggleEdit,
                                                     }) => {

    const { updateTeacherSection } = useTeachers();

    const [editedName, setEditedName] = useState<string>(name);
    const [editedTitle, setEditedTitle] = useState<string>(title);
    const [editedProfilePic, setEditedProfilePic] = useState<string>(profilePicture);
    const [editedLandscapePic, setEditedLandscapePic] = useState<string>(landscapePicture);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // const { getTeacher, updateTeacher } = useTeachers();

    useEffect(() => {
        setEditedName(name);
        setEditedTitle(title);
        setEditedName(profilePicture);
        setEditedLandscapePic(landscapePicture);

        if (!isEditing) {
            setValidationErrors([]);
        }
    }, [name, title, profilePicture, landscapePicture, isEditing]);

    // Same thing as always for the last 10 years, validate stuff
    const validateHeader = useCallback((): boolean => {
        const errors: string[] = [];

        if (!editedName.trim()) {
            errors.push('Name is required');
        }

        if (!editedTitle.trim()) {
            errors.push('Professional title is required');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    }, [editedName, editedTitle]);

    // Handle saving changes
    const handleSaveClick = async () => {
        if (!validateHeader()) {
            return;
        }

        setIsSaving(true);
        try {
            // Update just the header information
            const headerUpdate = {
                name: editedName,
                title: editedTitle,
                profilePicture: editedProfilePic,
                landscapePicture: editedLandscapePic
            };

            // Use the updateTeacherSection method
            const success = await updateTeacherSection(teacherId, 'headerInfo', headerUpdate);

            if (success) {
                onToggleEdit(); // Exit edit mode
            }
        } catch (error) {
            console.error('Error saving header:', error);
            setValidationErrors(['Failed to save changes. Please try again.']);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelClick = () => {
        setEditedName(name);
        setEditedTitle(title);
        setEditedProfilePic(profilePicture);
        setEditedLandscapePic(landscapePicture);
        setValidationErrors([]);
        onToggleEdit();
    };

    const handleImageUpload = (type: 'profile' | 'landscape') => {
        // For now, we'll use placeholder images with a timestamp to force a refresh
        const dimensions = type === 'profile' ? '160/160' : '1600/400';
        const newImageUrl = `/api/placeholder/${dimensions}?t=${Date.now()}`;

        if (type === 'profile') {
            setEditedProfilePic(newImageUrl);
        } else {
            setEditedLandscapePic(newImageUrl);
        }
    };

    return (
        <header className="profile-header">
            {/* Will keep this here:
             style={{ backgroundImage: `url(${isEditing ? editedLandscapePic : landscapePicture})` }}
             */}
            <div
                className="landscape-picture"
                style={{ backgroundImage: `url(${isEditing ? background : background})` }}
            >
                {isEditing && (
                    <button
                        className="edit-landscape-btn"
                        onClick={() => handleImageUpload('landscape')}
                        aria-label="Change banner image"
                    >
                        <i className="fas fa-camera"></i> Change Banner
                    </button>
                )}
                <div className="overlay"></div>

                <button
                    className="back-button"
                    onClick={onBack}
                    aria-label="Go back"
                >
                    <i className="fas fa-arrow-left"></i> Back
                </button>
            </div>

            <div className="profile-personal">
                <div
                    className="profile-picture"
                    style={{ backgroundImage: `url(${isEditing ? editedProfilePic : photo})` }}
                >
                    {isEditing && (
                        <button
                            className="edit-profile-pic-btn"
                            onClick={() => handleImageUpload('profile')}
                            aria-label="Change profile picture"
                        >
                            <i className="fas fa-camera"></i>
                        </button>
                    )}
                </div>

                <div className="profile-name-container">
                    {validationErrors.length > 0 && isEditing && (
                        <div className="header-validation-errors">
                            <ul>
                                {validationErrors.map((error, index) => (
                                    <li key={index} className="error-message">{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {isEditing ? (
                        <div className="edit-name-container">
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="edit-name-input"
                                placeholder="Teacher Name"
                                aria-label="Teacher name"
                                required
                            />
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="edit-title-input"
                                placeholder="Professional Title"
                                aria-label="Professional title"
                                required
                            />
                            <div className="edit-actions">
                                <button
                                    className="cancel-edit-btn"
                                    onClick={handleCancelClick}
                                    disabled={isSaving}
                                    aria-label="Cancel editing"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="save-edit-btn"
                                    onClick={handleSaveClick}
                                    disabled={isSaving}
                                    aria-label="Save changes"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
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
                                    onClick={onToggleEdit}
                                    aria-label="Edit profile"
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