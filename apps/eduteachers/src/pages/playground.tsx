// src/components/profile/TeachingStyle.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { TeachingStyle as TeachingStyleProps } from '@/types';
import { useTeachers } from '../contexts';
import '../../styles/components/profile/teachingStyle.css';

interface TeachingStyleComponentProps {
    teachingStyle: TeachingStyleProps;
    isEditable: boolean;
    isEditing: boolean;
    teacherId: string;
    onEditToggle: () => void;
}

const TeachingStyle: React.FC<TeachingStyleComponentProps> = ({
                                                                  teachingStyle,
                                                                  isEditable,
                                                                  isEditing,
                                                                  teacherId,
                                                  onEditToggle,
 }) => {
    const { updateTeachingStyle } = useTeachers();

    // Component state
    const [editedPhilosophy, setEditedPhilosophy] = useState<string>('');
    const [editedMethodology, setEditedMethodology] = useState<string>('');
    const [editedApproaches, setEditedApproaches] = useState<string[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Initialize state from props
    useEffect(() => {
        if (teachingStyle) {
            setEditedPhilosophy(teachingStyle.philosophy || '');
            setEditedMethodology(teachingStyle.methodology || '');
            setEditedApproaches(teachingStyle.approaches || []);
        }

        // Clear validation errors when toggling edit mode
        if (!isEditing) {
            setValidationErrors([]);
        }
    }, [teachingStyle, isEditing]);

    // Validate data before saving
    const validateTeachingStyle = useCallback((): boolean => {
        const errors: string[] = [];

        if (!editedPhilosophy.trim()) {
            errors.push('Teaching philosophy is required');
        }

        if (!editedApproaches.length) {
            errors.push('At least one teaching approach is required');
        } else if (editedApproaches.some(approach => !approach.trim())) {
            errors.push('Teaching approaches cannot be empty');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    }, [editedPhilosophy, editedApproaches]);

    // Handle saving changes
    const handleSave = async () => {
        if (!validateTeachingStyle()) {
            return;
        }

        setIsSaving(true);
        try {
            const updatedTeachingStyle: TeachingStyleProps = {
                philosophy: editedPhilosophy,
                methodology: editedMethodology,
                approaches: editedApproaches.filter(approach => approach.trim() !== '')
            };

            const success = await updateTeachingStyle(teacherId, updatedTeachingStyle);

            if (success) {
                onEditToggle(); // Exit edit mode
            }
        } catch (error) {
            console.error('Error saving teaching style:', error);
            setValidationErrors(['Failed to save changes. Please try again.']);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle canceling edits
    const handleCancel = () => {
        // Reset to original values
        setEditedPhilosophy(teachingStyle.philosophy || '');
        setEditedMethodology(teachingStyle.methodology || '');
        setEditedApproaches(teachingStyle.approaches || []);
        setValidationErrors([]);

        // Exit edit mode
        onEditToggle();
    };

    // Handle adding a new approach
    const addApproach = () => {
        setEditedApproaches([...editedApproaches, '']);
    };

    // Handle updating an approach
    const updateApproach = (index: number, value: string) => {
        const newApproaches = [...editedApproaches];
        newApproaches[index] = value;
        setEditedApproaches(newApproaches);
    };

    // Handle removing an approach
    const removeApproach = (index: number) => {
        const newApproaches = [...editedApproaches];
        newApproaches.splice(index, 1);
        setEditedApproaches(newApproaches);
    };

    // Display mode (not editing)
    if (!isEditable || !isEditing) {
        return (
            <section id="teaching-style" className="profile-section">
                <div className="section-header">
                    <h2>Teaching Style</h2>
                    {isEditable && (
                        <button
                            className="edit-btn"
                            onClick={onEditToggle}
                            aria-label="Edit teaching style"
                        >
                            <i className="fas fa-edit"></i> Edit Teaching Style
                        </button>
                    )}
                </div>

                <div className="teaching-style-content">
                    <div className="teaching-philosophy">
                        <h3>Teaching Philosophy</h3>
                        {teachingStyle.philosophy ? (
                            <p>{teachingStyle.philosophy}</p>
                        ) : (
                            <p className="empty-content">No teaching philosophy provided yet.</p>
                        )}
                    </div>

                    <div className="teaching-approaches">
                        <h3>Teaching Approaches</h3>
                        {teachingStyle.approaches && teachingStyle.approaches.length > 0 ? (
                            <ul className="approaches-list">
                                {teachingStyle.approaches.map((approach, index) => (
                                    <li key={index} className="approach-item">
                                        {approach}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="empty-content">No teaching approaches provided yet.</p>
                        )}
                    </div>

                    {teachingStyle.methodology && (
                        <div className="teaching-methodology">
                            <h3>Methodology</h3>
                            <p>{teachingStyle.methodology}</p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Edit mode
    return (
        <section id="teaching-style" className="profile-section">
            <div className="section-header">
                <h2>Edit Teaching Style</h2>
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

            <div className="teaching-style-edit-form">
                <div className="form-group">
                    <label htmlFor="philosophy">Teaching Philosophy</label>
                    <textarea
                        id="philosophy"
                        value={editedPhilosophy}
                        onChange={(e) => setEditedPhilosophy(e.target.value)}
                        placeholder="Describe your teaching philosophy..."
                        rows={5}
                        required
                    />
                    <p className="field-help">
                        Share your fundamental beliefs about teaching and learning
                    </p>
                </div>

                <div className="form-group">
                    <label>Teaching Approaches</label>
                    {editedApproaches.map((approach, index) => (
                        <div key={index} className="approach-input">
                            <input
                                type="text"
                                value={approach}
                                onChange={(e) => updateApproach(index, e.target.value)}
                                placeholder="e.g., Project-based learning"
                            />
                            <button
                                className="remove-approach-btn"
                                onClick={() => removeApproach(index)}
                                aria-label="Remove approach"
                                disabled={editedApproaches.length <= 1}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    ))}

                    <button
                        className="add-approach-btn"
                        onClick={addApproach}
                        aria-label="Add approach"
                    >
                        <i className="fas fa-plus"></i> Add Approach
                    </button>
                </div>

                <div className="form-group">
                    <label htmlFor="methodology">Methodology (Optional)</label>
                    <textarea
                        id="methodology"
                        value={editedMethodology}
                        onChange={(e) => setEditedMethodology(e.target.value)}
                        placeholder="Describe your teaching methodology..."
                        rows={4}
                    />
                    <p className="field-help">
                        Explain the specific methods you use in your teaching
                    </p>
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

export default TeachingStyle;