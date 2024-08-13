import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = ({ loggedin }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};

    // Client-side validation
    if (currentPassword === newPassword) {
      errors.newPassword = "New password cannot be the same as current password";
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (newPassword.length < 8) {
      errors.newPasswordLength = "Password is too short. It must be at least 8 characters.";
    } 
    if (!/\d/.test(newPassword)) {
      errors.newPasswordNumber = "Password must include a number.";
    } 
    if (!/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(newPassword)) {
      errors.newPasswordSpecial = "Password must include at least one special character.";
    }
    
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const uuid = localStorage.getItem('uuid'); // Assuming UUID is stored in localStorage for now
      axios.post('http://localhost:3001/api/change-password', {
        uuid,
        currentPassword,
        newPassword
      })
      .then(() => {
        alert('Password changed successfully!');
        navigate('/Home');
      })
      .catch(error => {
        if (error.response && error.response.data) {
          alert(error.response.data);
        } else {
          console.error('Failed to change password:', error);
          alert('Failed to change password.');
        }
      });
    }
  };

  const uuid = localStorage.getItem('uuid')
  if (!loggedin || !uuid) {
    return <div>Cannot view without Logging in.</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="current-password">
          <input
            placeholder="Current Password"
            type="password"
            name="currentPassword"
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          {formErrors.currentPassword && <p className="error">{formErrors.currentPassword}</p>}
        </div>

        <div className="new-password">
          <input
            placeholder="New Password"
            type="password"
            name="newPassword"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {formErrors.newPassword && <p className="error">{formErrors.newPassword}</p>}
          {formErrors.newPasswordLength && <p className="error">{formErrors.newPasswordLength}</p>}
          {formErrors.newPasswordNumber && <p className="error">{formErrors.newPasswordNumber}</p>}
          {formErrors.newPasswordSpecial && <p className="error">{formErrors.newPasswordSpecial}</p>}
        </div>

        <div className="confirm-password">
          <input
            placeholder="Confirm New Password"
            type="password"
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {formErrors.confirmPassword && <p className="error">{formErrors.confirmPassword}</p>}
        </div>

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
