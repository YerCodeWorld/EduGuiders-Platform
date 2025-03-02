// src/components/profile/CV.tsx
import React from 'react';
import { CV as CVProps } from '../../types';
import '../../styles/components/profile/cv.css';

interface CVComponentProps {
    cv: CVProps;
    isEditable: boolean;
}

const CV: React.FC<CVComponentProps> = ({ cv, isEditable }) => {
    return (
        <section id="cv" className="profile-section">
            <h2>Curriculum Vitae</h2>

            <div className="cv-section">
                <h3><i className="fas fa-graduation-cap"></i> Education</h3>
                {cv.education.map(edu => (
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
                {cv.experience.map(exp => (
                    <div key={exp.id} className="cv-item">
                        <div className="cv-year">{exp.years}</div>
                        <div className="cv-details">
                            <h4>{exp.position}</h4>
                            <p>{exp.company}</p>
                            <ul>
                                {exp.achievements.map((achievement, index) => (
                                    <li key={index}>{achievement}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cv-section">
                <h3><i className="fas fa-award"></i> Certifications & Awards</h3>
                {cv.certifications.map(cert => (
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
                <a href="#" className="btn-primary"><i className="fas fa-download"></i> Download Full CV</a>
                {isEditable && (
                    <button className="btn-edit-cv">
                        <i className="fas fa-edit"></i> Edit CV
                    </button>
                )}
            </div>
        </section>
    );
};

export default CV;