// src/components/profile/Bio.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Bio as BioProp, ExpertiseArea } from '@/types';
import { useTeachers } from '../../contexts';
import '../../styles/components/profile/bio.css';

interface BioComponentProps {
    bio: BioProp;
    isEditable: boolean | undefined;
    teacherId: string;
    isEditing: boolean;
    onEditToggle: () => void;
}

const Bio: React.FC<BioComponentProps> = ({
                                              bio,
                                              isEditable,
                                              isEditing,
                                              teacherId,
                                              onEditToggle
                                        }) => {


    const { updateTeacherSection } = useTeachers();

    // State for editing with proper initialization
    const [editedIntroduction, setEditedIntroduction] = useState<string[]>([]);
    const [editedQuote, setEditedQuote] = useState<string>('');
    const [editedExpertiseAreas, setEditedExpertiseAreas] = useState<ExpertiseArea[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // State for editing with proper initialization
    useEffect(() => {
        if (bio) {
            setEditedIntroduction(bio.introduction ? [...bio.introduction] : []);
            setEditedQuote(bio.quote || '');
            setEditedExpertiseAreas(bio.expertiseAreas ? [...bio.expertiseAreas] : []);
        }

        if (!isEditing) {
            setValidationErrors([])
        }

    }, [bio, isEditing])

    // Let's go to validate the data, why not
    const validateBio = useCallback((): boolean => {
        const errors: string[] = [];

        if (!editedIntroduction.length) {
            errors.push('At least one introduction paragraph is required')
        } else if (editedIntroduction.some(para => !para.trim())) {
            errors.push('Introduction paragraphs cannot be empty')
        }

        if (!editedExpertiseAreas.length) {
            errors.push('At least one area of expertise is required')
        } else if (editedExpertiseAreas.some(area => !area.name.trim())) {
            errors.push('Expertise area names cannot be empty');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    }, [editedIntroduction, editedExpertiseAreas]);

    // Save edits
    const handleSave = async () => {

        if (!validateBio()) {
            return;
        }

        setIsSaving(true);

        try {

            const updatedBio: BioProp = {
                introduction: editedIntroduction,
                quote: editedQuote,
                expertiseAreas: editedExpertiseAreas,
                teacherId
            }

            const success = await updateTeacherSection(teacherId, 'bio', updatedBio);

            if (success) {
                onEditToggle();
            }

        } catch (err) {
            console.error('Error saving bio:', err);
            setValidationErrors(['Failed to save changes. Please try again.']);
        } finally {
            setIsSaving(false);
        }
    };

    // Cancel edits
    const handleCancel = () => {
        // Reset to original values
        setEditedIntroduction(bio.introduction ? [...bio.introduction] : []);
        setEditedQuote(bio.quote || '');
        setEditedExpertiseAreas(bio.expertiseAreas ? [...bio.expertiseAreas] : []);
        setValidationErrors([]);

        // Exit edit mode
        onEditToggle();
    };

    // Add new paragraph to introduction
    const addParagraph = () => {
        setEditedIntroduction([...editedIntroduction, '']);
    };

    // Update paragraph text
    const updateParagraph = (index: number, text: string) => {
        const newIntroduction = [...editedIntroduction];
        newIntroduction[index] = text;
        setEditedIntroduction(newIntroduction);
    };

    // Remove paragraph
    const removeParagraph = (index: number) => {
        const newIntroduction = [...editedIntroduction];
        newIntroduction.splice(index, 1);
        setEditedIntroduction(newIntroduction);
    };

    // Add expertise area
    const addExpertiseArea = () => {
        setEditedExpertiseAreas([...editedExpertiseAreas, { icon: 'star', name: '' }]);
    };

    // Update expertise area
    const updateExpertiseArea = (index: number, field: keyof ExpertiseArea, value: string) => {
        const newAreas = [...editedExpertiseAreas];
        newAreas[index] = { ...newAreas[index], [field]: value };
        setEditedExpertiseAreas(newAreas);
    };

    // Remove expertise area
    const removeExpertiseArea = (index: number) => {
        const newAreas = [...editedExpertiseAreas];
        newAreas.splice(index, 1);
        setEditedExpertiseAreas(newAreas);
    };

    if (!isEditable || !isEditing) {
        return (
            <section id="bio" className="profile-section">
                <div className="section-header">
                    <h2>Biography</h2>
                </div>

                <div className="bio-content">
                    {bio.introduction && bio.introduction.map((paragraph, index) => (
                        <p key={index} className="bio-paragraph">{paragraph}</p>
                    ))}

                    {bio.quote && (
                        <blockquote className="bio-quote">
                            {bio.quote}
                        </blockquote>
                    )}

                    <h3>Areas of Expertise</h3>
                    <div className="expertise-areas">
                        {bio.expertiseAreas && bio.expertiseAreas.map((area, index) => (
                            <div key={index} className="expertise-item">
                                <i className={`fas fa-${area.icon}`} aria-hidden="true"></i>
                                <h4>{area.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Edit mode
    return (
        <section id="bio" className="profile-section">
            <div className="section-header">
                <h2>Edit Biography</h2>
            </div>

            {validationErrors.length > 0 && (
                <div className="validation-errors">
                    <ul>
                        {validationErrors.map((error, index) => (
                            <li key={index} className="error-message">{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bio-edit-form">
                <h3>Introduction</h3>
                <div className="introduction-editor">
                    {editedIntroduction.map((paragraph, index) => (
                        <div key={index} className="paragraph-editor">
                            <textarea
                                value={paragraph}
                                onChange={(e) => updateParagraph(index, e.target.value)}
                                placeholder="Add paragraph content..."
                                rows={3}
                                aria-label={`Paragraph ${index + 1}`}
                            />
                            <button
                                className="remove-paragraph-btn"
                                onClick={() => removeParagraph(index)}
                                title="Remove paragraph"
                                aria-label="Remove paragraph"
                                disabled={editedIntroduction.length <= 1}
                            >
                                <i className="fas fa-trash-alt" aria-hidden="true"></i>
                            </button>
                        </div>
                    ))}

                    <button
                        className="add-paragraph-btn"
                        onClick={addParagraph}
                        aria-label="Add new paragraph"
                    >
                        <i className="fas fa-plus" aria-hidden="true"></i> Add Paragraph
                    </button>
                </div>

                <div className="quote-editor">
                    <h3>Quote (Optional)</h3>
                    <textarea
                        value={editedQuote}
                        onChange={(e) => setEditedQuote(e.target.value)}
                        placeholder="Add an inspirational quote..."
                        rows={2}
                        aria-label="Quote"
                    />
                </div>

                <h3>Areas of Expertise</h3>
                <div className="expertise-editor">
                    {editedExpertiseAreas.map((area, index) => (
                        <div key={index} className="expertise-area-editor">
                            <div className="expertise-field">
                                <label htmlFor={`icon-select-${index}`}>Icon:</label>
                                <select
                                    id={`icon-select-${index}`}
                                    value={area.icon}
                                    onChange={(e) => updateExpertiseArea(index, 'icon', e.target.value)}
                                >
                                    <option value="square-root-alt">Math</option>
                                    <option value="calculator">Calculator</option>
                                    <option value="chart-line">Statistics</option>
                                    <option value="shapes">Geometry</option>
                                    <option value="book">Book</option>
                                    <option value="pencil-alt">Writing</option>
                                    <option value="atom">Science</option>
                                    <option value="globe">Geography</option>
                                    <option value="language">Language</option>
                                    <option value="music">Music</option>
                                    <option value="palette">Art</option>
                                    <option value="dumbbell">Physical Education</option>
                                    <option value="code">Programming</option>
                                    <option value="history">History</option>
                                    <option value="flask">Chemistry</option>
                                    <option value="brain">Psychology</option>
                                    <option value="comments">Communication</option>
                                    <option value="star">General</option>
                                </select>
                            </div>

                            <div className="expertise-field">
                                <label htmlFor={`area-name-${index}`}>Name:</label>
                                <input
                                    id={`area-name-${index}`}
                                    type="text"
                                    value={area.name}
                                    onChange={(e) => updateExpertiseArea(index, 'name', e.target.value)}
                                    placeholder="Area of expertise"
                                />
                            </div>

                            <button
                                className="remove-expertise-btn"
                                onClick={() => removeExpertiseArea(index)}
                                title="Remove expertise"
                                aria-label="Remove expertise area"
                                disabled={editedExpertiseAreas.length <= 1}
                            >
                                <i className="fas fa-trash-alt" aria-hidden="true"></i>
                            </button>
                        </div>
                    ))}

                    <button
                        className="add-expertise-btn"
                        onClick={addExpertiseArea}
                        aria-label="Add expertise area"
                    >
                        <i className="fas fa-plus" aria-hidden="true"></i> Add Expertise Area
                    </button>
                </div>

                <div className="form-actions">
                    <button
                        className="cancel-btn"
                        onClick={handleCancel}
                        disabled={isSaving}
                        aria-label="Cancel editing"
                    >
                        Cancel
                    </button>
                    <button
                        className="save-btn"
                        onClick={handleSave}
                        disabled={isSaving}
                        aria-label="Save changes"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Bio;