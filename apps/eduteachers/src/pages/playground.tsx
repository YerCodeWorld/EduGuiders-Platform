// src/components/profile/PersonalRules.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { PersonalRules as PersonalRulesProps } from '@/types';
import { useTeachers } from '../../contexts';
import '../../styles/components/profile/personalRules.css';

interface PersonalRulesComponentProps {
    personalRules: PersonalRulesProps;
    isEditable: boolean;
    isEditing: boolean;
    teacherId: string;
    onEditToggle: () => void;
}

const PersonalRules: React.FC<PersonalRulesComponentProps> = ({
                                                                  personalRules,
                                                                  isEditable,
                                                                  isEditing,
                                                                  teacherId,
                                                                  onEditToggle
                                                              }) => {
    const { updatePersonalRules } = useTeachers();

    // Component state
    const [editedRules, setEditedRules] = useState<string[]>([]);
    const [editedDisclaimer, setEditedDisclaimer] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Initialize state from props
    useEffect(() => {
        if (personalRules) {
            setEditedRules(personalRules.rules || []);
            setEditedDisclaimer(personalRules.disclaimer || '');
        }

        // Clear validation errors when toggling edit mode
        if (!isEditing) {
            setValidationErrors([]);
        }
    }, [personalRules, isEditing]);

    // Validate data before saving
    const validatePersonalRules = useCallback((): boolean => {
        const errors: string[] = [];

        if (!editedRules.length) {
            errors.push('At least one rule is required');
        } else if (editedRules.some(rule => !rule.trim())) {
            errors.push('Rules cannot be empty');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    }, [editedRules]);

    // Handle saving changes
    const handleSave = async () => {
        if (!validatePersonalRules()) {
            return;
        }

        setIsSaving(true);
        try {
            const updatedPersonalRules: PersonalRulesProps = {
                rules: editedRules.filter(rule => rule.trim() !== ''),
                disclaimer: editedDisclaimer
            };

            const success = await updatePersonalRules(teacherId, updatedPersonalRules);

            if (success) {
                onEditToggle(); // Exit edit mode
            }
        } catch (error) {
            console.error('Error saving personal rules:', error);
            setValidationErrors(['Failed to save changes. Please try again.']);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle canceling edits
    const handleCancel = () => {
        // Reset to original values
        setEditedRules(personalRules.rules || []);
        setEditedDisclaimer(personalRules.disclaimer || '');
        setValidationErrors([]);

        // Exit edit mode
        onEditToggle();
    };

    // Handle adding a new rule
    const addRule = () => {
        setEditedRules([...editedRules, '']);
    };

    // Handle updating a rule
    const updateRule = (index: number, value: string) => {
        const newRules = [...editedRules];
        newRules[index] = value;
        setEditedRules(newRules);
    };

    // Handle removing a rule
    const removeRule = (index: number) => {
        const newRules = [...editedRules];
        newRules.splice(index, 1);
        setEditedRules(newRules);
    };

    // Display mode (not editing)
    if (!isEditable || !isEditing) {
        return (
            <section id="personal-rules" className="profile-section">
                <div className="section-header">
                    <h2>Personal Rules</h2>
                    {isEditable && (
                        <button
                            className="edit-btn"
                            onClick={onEditToggle}
                            aria-label="Edit personal rules"
                        >
                            <i className="fas fa-edit"></i> Edit Personal Rules
                        </button>
                    )}
                </div>

                <div className="personal-rules-content">
                    <div className="rules-list">
                        <h3>Classroom Rules & Expectations</h3>
                        {personalRules.rules && personalRules.rules.length > 0 ? (
                            <ol className="rules">
                                {personalRules.rules.map((rule, index) => (
                                    <li key={index} className="rule-item">
                                        {rule}
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p className="empty-content">No personal rules provided yet.</p>
                        )}
                    </div>

                    {personalRules.disclaimer && (
                        <div className="rules-disclaimer">
                            <h3>Additional Information</h3>
                            <p>{personalRules.disclaimer}</p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Edit mode
    return (
        <section id="personal-rules" className="profile-section">
            <div className="section-header">
                <h2>Edit Personal Rules</h2>
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

            <div className="personal-rules-edit-form">
                <div className="form-group">
                    <label>Classroom Rules & Expectations</label>
                    <p className="field-help">
                        List the rules and expectations for your students during sessions
                    </p>

                    {editedRules.map((rule, index) => (
                        <div key={index} className="rule-input">
                            <input
                                type="text"
                                value={rule}
                                onChange={(e) => updateRule(index, e.target.value)}
                                placeholder={`Rule #${index + 1}`}
                                aria-label={`Rule ${index + 1}`}
                            />
                            <button
                                className="remove-rule-btn"
                                onClick={() => removeRule(index)}
                                aria-label="Remove rule"
                                disabled={editedRules.length <= 1}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    ))}

                    <button
                        className="add-rule-btn"
                        onClick={addRule}
                        aria-label="Add rule"
                    >
                        <i className="fas fa-plus"></i> Add Rule
                    </button>
                </div>

                <div className="form-group">
                    <label htmlFor="disclaimer">Additional Information (Optional)</label>
                    <textarea
                        id="disclaimer"
                        value={editedDisclaimer}
                        onChange={(e) => setEditedDisclaimer(e.target.value)}
                        placeholder="Add any additional information or disclaimer..."
                        rows={4}
                    />
                    <p className="field-help">
                        You can provide additional context or important notes about your teaching approach
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

export default PersonalRules;