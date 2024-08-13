import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = (props) => {
  const { loggedin } = props;
  const [userInfo, setUserInfo] = useState({
    name: '',
    gender: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    dietaryPreferences: '',
  });
  const [uuidInfo, setUuidInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const uuid = localStorage.getItem('uuid');
      if (uuid) {
        try {
          const response = await axios.get(`http://localhost:3001/api/user/${uuid}`);
          setUuidInfo(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
          setUuidInfo({});
        }
      }
    };
    if (loggedin) {
      fetchUserDetails();
    }
  }, [loggedin]);

  useEffect(() => {
    if (uuidInfo && uuidInfo.user_name) {
      setUserInfo(prevState => ({
        ...prevState,
        name: uuidInfo.user_name, // Ensure the editable 'name' field is initialized correctly
        gender: uuidInfo.gender,
        age: uuidInfo.age === 0 ? '' : uuidInfo.age,
        weight: uuidInfo.weight === 0 ? '' : uuidInfo.weight,
        height: uuidInfo.height === 0 ? '' : uuidInfo.height,
        activityLevel: uuidInfo.activityLevel,
        dietaryPreferences: uuidInfo.dietaryPreferences,
      }));
    }
  }, [uuidInfo]);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevUserInfo => ({ ...prevUserInfo, [name]: value }));
  };

  const handleDeleteUserInfo = () => {
    const uuid = localStorage.getItem('uuid');
    if (uuid) {
      axios.put(`http://localhost:3001/api/user/${uuid}/delete`)
        .then(() => {
          localStorage.clear();
          alert('Successfully Deactivated Account');
          props.onDelete && props.onDelete();
          navigate('/login');
        })
        .catch(error => {
          console.error('Failed to deactivate account:', error);
          alert('Failed to deactivate account.');
        });
    }
  };

  const handleEditing = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const uuid = localStorage.getItem('uuid');
      try {
        const response = await axios.put(`http://localhost:3001/api/user/${uuid}`, {
          user_name: userInfo.name, // Send the updated name to the server
          gender: userInfo.gender,
          age: userInfo.age,
          weight: userInfo.weight,
          height: userInfo.height,
          activityLevel: userInfo.activityLevel,
          dietaryPreferences: userInfo.dietaryPreferences,
        });

        alert(response.data.message);
        setIsEditing(false);
        setUuidInfo({
          ...uuidInfo, 
          user_name: userInfo.name, 
          gender: userInfo.gender,
          age: userInfo.age,
          weight: userInfo.weight,
          height: userInfo.height,
          activityLevel: userInfo.activityLevel,
          dietaryPreferences: userInfo.dietaryPreferences
        }); // Update local state to reflect the new username
        localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, name: userInfo.name })); // Update local storage if necessary
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      }
    }
  };

  const validateForm = () => {
    let errors = {};
    // Name validation: at least 4 characters, no numbers or special characters
    if (userInfo.name.length < 4) {
      errors.name = "Name must be more than 4 letters.";
    } else if (/[0-9`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(userInfo.name)) {
      errors.name = "Name must not contain numbers or special characters.";
    }

    // Age, weight, height validation: should not be negative
    if (userInfo.age < 0) {
      errors.age = "Age cannot be negative.";
    }
    if (userInfo.weight < 0) {
      errors.weight = "Weight cannot be negative.";
    }
    if (userInfo.height < 0) {
      errors.height = "Height cannot be negative.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // No errors, form is valid
  };
  const uuid = localStorage.getItem('uuid')
  if (!loggedin || !uuid) {
    return <div>Cannot view profile without Logging in.</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {userInfo ? (
        <div className="profile-info">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="left-box">
                <label htmlFor="email">Email:  {uuidInfo.mail || 'loading'}</label>
                <br />
              </div>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" value={userInfo.name} onChange={handleChange} required />
              {formErrors.name && <p className="error">{formErrors.name}</p>}
              <div>
              </div>
              <label htmlFor="gender">Gender:</label>
              <select name="gender" value={userInfo.gender} onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <div>
                <br />

                <label htmlFor="age">Age:</label>
                <input type="number" name="age" value={userInfo.age} onChange={handleChange} required />
                {formErrors.age && <p className="error">{formErrors.age}</p>}
                <br />
                <label htmlFor="weight">Weight (kg):</label>
                <input type="number" name="weight" value={userInfo.weight} onChange={handleChange} required />
                {formErrors.weight && <p className="error">{formErrors.weight}</p>}
                <br />

                <label htmlFor="height">Height (cm):</label>
                <input type="number" name="height" value={userInfo.height} onChange={handleChange} required />
                {formErrors.height && <p className="error">{formErrors.height}</p>}
                <br />

                <label htmlFor="activityLevel">Activity Level:</label>
                <select name="activityLevel" value={userInfo.activityLevel} onChange={handleChange} required>
                  <option value="">Select...</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Activity</option>
                  <option value="moderate">Moderate Activity</option>
                  <option value="active">Very Active</option>
                </select>
                <br />

                <label htmlFor="dietaryPreferences">Dietary Preferences:</label>
                <select name="dietaryPreferences" value={userInfo.dietaryPreferences} onChange={handleChange} required>
                  <option value="">Select...</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="dairy-free">Dairy-Free</option>
                  <option value="alcohol-free">Alcohol-Free</option>
                </select>
              </div>

              <button type="submit">Save Changes</button>
            </form>
          ) : (
            <div>
              <p>Email: {uuidInfo.mail || 'loading'}</p>
              <p>Age: {userInfo.age === 0 ? '' : userInfo.age}</p>
              <p>Name: {uuidInfo.user_name || 'loading'}</p>
              <p>Weight: {userInfo.weight === 0 ? '' : `${userInfo.weight} kg`}</p>
              <p>Height: {userInfo.height === 0 ? '' : `${userInfo.height} cm`}</p>
              <p>Activity Level: {userInfo.activityLevel}</p>
              <p>Dietary Preferences: {userInfo.dietaryPreferences}</p>
              <p>Date Of Signup: {uuidInfo.sign_up_date || 'loading'}</p>
              <button onClick={handleEditing}>Edit Profile</button>
            </div>
          )}
          <button onClick={handleDeleteUserInfo}>Delete Account</button>
        </div>
      ) : (
        <p>No user information found.</p>
      )}
    </div>
  );
};

export default Profile;
