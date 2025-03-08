// src/components/profile/Bio.tsx
import React, { useState } from 'react';
import { Bio as BioProp, ExpertiseArea } from '../../types';
import { useTeachers } from '../../contexts';
import '../../styles/components/profile/bio.css';

interface BioComponentProps {
    bio: BioProp;
    isEditable: boolean;
    teacherId: string;
}

const Bio: React.FC<BioComponentProps> = ({ bio, isEditable, teacherId }) => {
    const { getTeacher, updateTeacher } = useTeachers();

    // State for editing
    const [editedIntroduction, setEditedIntroduction] = useState<string[]>([...bio.introduction]);
    const [editedQuote, setEditedQuote] = useState(bio.quote || '');
    const [editedExpertiseAreas, setEditedExpertiseAreas] = useState<ExpertiseArea[]>([...bio.expertiseAreas]);
    const [isEditing, setIsEditing] = useState(false);

    // Save edits
    const handleSave = () => {
        // Get the current teacher data
        const teacher = getTeacher(teacherId);
        if (!teacher) return;

        // Update bio with edited values
        const updatedTeacher = {
            ...teacher,
            bio: {
                ...teacher.bio,
                introduction: editedIntroduction,
                quote: editedQuote,
                expertiseAreas: editedExpertiseAreas
            }
        };

        updateTeacher(updatedTeacher);
        setIsEditing(false);
    };

    // Cancel edits
    const handleCancel = () => {
        setEditedIntroduction([...bio.introduction]);
        setEditedQuote(bio.quote || '');
        setEditedExpertiseAreas([...bio.expertiseAreas]);
        setIsEditing(false);
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
    const updateExpertiseArea = (index: number, field: 'icon' | 'name', value: string) => {
        const newAreas = [...editedExpertiseAreas];
        // @ts-ignore
        newAreas[index] = { ...newAreas[index], [field]: value };
        setEditedExpertiseAreas(newAreas);
    };

    // Remove expertise area
    const removeExpertiseArea = (index: number) => {
        const newAreas = [...editedExpertiseAreas];
        newAreas.splice(index, 1);
        setEditedExpertiseAreas(newAreas);
    };

    // Display mode (not editing)
    if (!isEditable || !isEditing) {
        return (
            <section id="bio" className="profile-section">
                <h2>Biography</h2>

                <div className="bio-content">
                    {bio.introduction.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}

                    {bio.quote && (
                        <blockquote>
                            {bio.quote}
                        </blockquote>
                    )}

                    <h3>Areas of Expertise</h3>
                    <div className="expertise-areas">
                        {bio.expertiseAreas.map((area, index) => (
                            <div key={index} className="expertise-item">
                                <i className={`fas fa-${area.icon}`}></i>
                                <h4>{area.name}</h4>
                            </div>
                        ))}
                    </div>

                    {isEditable && (
                        <div className="edit-actions">
                            <button
                                className="edit-bio-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                <i className="fas fa-edit"></i> Edit Biography
                            </button>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Edit mode
    return (
        <section id="bio" className="profile-section">
            <h2>Edit Biography</h2>

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
              />
                            <button
                                className="remove-paragraph-btn"
                                onClick={() => removeParagraph(index)}
                                title="Remove paragraph"
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    ))}

                    <button
                        className="add-paragraph-btn"
                        onClick={addParagraph}
                    >
                        <i className="fas fa-plus"></i> Add Paragraph
                    </button>
                </div>

                <div className="quote-editor">
                    <h3>Quote (Optional)</h3>
                    <textarea
                        value={editedQuote}
                        onChange={(e) => setEditedQuote(e.target.value)}
                        placeholder="Add an inspirational quote..."
                        rows={2}
                    />
                </div>

                <h3>Areas of Expertise</h3>
                <div className="expertise-editor">
                    {editedExpertiseAreas.map((area, index) => (
                        <div key={index} className="expertise-area-editor">
                            <div className="expertise-field">
                                <label>Icon:</label>
                                <select
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
                                <label>Name:</label>
                                <input
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
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    ))}

                    <button
                        className="add-expertise-btn"
                        onClick={addExpertiseArea}
                    >
                        <i className="fas fa-plus"></i> Add Expertise Area
                    </button>
                </div>

                <div className="form-actions">
                    <button
                        className="cancel-btn"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="save-btn"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Bio;