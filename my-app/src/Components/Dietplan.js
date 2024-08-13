import React, { useState, useEffect } from "react";

const DietPlan = () => {
  // State to store the meal plan
  const [mealPlan, setMealPlan] = useState(null);

  useEffect(() => {
    // Fetch the meal plan from localStorage
    const storedMealPlan = localStorage.getItem("finalMealPlan");
    if (storedMealPlan) {
      setMealPlan(JSON.parse(storedMealPlan));
    }
  }, []);

 
  const renderMeals = (meals) => {
    return meals.map((meal, index) => (
      <div
        key={index}
        style={{
          margin: "10px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          backgroundColor: "white",
        }}
      >
        <div
          key={index}
          style={{
            margin: "10px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <h4>{meal.label}</h4>
          <a
            href={meal.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              src={meal.image}
              alt={meal.label}
              style={{ width: "100px", height: "100px", borderRadius: "5px" }}
            />
          </a>
          <p>Calories: {Math.round(meal.calories)} kcal</p>
          <p>
            Dish Type: {meal.dishType.join(", ")}{" "}
            {/* assuming dishType is an array */}
          </p>
        </div>
      </div>
    ));
  };

  // Function to render daily or weekly meal plans
  const renderMealPlan = () => {
    if (!mealPlan) return <p>No meal plan found.</p>;

    const dayKeys = Object.keys(mealPlan);
    if (dayKeys.includes("monday") || dayKeys.includes("tuesday")) {
      // Check if it's a weekly plan
      return (
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            padding: "10px 0",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <div
            style={{ display: "flex", overflowX: "auto", padding: "10px 0" }}
          >
            {dayKeys.map((day) => (
              <div
                key={day}
                style={{
                  minWidth: "300px",
                  margin: "0 10px",
                  flex: "0 0 auto",
                }}
              >
                <h2>{day.charAt(0).toUpperCase() + day.slice(1)}'s Meals</h2>
                <div>
                  <h3>Breakfast</h3>
                  {mealPlan[day].breakfast.length > 0 ? (
                    renderMeals(mealPlan[day].breakfast)
                  ) : (
                    <p>No breakfast items selected.</p>
                  )}
                </div>
                <div>
                  <h3>Snack</h3>
                  {mealPlan[day].snack.length > 0 ? (
                    renderMeals(mealPlan[day].snack)
                  ) : (
                    <p>No snack items selected.</p>
                  )}
                </div>
                <div>
                  <h3>Dinner</h3>
                  {mealPlan[day].dinner.length > 0 ? (
                    renderMeals(mealPlan[day].dinner)
                  ) : (
                    <p>No dinner items selected.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      // It's a daily plan
      return (
        <div>
          <div>
            {mealPlan.breakfast.length > 0 ? (
              renderMeals(mealPlan.breakfast)
            ) : (
              <p>No breakfast items selected.</p>
            )}
          </div>
          <div>
            <h2>Snack</h2>
            {mealPlan.snack.length > 0 ? (
              renderMeals(mealPlan.snack)
            ) : (
              <p>No snack items selected.</p>
            )}
          </div>
          <div>
            <h2>Dinner</h2>
            {mealPlan.dinner.length > 0 ? (
              renderMeals(mealPlan.dinner)
            ) : (
              <p>No dinner items selected.</p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        {mealPlan && Object.keys(mealPlan).includes("monday")
          ? "Weekly Meal Plan"
          : "Daily Meal Plan"}
      </h1>
      {renderMealPlan()}
    </div>
  );
};

export default DietPlan;
