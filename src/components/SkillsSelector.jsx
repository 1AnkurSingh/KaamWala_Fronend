// Skills selector component - Allows workers to select their skills and proficiency levels
import React, { useState, useEffect } from 'react';
import { getAllActiveCategories } from '../services/categoryService';
import './SkillsSelector.css';

const SkillsSelector = ({ selectedSkills, onSkillsChange, isRequired = false }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getAllActiveCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSkillChange = (skillIndex, field, value) => {
    const updatedSkills = [...selectedSkills];
    updatedSkills[skillIndex] = { ...updatedSkills[skillIndex], [field]: value };
    onSkillsChange(updatedSkills);
  };

  const addSkill = () => {
    const newSkill = {
      subCategoryId: '',
      proficiencyLevel: 'BEGINNER',
      experienceYears: 0,
      skillHourlyRate: 0,
      isPrimarySkill: selectedSkills.length === 0
    };
    onSkillsChange([...selectedSkills, newSkill]);
  };

  const removeSkill = (index) => {
    const updatedSkills = selectedSkills.filter((_, i) => i !== index);
    onSkillsChange(updatedSkills);
  };

  const getSubCategories = (categoryId) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.subCategories : [];
  };

  if (loading) {
    return (
      <div className="skills-selector">
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading skills...</span>
          </div>
          <p className="mt-2 text-muted">Loading available skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="skills-selector">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Skills & Expertise</h6>
        <button 
          type="button" 
          className="btn btn-sm btn-outline-primary"
          onClick={addSkill}
        >
          <i className="fas fa-plus me-2"></i>
          Add Skill
        </button>
      </div>

      {selectedSkills.map((skill, index) => (
        <div key={index} className="skill-item border rounded p-3 mb-3">
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Skill Category</label>
              <select
                className="form-select"
                value={skill.subCategoryId}
                onChange={(e) => handleSkillChange(index, 'subCategoryId', e.target.value)}
                required={isRequired}
              >
                <option value="">Select a skill</option>
                {categories.map(category => (
                  <optgroup key={category.categoryId} label={category.categoryName}>
                    {category.subCategories.map(subCat => (
                      <option key={subCat.subCategoryId} value={subCat.subCategoryId}>
                        {subCat.subCategoryName}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-2">
              <label className="form-label">Proficiency Level</label>
              <select
                className="form-select"
                value={skill.proficiencyLevel}
                onChange={(e) => handleSkillChange(index, 'proficiencyLevel', e.target.value)}
                required={isRequired}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            <div className="col-md-4 mb-2">
              <label className="form-label">Experience (Years)</label>
              <input
                type="number"
                className="form-control"
                value={skill.experienceYears}
                onChange={(e) => handleSkillChange(index, 'experienceYears', parseInt(e.target.value) || 0)}
                min="0"
                max="50"
                required={isRequired}
              />
            </div>

            <div className="col-md-4 mb-2">
              <label className="form-label">Hourly Rate (₹)</label>
              <input
                type="number"
                className="form-control"
                value={skill.skillHourlyRate}
                onChange={(e) => handleSkillChange(index, 'skillHourlyRate', parseFloat(e.target.value) || 0)}
                min="0"
                step="50"
                required={isRequired}
              />
            </div>

            <div className="col-md-3 mb-2">
              <div className="form-check mt-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={skill.isPrimarySkill}
                  onChange={(e) => handleSkillChange(index, 'isPrimarySkill', e.target.checked)}
                />
                <label className="form-check-label">Primary Skill</label>
              </div>
                  </div>

            <div className="col-md-1 mb-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger mt-4"
                onClick={() => removeSkill(index)}
              >
                <i className="fas fa-trash"></i>
              </button>
              </div>
            </div>
          </div>
        ))}

      {selectedSkills.length === 0 && (
        <div className="text-center text-muted py-3">
          <i className="fas fa-tools fa-2x mb-2"></i>
          <p>No skills added yet. Click "Add Skill" to get started.</p>
      </div>
      )}
    </div>
  );
};

export default SkillsSelector;
