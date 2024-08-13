import React, { useState, useEffect } from "react";
import "./diet.css";
import axios from 'axios';

import { useNavigate } from "react-router-dom";

const Diet = ({ loggedin }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    healthGoals: "",
    planType: "",
    currentDay: "",
  });
  const [userInfo, setUserInfo] = useState(null);
  const [BMR1, setBMR1] = useState(0);
  const [showPlan, setShowPlan] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState({
    breakfast: [],
    snack: [],
    dinner: [],
  });
  const [recipes, setRecipes] = useState({
    breakfast: [],
    snack: [],
    dinner: [],
  });
  const [weeklyRecipes, setWeeklyrecipes] = useState({
    monday: { breakfast: [], snack: [], dinner: [] },
    tuesday: { breakfast: [], snack: [], dinner: [] },
    wednesday: { breakfast: [], snack: [], dinner: [] },
    thursday: { breakfast: [], snack: [], dinner: [] },
    friday: { breakfast: [], snack: [], dinner: [] },
    saturday: { breakfast: [], snack: [], dinner: [] },
    sunday: { breakfast: [], snack: [], dinner: [] },
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevUserInfo) => ({ ...prevUserInfo, [name]: value }));
  };
  const saveAndNavigate = () => {
    if (profile.planType === "daily") {
      localStorage.setItem("finalMealPlan", JSON.stringify(selectedRecipes));
    } else if (profile.planType === "weekly") {
      localStorage.setItem("finalMealPlan", JSON.stringify(weeklyRecipes));
    }
    navigate("/dietplan");
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      const uuid = localStorage.getItem('uuid');
      if (uuid) {
        try {
          const response = await axios.get(`http://localhost:3001/api/user/${uuid}`);
          setUserInfo(response.data); 
        } catch (error) {
          console.error('Error fetching user details:', error);
          setUserInfo({});
        }
      }
    };
    if (loggedin) {
      fetchUserDetails(); 
    }
  }, [loggedin]);
  const isValidUserInfo = (userInfo) => {
    const requiredFields = [
      "age",
      "weight",
      "height",
      "activityLevel",
      "gender",
      "dietaryPreferences",
    ];
    return requiredFields.every((field) => userInfo && userInfo[field]);
  };
 
  useEffect(() => {
    console.log("Selected Recipes Updated:", selectedRecipes);
  }, [selectedRecipes]);

  useEffect(() => {
    localStorage.setItem("mealPlan", JSON.stringify(selectedRecipes));
  }, [selectedRecipes]);

  useEffect(() => {
    if (!userInfo) return;
    const calculateBMR = () => {
      let BMR =
        10 * userInfo.weight +
        6.25 * userInfo.height -
        5 * userInfo.age +
        (userInfo.gender === "male" ? 5 : 161);
      BMR *=
        {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
        }[userInfo.activityLevel] || 1;
      if (profile.healthGoals === "weightLoss") {
        BMR -= 550;
      } else if (profile.healthGoals === "muscleGain") {
        BMR += 550;
      }
      return BMR;
    };

    let BMR = calculateBMR();
    setBMR1(BMR);
  }, [userInfo, profile.healthGoals]);

  const recipeTotalCalories = () => {
    let totalCalories = 0;
    if (profile.planType === "daily") {
      totalCalories = Object.values(selectedRecipes)
        .flat()
        .reduce((total, recipe) => total + (recipe.calories || 0), 0);
    } else if (profile.planType === "weekly" && profile.currentDay) {
      const dayMeals = weeklyRecipes[profile.currentDay];
      totalCalories = Object.values(dayMeals)
        .flat()
        .reduce((total, recipe) => total + (recipe.calories || 0), 0);
    }
    return totalCalories;
  };

  const handleRecipeSelect = (mealType, recipe) => {
    if (profile.planType === "daily") {
      const isAlreadySelected = selectedRecipes[mealType].some(
        (r) => r.uri === recipe.uri
      );
      const updatedRecipes = isAlreadySelected
        ? selectedRecipes[mealType].filter((r) => r.uri !== recipe.uri)
        : [...selectedRecipes[mealType], recipe];

      setSelectedRecipes((prev) => ({
        ...prev,
        [mealType]: updatedRecipes,
      }));
    } else if (profile.planType === "weekly") {
      const currentDay = profile.currentDay;
      const dayRecipes = weeklyRecipes[currentDay][mealType];
      const isAlreadySelected = dayRecipes.some((r) => r.uri === recipe.uri);
      const updatedDayRecipes = isAlreadySelected
        ? dayRecipes.filter((r) => r.uri !== recipe.uri)
        : [...dayRecipes, recipe];

      setWeeklyrecipes((prev) => ({
        ...prev,
        [currentDay]: {
          ...prev[currentDay],
          [mealType]: updatedDayRecipes,
        },
      }));
    }
  };
  const fetchRecipes = async (dietaryPreference, mealType, healthGoal) => {
    const app_id = "c4c29d9f";
    const app_key = "2deff87c7c488824b9a0890dd5625b17";
    const url = `https://api.edamam.com/api/recipes/v2?type=public&q=&app_id=${app_id}&app_key=${app_key}&health=${dietaryPreference}&mealType=${mealType}&diet=${healthGoal}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setRecipes((prev) => ({
        ...prev,
        [mealType]: data.hits.map((hit) => hit.recipe),
      }));
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValidUserInfo(userInfo)) {
      alert("Please complete your profile to create a diet plan.");
      return;
    }
    const goals =
      {
        weightLoss: "low-fat",
        muscleGain: "high-protein",
        healthImprovement: "balanced",
      }[profile.healthGoals] || "balanced";

    await Promise.all(
      ["breakfast", "snack", "dinner"].map((mealType) =>
        fetchRecipes(userInfo.dietaryPreferences, mealType, goals)
      )
    );
  };
  const uuid = localStorage.getItem('uuid')
  if (!loggedin || !uuid) {
    return <div>Cannot view without Logging in.</div>;
  }
  if (loggedin && isValidUserInfo(userInfo)) {
    return (
      <div>
        <h1>Create Your Diet Plan</h1>
        <form onSubmit={handleSubmit}>
          <br />
          <label htmlFor="healthGoals">Health Goals:</label>
          <select
            name="healthGoals"
            value={profile.healthGoals}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="weightLoss">Weight Loss</option>
            <option value="muscleGain">Muscle Gain</option>
            <option value="healthImprovement">Health Improvement</option>
          </select>
          <br />
          <label htmlFor="planType">Plan Type:</label>
          <select
            name="planType"
            value={profile.planType}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="daily">Daily plan</option>
            <option value="weekly">Weekly plan</option>
          </select>
          <br />
          <button type="submit">Submit</button>
          {profile.planType === "weekly" && (
            <div>
              <label htmlFor="currentDay">Current Day:</label>
              <select
                name="currentDay"
                value={profile.currentDay}
                onChange={handleChange}
                required
              >
                <option value="">Select Day...</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
          )}
        </form>
        {submitted && (
          <div>
            {["breakfast", "snack", "dinner"].map((mealType) => {
              const minCalories =
                mealType === "breakfast" ? 100 : mealType === "snack" ? 0 : 200;
              const maxCalories =
                mealType === "breakfast"
                  ? BMR1 * 0.25
                  : mealType === "snack"
                  ? BMR1 * 0.1
                  : BMR1 * 0.65;
              console.log(
                "BMR " +
                  BMR1 +
                  " maxcalories " +
                  maxCalories +
                  " mealtype " +
                  mealType
              );
              return (
                <section key={mealType} style={{ marginBottom: "20px" }}>
                  <h2 style={{ textAlign: "center" }}>
                    {mealType.toUpperCase()}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      overflowX: "auto",
                      gap: "10px",
                      padding: "10px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "10px",
                    }}
                  >
                    {recipes[mealType]
                      .filter(
                        (recipe) =>
                          recipe.calories >= minCalories &&
                          recipe.calories <= maxCalories
                      )
                      .map((recipe, index) => (
                        <div
                          key={index}
                          style={{
                            minWidth: "200px",
                            maxWidth: "200px",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            boxShadow: "2px 2px 10px #aaa",
                            padding: "10px",
                            textAlign: "center",
                            backgroundColor: "white",
                            cursor: "pointer",
                            position: "relative",
                          }}
                        >
                          <a
                            href={recipe.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <img
                              src={recipe.image}
                              alt={recipe.label}
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <p style={{ margin: "10px 0", fontWeight: "bold" }}>
                              {recipe.label}
                            </p>
                          </a>
                          <p
                            style={{ color: "#666" }}
                          >{`${recipe.calories.toFixed(0)} kcal`}</p>
                          <button
                            onClick={() => handleRecipeSelect(mealType, recipe)}
                            style={{
                              position: "absolute",
                              bottom: "1px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              padding: "5px 3px",
                              border: "none",
                              fontSize: "12px",
                              borderRadius: "10px",
                              backgroundColor: (
                                profile.planType === "weekly"
                                  ? weeklyRecipes[profile.currentDay][
                                      mealType
                                    ].some((r) => r.uri === recipe.uri)
                                  : selectedRecipes[mealType].some(
                                      (r) => r.uri === recipe.uri
                                    )
                              )
                                ? "#4CAF50"
                                : "#f0f0f0",
                              color: (
                                profile.planType === "weekly"
                                  ? weeklyRecipes[profile.currentDay][
                                      mealType
                                    ].some((r) => r.uri === recipe.uri)
                                  : selectedRecipes[mealType].some(
                                      (r) => r.uri === recipe.uri
                                    )
                              )
                                ? "white"
                                : "black",
                            }}
                          >
                            {(
                              profile.planType === "weekly"
                                ? weeklyRecipes[profile.currentDay][
                                    mealType
                                  ].some((r) => r.uri === recipe.uri)
                                : selectedRecipes[mealType].some(
                                    (r) => r.uri === recipe.uri
                                  )
                            )
                              ? "Selected"
                              : "Select"}
                          </button>
                        </div>
                      ))}
                  </div>
                </section>
              );
            })}
            <button
              onClick={() => setShowPlan(true)}
              style={{
                margin: "20px",
                padding: "5px 20px",
                fontSize: "16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "40px",
              }}
            >
              Confirm Meal Plan
            </button>
            {showPlan && (
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  padding: "90px",
                  borderRadius: "10px",
                  boxShadow: "0 0 15px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                  overflow: "auto",
                  maxHeight: "80vh",
                  maxWidth: "80vw",
                }}
              >
                <h3>
                  Your Selected{" "}
                  {profile.planType.charAt(0).toUpperCase() +
                    profile.planType.slice(1)}{" "}
                  Meal Plan:
                </h3>
                {profile.planType === "weekly" ? (
                  <div className="weekly-plan-container">
                    {Object.entries(weeklyRecipes).map(([day, meals]) => (
                      <div key={day} className="day-container">
                        <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                        {Object.entries(meals).map(([mealType, recipes]) => (
                          <p
                            key={mealType}
                          >{`${mealType.toUpperCase()}: ${recipes
                            .map((r) => r.label)
                            .join(", ")}`}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  Object.entries(selectedRecipes).map(([meal, recipes]) => (
                    <p key={meal}>{`${meal.toUpperCase()}: ${recipes
                      .map((r) => r.label)
                      .join(", ")}`}</p>
                  ))
                )}
                <p>
                  Total Recommended Calories (Based on Profile):{" "}
                  {Math.ceil(BMR1)} kcal
                </p>
                {recipeTotalCalories() > BMR1 ? (
                  <p style={{ color: "red" }}>
                    Your meal plan is over your calorie requirement by{" "}
                    {Math.ceil(recipeTotalCalories() - BMR1)} kcal.
                  </p>
                ) : (
                  <p style={{ color: "green" }}>
                    Your meal plan is within your calorie requirement.
                  </p>
                )}
                <button
                  onClick={() => setShowPlan(false)}
                  style={{ marginTop: "10px", width: "auto" }}
                >
                  Continue to Modify
                </button>
                <button
                  onClick={saveAndNavigate}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    width: "auto",
                  }}
                >
                  Save Diet Plan
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  } else if (!isValidUserInfo(userInfo)) {
    return <div>Please complete your user profile to access this feature.</div>;
  } else {
    return <div>Cannot view profile without logging in.</div>;
  }
};

export default Diet;
