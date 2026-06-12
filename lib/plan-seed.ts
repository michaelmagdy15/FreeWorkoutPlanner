export const mirnaPlan = {
  workouts: [
    // Day 1 Lower Body (Glute & Hamstring Emphasis)
    { 
      id: "d1-ex1", 
      name: "1. Dumbbell Romanian Deadlifts (RDLs)", 
      type: "strength", 
      sets: 4, 
      reps: 10, 
      weight: "2x 25 lbs", 
      completed: false, 
      day: 1, 
      img: "/assets/images/exercise_rdl.png", 
      note: "Form Instructions: Push your hips straight back as if trying to touch a wall behind you. Keep the dumbbells scraping down your shins. Stop lowering immediately when your hips stop moving back. Squeeze your glutes to stand upright." 
    },
    { 
      id: "d1-ex2", 
      name: "2. Bulgarian Split Squats", 
      type: "strength", 
      sets: 3, 
      reps: 10, 
      weight: "2x 15 lbs", 
      completed: false, 
      day: 1, 
      img: "/assets/images/exercise_split_squat.png", 
      note: "Form Instructions: Place your back foot on a bench behind you. Take a slight forward lean with your torso to shift the entire training load onto your working front glute. Control the descent down to deep depth, and drive back up through the front heel." 
    },
    { 
      id: "d1-ex3", 
      name: "3. Leg Press (High & Wide Foot Placement)", 
      type: "strength", 
      sets: 3, 
      reps: 12, 
      weight: "90 lbs", 
      completed: false, 
      day: 1, 
      note: "Form Instructions: Place your feet high and wide on the sled platform. This specific foot placement shifts the focus completely away from the quadriceps and directs the load straight onto the hamstrings and glutes. Drive out through your heels." 
    },
    { 
      id: "d1-ex4", 
      name: "4. Lying Hamstring Curls", 
      type: "strength", 
      sets: 3, 
      reps: 12, 
      weight: "40 lbs", 
      completed: false, 
      day: 1, 
      note: "Form Instructions: Lie flat and keep your hips pushed firmly down against the pad throughout the exercise. Curl the pad upward and control the eccentric lowering. On the very last set, immediately drop the weight by 30% and perform reps until failure." 
    },
    { 
      id: "d1-ex5", 
      name: "5. Core Activation Circuit (Plank & Hanging Raises)", 
      type: "strength", 
      sets: 3, 
      reps: 12, 
      weight: "Bodyweight", 
      completed: false, 
      day: 1, 
      note: "A. Plank: 3 Sets x 60 Seconds. Keep your body in a straight line, squeezing your core and glutes. B. Hanging Knee Raises: 3 Sets x 12 Reps. Hang from a bar and raise your knees to your chest, controlling the drop without swinging." 
    },

    // Day 2 Upper Body (Hourglass & Posture Focus)
    { 
      id: "d2-ex1", 
      name: "1. Seated Dumbbell Shoulder Press", 
      type: "strength", 
      sets: 3, 
      reps: 10, 
      weight: "2x 20 lbs", 
      completed: false, 
      day: 2, 
      img: "/assets/images/exercise_shoulder_press.png", 
      note: "Form Instructions: Press the dumbbells straight upward over your head while keeping your core actively engaged and back flat against the bench. Lower the weights slowly and under control to ear height." 
    },
    { 
      id: "d2-ex2", 
      name: "2. Lat Pulldowns", 
      type: "strength", 
      sets: 3, 
      reps: 12, 
      weight: "60 lbs", 
      completed: false, 
      day: 2, 
      img: "/assets/images/exercise_lat_pulldown.png", 
      note: "Form Instructions: Pull the bar down toward your upper chest by driving your elbows down. Focus on pulling from your back rather than your biceps, and squeeze your shoulder blades together at the bottom." 
    },
    { 
      id: "d2-ex3", 
      name: "3. Incline Dumbbell Chest Press", 
      type: "strength", 
      sets: 3, 
      reps: 10, 
      weight: "2x 15 lbs", 
      completed: false, 
      day: 2, 
      note: "Form Instructions: Set the workout bench to a 30-degree incline. Press dumbbells straight up. This variation is much better for upper-body shoulder stability and chest activation than standard flat benches." 
    },
    { 
      id: "d2-ex4", 
      name: "4. Dumbbell Lateral Raises (Lean-Away or Seated)", 
      type: "strength", 
      sets: 4, 
      reps: 15, 
      weight: "2x 10 lbs", 
      completed: false, 
      day: 2, 
      note: "Form Instructions: Think about pushing the dumbbells out to the walls, not just up. Keep your pinkies slightly higher than your thumbs at the peak contract position to maximize side deltoid recruitment." 
    },
    { 
      id: "d2-ex5", 
      name: "5. Cable Face Pulls (with Rope)", 
      type: "strength", 
      sets: 3, 
      reps: 15, 
      weight: "20 lbs", 
      completed: false, 
      day: 2, 
      note: "Form Instructions: Pull the rope directly toward your nose/forehead and actively separate your hands at the end. Great for shoulder joint health, scapular retraction, and posture control." 
    },
    { 
      id: "d2-ex6", 
      name: "6. Obliques Activation (Side Planks)", 
      type: "strength", 
      sets: 3, 
      reps: 1, 
      duration: 45, 
      weight: "Bodyweight", 
      completed: false, 
      day: 2, 
      note: "Form Instructions: Side Planks hold. Rest on your elbow, raise your hips, and squeeze your oblique muscles. Hold dynamically for 45s per side." 
    },

    // Day 3 Full Body (Posterior Chain & Conditioning)
    { 
      id: "d3-ex1", 
      name: "1. Barbell Hip Thrusts", 
      type: "strength", 
      sets: 4, 
      reps: 10, 
      weight: "65 lbs", 
      completed: false, 
      day: 3, 
      img: "/assets/images/exercise_hip_thrust.png", 
      note: "Form Instructions: Hold the squeeze for 2 seconds at the top of every rep. Keep your chin tucked forward looking at the wall in front of you throughout the entire movement. Do not arch your lower back." 
    },
    { 
      id: "d3-ex2", 
      name: "2. Dumbbell Goblet Squats", 
      type: "strength", 
      sets: 3, 
      reps: 12, 
      weight: "30 lbs", 
      completed: false, 
      day: 3, 
      img: "/assets/images/exercise_goblet_squat.png", 
      note: "Form Instructions: Hold a single heavy dumbbell vertically at your chest. Drop as deep as your hip mobility allows while keeping your chest upright and core braced." 
    },
    { 
      id: "d3-ex3", 
      name: "3. Seated Cable Rows", 
      type: "strength", 
      sets: 3, 
      reps: 12, 
      weight: "50 lbs", 
      completed: false, 
      day: 3, 
      note: "Form Instructions: Pull the attachment toward your lower stomach, squeezing your shoulder blades together. Control the eccentric extension back to standard arm stretch." 
    },
    { 
      id: "d3-ex4", 
      name: "4. DB Hammer Curls Super-set with Overhead Triceps Extensions", 
      type: "strength", 
      sets: 3, 
      reps: 12, 
      weight: "2x 10 lbs", 
      completed: false, 
      day: 3, 
      note: "A. Dumbbell Hammer Curls: 3 Sets x 12 Reps. Palms face each other. B. Overhead Triceps Extensions: 3 Sets x 12 Reps. Hinge elbows to lower dumbbell behind head. Perform back-to-back with no rest." 
    },
    { 
      id: "d3-ex5", 
      name: "5. Finisher: Cardio Conditioning (Stairmaster)", 
      type: "cardio", 
      sets: 1, 
      reps: 1, 
      duration: 20, 
      weight: "Level 6", 
      completed: false, 
      day: 3, 
      note: "Form Instructions: Complete 15 to 20 minutes on the Stairmaster or Incline Treadmill at a steady, challenging conditioning pace." 
    }
  ],
  meals: [
    { id: "meal-1", mealType: "breakfast", name: "Greek Yogurt Bowl with Chia Seeds & Berries", calories: 320, protein: 25, carbs: 35, fat: 8, time: "08:00" },
    { id: "meal-2", mealType: "lunch", name: "Grilled Chicken Breast with Quinoa & Steamed Asparagus", calories: 480, protein: 40, carbs: 45, fat: 12, time: "13:00" },
    { id: "meal-3", mealType: "snack", name: "Whey Protein Shake & Almonds", calories: 250, protein: 30, carbs: 10, fat: 10, time: "16:30" },
    { id: "meal-4", mealType: "dinner", name: "Pan-Seared Salmon with Sweet Potato & Broccoli", calories: 550, protein: 35, carbs: 40, fat: 22, time: "19:30" }
  ],
  recommendations: [
    "Prioritize progressive overload on RDLs: strive for 10 reps with perfect tension before increasing weight.",
    "Maintain strict eccentric control (3 seconds down) on all strength work to break through the plateau.",
    "Consume 130g of protein daily to support recovery and lean muscle tissue alignment."
  ]
};
