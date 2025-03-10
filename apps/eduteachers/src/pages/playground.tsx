// src/components/profile/CV.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { CV as CVProps, Education, Experience, Certification } from '@/types';
import { useTeachers } from '../../contexts';
import '../../styles/components/profile/cv.css';

interface CVComponentProps {
    cv: CVProps;
    isEditable: boolean;
    isEditing: boolean;
    teacherId: string;
    onEditToggle: () => void;
}

const CV: React.FC<CVComponentProps> = ({
                                            cv,
                                            isEditable,
                                            isEditing,
                                            teacherId,
                                            onEditToggle
                                        }) => {
    const { updateTeacherSection } = useTeachers();

    // State for editing
    const [editedEducation, setEditedEducation] = useState<Education[]>([]);
    const [editedExperience, setEditedExperience] = useState<Experience[]>([]);
    const [editedCertifications, setEditedCertifications] = useState<Certification[]>([]);
    const [editedSkills, setEditedSkills] = useState<string[]>([]);
    const [editedLanguages, setEditedLanguages] = useState<string[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize edit state
    useEffect(() => {
        if (cv) {
            setEditedEducation(cv.education ? [...cv.education] : []);
            setEditedExperience(cv.experience ? [...cv.experience] : []);
            setEditedCertifications(cv.certifications ? [...cv.certifications] : []);
            setEditedSkills(cv.skills ? [...cv.skills] : []);
            setEditedLanguages(cv.languages ? [...cv.languages] : []);
        }
        // Clear validation errors when toggling edit mode
        if (!isEditing) {
            setValidationErrors([]);
        }
    }, [cv, isEditing]);

    // Validate CV data
    const validateCV = useCallback((): boolean => {
        const errors: string[] = [];

        // Check if at least one education entry is present and valid
        if (!editedEducation.length) {
            errors.push('At least one education entry is required');
        } else if (editedEducation.some(edu => !edu.degree.trim() || !edu.institution.trim())) {
            errors.push('Education entries must include degree and institution');
        }

        // Check if at least one experience entry is present and valid
        if (!editedExperience.length) {
            errors.push('At least one professional experience entry is required');
        } else if (editedExperience.some(exp => !exp.position.trim() || !exp.company.trim())) {
            errors.push('Experience entries must include position and company');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    }, [editedEducation, editedExperience]);

    // Save edits
    const handleSave = async () => {
        if (!validateCV()) {
            return;
        }

        setIsSaving(true);
        try {
            // Prepare updated CV
            const updatedCV: CVProps = {
                education: editedEducation,
                experience: editedExperience,
                certifications: editedCertifications,
                skills: editedSkills,
                languages: editedLanguages
            };

            const success = await updateTeacherSection(teacherId, 'cv', updatedCV);

            if (success) {
                // Exit edit mode on successful save
                onEditToggle();
            }
        } catch (error) {
            console.error('Error saving CV:', error);
            setValidationErrors(['Failed to save changes. Please try again.']);
        } finally {
            setIsSaving(false);
        }
    };

    // Cancel edits
    const handleCancel = () => {
        // Reset to original values
        setEditedEducation(cv.education ? [...cv.education] : []);
        setEditedExperience(cv.experience ? [...cv.experience] : []);
        setEditedCertifications(cv.certifications ? [...cv.certifications] : []);
        setEditedSkills(cv.skills ? [...cv.skills] : []);
        setEditedLanguages(cv.languages ? [...cv.languages] : []);
        setValidationErrors([]);

        // Exit edit mode
        onEditToggle();
    };

    // Education CRUD operations
    const addEducation = () => {
        const newEducation: Education = {
            id: `edu-${Date.now()}`,
            years: '',
            degree: '',
            institution: '',
            highlight: ''
        };
        setEditedEducation([...editedEducation, newEducation]);
    };

    const updateEducation = (index: number, field: keyof Education, value: string) => {
        const newEducation = [...editedEducation];
        newEducation[index] = { ...newEducation[index], [field]: value };
        setEditedEducation(newEducation);
    };

    const removeEducation = (index: number) => {
        const newEducation = [...editedEducation];
        newEducation.splice(index, 1);
        setEditedEducation(newEducation);
    };

    // Experience CRUD operations
    const addExperience = () => {
        const newExperience: Experience = {
            id: `exp-${Date.now()}`,
            years: '',
            position: '',
            company: '',
            achievements: ['']
        };
        setEditedExperience([...editedExperience, newExperience]);
    };

    const updateExperience = (index: number, field: keyof Omit<Experience, 'achievements'>, value: string) => {
        const newExperience = [...editedExperience];
        newExperience[index] = { ...newExperience[index], [field]: value };
        setEditedExperience(newExperience);
    };

    const updateAchievement = (expIndex: number, achievementIndex: number, value: string) => {
        const newExperience = [...editedExperience];
        const achievements = [...newExperience[expIndex].achievements];
        achievements[achievementIndex] = value;
        newExperience[expIndex] = { ...newExperience[expIndex], achievements };
        setEditedExperience(newExperience);
    };

    const addAchievement = (expIndex: number) => {
        const newExperience = [...editedExperience];
        newExperience[expIndex].achievements.push('');
        setEditedExperience(newExperience);
    };

    const removeAchievement = (expIndex: number, achievementIndex: number) => {
        const newExperience = [...editedExperience];
        const achievements = [...newExperience[expIndex].achievements];
        achievements.splice(achievementIndex, 1);
        newExperience[expIndex] = { ...newExperience[expIndex], achievements };
        setEditedExperience(newExperience);
    };

    const removeExperience = (index: number) => {
        const newExperience = [...editedExperience];
        newExperience.splice(index, 1);
        setEditedExperience(newExperience);
    };

    // Certification CRUD operations
    const addCertification = () => {
        const newCertification: Certification = {
            id: `cert-${Date.now()}`,
            year: '',
            name: '',
            issuer: ''
        };
        setEditedCertifications([...editedCertifications, newCertification]);
    };

    const updateCertification = (index: number, field: keyof Certification, value: string) => {
        const newCertifications = [...editedCertifications];
        newCertifications[index] = { ...newCertifications[index], [field]: value };
        setEditedCertifications(newCertifications);
    };

    const removeCertification = (index: number) => {
        const newCertifications = [...editedCertifications];
        newCertifications.splice(index, 1);
        setEditedCertifications(newCertifications);
    };

    // Skills and Languages handling
    const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const skillsText = e.target.value;
        const skillsArray = skillsText.split(',')
            .map(skill => skill.trim())
            .filter(skill => skill !== '');
        setEditedSkills(skillsArray);
    };

    const handleLanguagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const languagesText = e.target.value;
        const languagesArray = languagesText.split(',')
            .map(language => language.trim())
            .filter(language => language !== '');
        setEditedLanguages(languagesArray);
    };

    // Display mode (not editing)
    if (!isEditable || !isEditing) {
        return (
            <section id="cv" className="profile-section">
                <div className="section-header">
                    <h2>Curriculum Vitae</h2>
                    {isEditable && (
                        <button
                            className="edit-cv-btn"
                            onClick={onEditToggle}
                            aria-label="Edit CV"
                        >
                            <i className="fas fa-edit"></i> Edit CV
                        </button>
                    )}
                </div>

                <div className="cv-section">
                    <h3><i className="fas fa-graduation-cap"></i> Education</h3>
                    {cv.education && cv.education.map(edu => (
                        <div key={edu.id} className="cv-item">
                            <div className="cv-year">{edu.years}</div>
                            <div className="cv-details">
                                <h4>{edu.degree}</h4>
                                <p>{edu.institution}</p>
                                {edu.highlight && <p className="cv-highlight">{edu.highlight}</p>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cv-section">
                    <h3><i className="fas fa-briefcase"></i> Professional Experience</h3>
                    {cv.experience && cv.experience.map(exp => (
                        <div key={exp.id} className="cv-item">
                            <div className="cv-year">{exp.years}</div>
                            <div className="cv-details">
                                <h4>{exp.position}</h4>
                                <p>{exp.company}</p>
                                <ul>
                                    {exp.achievements && exp.achievements.map((achievement, index) => (
                                        <li key={index}>{achievement}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cv-section">
                    <h3><i className="fas fa-award"></i> Certifications & Awards</h3>
                    {cv.certifications && cv.certifications.map(cert => (
                        <div key={cert.id} className="cv-item">
                            <div className="cv-year">{cert.year}</div>
                            <div className="cv-details">
                                <h4>{cert.name}</h4>
                                <p>{cert.issuer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {cv.skills && cv.skills.length > 0 && (
                    <div className="cv-section">
                        <h3><i className="fas fa-tools"></i> Skills</h3>
                        <div className="skills-list">
                            {cv.skills.map((skill, index) => (
                                <span key={index} className="skill-badge">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {cv.languages && cv.languages.length > 0 && (
                    <div className="cv-section">
                        <h3><i className="fas fa-language"></i> Languages</h3>
                        <div className="languages-list">
                            {cv.languages.map((language, index) => (
                                <span key={index} className="language-badge">{language}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="cv-actions">
                    <a href="#" className="btn-primary" aria-label="Download CV">
                        <i className="fas fa-download"></i> Download Full CV
                    </a>
                </div>
            </section>
        );
    }

    // Edit mode
    return (
        <section id="cv" className="profile-section">
            <div className="section-header">
                <h2>Edit Curriculum Vitae</h2>
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

            <div className="cv-edit-form">
                <div className="cv-edit-section">
                    <h3><i className="fas fa-graduation-cap"></i> Education</h3>
                    {editedEducation.map((edu, index) => (
                        <div key={edu.id} className="cv-edit-item">
                            <div className="cv-edit-fields">
                                <div className="field-group">
                                    <label htmlFor={`edu-years-${index}`}>Years:</label>
                                    <input
                                        id={`edu-years-${index}`}
                                        type="text"
                                        value={edu.years}
                                        onChange={(e) => updateEducation(index, 'years', e.target.value)}
                                        placeholder="e.g., 2015-2019"
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor={`edu-degree-${index}`}>Degree/Certificate:</label>
                                    <input
                                        id={`edu-degree-${index}`}
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                        placeholder="e.g., B.Sc. in Mathematics"
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor={`edu-institution-${index}`}>Institution:</label>
                                    <input
                                        id={`edu-institution-${index}`}
                                        type="text"
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                        placeholder="e.g., University of California"
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor={`edu-highlight-${index}`}>Highlight (Optional):</label>
                                    <input
                                        id={`edu-highlight-${index}`}
                                        type="text"
                                        value={edu.highlight || ''}
                                        onChange={(e) => updateEducation(index, 'highlight', e.target.value)}
                                        placeholder="e.g., Graduated with honors"
                                    />
                                </div>
                            </div>

                            <button
                                className="remove-item-btn"
                                onClick={() => removeEducation(index)}
                                aria-label="Remove education"
                                disabled={editedEducation.length <= 1}
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    ))}

                    <button
                        className="add-item-btn"
                        onClick={addEducation}
                        aria-label="Add education"
                    >
                        <i className="fas fa-plus"></i> Add Education
                    </button>
                </div>

                <div className="cv-edit-section">
                    <h3><i className="fas fa-briefcase"></i> Professional Experience</h3>
                    {editedExperience.map((exp, expIndex) => (
                        <div key={exp.id} className="cv-edit-item">
                            <div className="cv-edit-fields">
                                <div className="field-group">
                                    <label htmlFor={`exp-years-${expIndex}`}>Years:</label>
                                    <input
                                        id={`exp-years-${expIndex}`}
                                        type="text"
                                        value={exp.years}
                                        onChange={(e) => updateExperience(expIndex, 'years', e.target.value)}
                                        placeholder="e.g., 2020-Present"
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor={`exp-position-${expIndex}`}>Position:</label>
                                    <input
                                        id={`exp-position-${expIndex}`}
                                        type="text"
                                        value={exp.position}
                                        onChange={(e) => updateExperience(expIndex, 'position', e.target.value)}
                                        placeholder="e.g., Senior Mathematics Teacher"
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor={`exp-company-${expIndex}`}>Company/Organization:</label>
                                    <input
                                        id={`exp-company-${expIndex}`}
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                                        placeholder="e.g., Springfield High School"
                                        required
                                    />
                                </div>

                                <div className="field-group achievements">
                                    <label>Achievements/Responsibilities:</label>
                                    {exp.achievements.map((achievement, achievementIndex) => (
                                        <div key={achievementIndex} className="achievement-input">
                                            <input
                                                type="text"
                                                value={achievement}
                                                onChange={(e) => updateAchievement(expIndex, achievementIndex, e.target.value)}
                                                placeholder="e.g., Increased student test scores by 15%"
                                            />

                                            <button
                                                className="remove-achievement-btn"
                                                onClick={() => removeAchievement(expIndex, achievementIndex)}
                                                aria-label="Remove achievement"
                                                disabled={exp.achievements.length <= 1}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        className="add-achievement-btn"
                                        onClick={() => addAchievement(expIndex)}
                                        aria-label="Add achievement"
                                    >
                                        <i className="fas fa-plus"></i> Add Achievement
                                    </button>
                                </div>
                            </div>

                            <button
                                className="remove-item-btn"
                                onClick={() => removeExperience(expIndex)}
                                aria-label="Remove experience"
                                disabled={editedExperience.length <= 1}
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    ))}

                    <button
                        className="add-item-btn"
                        onClick={addExperience}
                        aria-label="Add experience"
                    >
                        <i className="fas fa-plus"></i> Add Experience
                    </button>
                </div>

                <div className="cv-edit-section">
                    <h3><i className="fas fa-award"></i> Certifications & Awards</h3>
                    {editedCertifications.map((cert, index) => (
                        <div key={cert.id} className="cv-edit-item">
                            <div className="cv-edit-fields">
                                <div className="field-group">
                                    <label htmlFor={`cert-year-${index}`}>Year:</label>
                                    <input
                                        id={`cert-year-${index}`}
                                        type="text"
                                        value={cert.year}
                                        onChange={(e) => updateCertification(index, 'year', e.target.value)}
                                        placeholder="e.g., 2022"
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor={`cert-name-${index}`}>Name:</label>
                                    <input
                                        id={`cert-name-${index}`}
                                        type="text"
                                        value={cert.name}
                                        onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                        placeholder="e.g., Advanced Teaching Certification"
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor={`cert-issuer-${index}`}>Issuing Organization:</label>
                                    <input
                                        id={`cert-issuer-${index}`}
                                        type="text"
                                        value={cert.issuer}
                                        onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                        placeholder="e.g., National Board of Professional Teaching Standards"
                                    />
                                </div>
                            </div>

                            <button
                                className="remove-item-btn"
                                onClick={() => removeCertification(index)}
                                aria-label="Remove certification"
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    ))}

                    <button
                        className="add-item-btn"
                        onClick={addCertification}
                        aria-label="Add certification"
                    >
                        <i className="fas fa-plus"></i> Add Certification
                    </button>
                </div>

                <div className="cv-edit-section">
                    <h3><i className="fas fa-tools"></i> Skills (Optional)</h3>
                    <p className="field-help">Enter skills separated by commas (e.g., "Mathematics, Tutoring, Curriculum Development")</p>
                    <textarea
                        value={editedSkills.join(', ')}
                        onChange={handleSkillsChange}
                        placeholder="Enter your skills, separated by commas"
                        rows={3}
                    />
                </div>

                <div className="cv-edit-section">
                    <h3><i className="fas fa-language"></i> Languages (Optional)</h3>
                    <p className="field-help">Enter languages separated by commas (e.g., "English, Spanish, French")</p>
                    <textarea
                        value={editedLanguages.join(', ')}
                        onChange={handleLanguagesChange}
                        placeholder="Enter languages, separated by commas"
                        rows={3}
                    />
                </div>

                <div className="form-actions">
                    <button
                        className="cancel-btn"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        className="save-btn"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CV;