"use client"

import React, { useState } from "react"
import { Apple, Sparkles, BookOpen, Target, CheckCircle2, ChevronDown, ChevronUp, Search, Flame, Coffee, Utensils, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFitnessData } from "@/hooks/useFitnessData"
import { useUser } from "@/lib/auth"

interface Meal {
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
}

interface DietPlan {
  id: string
  title: string
  badge: string
  description: string
  theme: "babyblue" | "emerald" | "coral" | "pink"
  goal: string
  caloriesTarget: number
  proteinTarget: number
  meals: Meal[]
}

const DIET_LIBRARY: DietPlan[] = [
  // ──────────────────────────────────────────────────
  // FAT LOSS & CUTTING PLANS
  // ──────────────────────────────────────────────────
  {
    id: "aggressive-fat-loss-1200",
    title: "Aggressive Fat Loss 1200 kcal",
    badge: "PSMF-Inspired · Supervised Cutting",
    description: "A very-low-calorie, protein-sparing modified fast for rapid fat loss under professional supervision. Maximizes protein to preserve lean mass while creating a steep deficit. Not for long-term use — cycle 2-4 weeks max.",
    theme: "babyblue",
    goal: "Rapid Fat Loss & Lean Mass Preservation",
    caloriesTarget: 1200,
    proteinTarget: 140,
    meals: [
      { mealType: "breakfast", name: "Egg White Scramble (8 whites) with Spinach & Salsa", calories: 220, protein: 36, carbs: 6, fat: 2, time: "07:30 AM" },
      { mealType: "lunch", name: "Grilled Chicken Breast (6 oz) on Mixed Greens with Lemon Vinaigrette", calories: 310, protein: 42, carbs: 8, fat: 12, time: "12:30 PM" },
      { mealType: "snack", name: "Non-Fat Greek Yogurt (200g) with Cinnamon", calories: 120, protein: 20, carbs: 8, fat: 0, time: "03:30 PM" },
      { mealType: "dinner", name: "Baked Cod Fillet (7 oz) with Steamed Broccoli & Lemon", calories: 280, protein: 42, carbs: 10, fat: 6, time: "06:30 PM" },
      { mealType: "snack", name: "Casein Protein Shake (1 scoop) with Water", calories: 120, protein: 24, carbs: 3, fat: 1, time: "09:00 PM" }
    ]
  },
  {
    id: "moderate-cut-1500",
    title: "Moderate Cut 1500 kcal",
    badge: "Sustainable Deficit · Balanced Macros",
    description: "A sustainable calorie deficit that keeps energy levels stable while steadily shedding body fat. Balanced macronutrient distribution ensures training performance remains high throughout the cut.",
    theme: "emerald",
    goal: "Steady Fat Loss & Training Performance",
    caloriesTarget: 1500,
    proteinTarget: 145,
    meals: [
      { mealType: "breakfast", name: "Overnight Oats (40g) with Whey Protein, Blueberries & Almond Milk", calories: 320, protein: 30, carbs: 38, fat: 6, time: "07:00 AM" },
      { mealType: "lunch", name: "Turkey Lettuce Wraps with Hummus, Cucumber & Cherry Tomatoes", calories: 350, protein: 35, carbs: 18, fat: 14, time: "12:00 PM" },
      { mealType: "snack", name: "Apple Slices with 1 tbsp Almond Butter", calories: 180, protein: 4, carbs: 22, fat: 9, time: "03:30 PM" },
      { mealType: "dinner", name: "Herb-Crusted Salmon Fillet (5 oz) with Roasted Brussels Sprouts", calories: 420, protein: 38, carbs: 14, fat: 24, time: "07:00 PM" },
      { mealType: "snack", name: "Cottage Cheese (150g) with Sliced Strawberries", calories: 130, protein: 18, carbs: 10, fat: 2, time: "09:00 PM" }
    ]
  },
  {
    id: "keto-fat-loss-1550",
    title: "Keto Fat Loss 1550 kcal",
    badge: "Ultra-Low Carb · <30g Net Carbs",
    description: "Strict ketogenic approach keeping net carbs under 30g daily to maintain deep nutritional ketosis. High dietary fat fuels satiety while moderate protein prevents gluconeogenesis from stalling fat adaptation.",
    theme: "coral",
    goal: "Ketosis-Driven Fat Oxidation",
    caloriesTarget: 1550,
    proteinTarget: 105,
    meals: [
      { mealType: "breakfast", name: "3 Scrambled Eggs in Butter with Avocado Slices & Sautéed Spinach", calories: 420, protein: 24, carbs: 6, fat: 36, time: "08:00 AM" },
      { mealType: "lunch", name: "Tuna Salad (6 oz) with Olive Oil, Walnuts, Celery & Arugula", calories: 450, protein: 38, carbs: 5, fat: 32, time: "01:00 PM" },
      { mealType: "snack", name: "String Cheese (2 sticks) with Macadamia Nuts (15g)", calories: 210, protein: 12, carbs: 2, fat: 17, time: "04:00 PM" },
      { mealType: "dinner", name: "Pan-Seared Ribeye Steak (6 oz) with Garlic Butter Asparagus", calories: 470, protein: 38, carbs: 4, fat: 34, time: "07:00 PM" }
    ]
  },
  {
    id: "intermittent-fasting-16-8",
    title: "Intermittent Fasting 16:8 (1800 kcal)",
    badge: "Time-Restricted Eating · 8hr Window",
    description: "All calories consumed within an 8-hour eating window (12 PM - 8 PM). The 16-hour fast enhances autophagy, insulin sensitivity, and fat mobilization while large, satisfying meals prevent hunger.",
    theme: "pink",
    goal: "Metabolic Flexibility & Appetite Control",
    caloriesTarget: 1800,
    proteinTarget: 150,
    meals: [
      { mealType: "lunch", name: "Massive Chicken & Avocado Power Bowl: Grilled Chicken, Brown Rice, Black Beans, Avocado, Pico de Gallo", calories: 680, protein: 52, carbs: 62, fat: 22, time: "12:00 PM" },
      { mealType: "snack", name: "Protein Smoothie: Whey, Banana, Peanut Butter & Oat Milk", calories: 380, protein: 32, carbs: 38, fat: 12, time: "03:30 PM" },
      { mealType: "dinner", name: "Grilled Salmon (7 oz) with Roasted Sweet Potato Wedges & Steamed Green Beans", calories: 580, protein: 44, carbs: 42, fat: 22, time: "07:00 PM" },
      { mealType: "snack", name: "Greek Yogurt (200g) with Honey Drizzle & Crushed Walnuts", calories: 220, protein: 20, carbs: 18, fat: 8, time: "08:00 PM" }
    ]
  },
  {
    id: "plant-based-fat-loss-1600",
    title: "Plant-Based Fat Loss 1600 kcal",
    badge: "100% Vegan · High Fiber",
    description: "A fully vegan cutting plan rich in fiber, micronutrients, and plant protein. Strategically combines legumes, grains, and soy to form complete amino acid profiles while maintaining a caloric deficit.",
    theme: "babyblue",
    goal: "Vegan-Friendly Fat Loss & Nutrient Density",
    caloriesTarget: 1600,
    proteinTarget: 110,
    meals: [
      { mealType: "breakfast", name: "Tofu Scramble (200g firm tofu) with Bell Peppers, Onions, Turmeric & Whole Grain Toast", calories: 350, protein: 28, carbs: 30, fat: 12, time: "07:30 AM" },
      { mealType: "lunch", name: "Lentil & Quinoa Power Bowl with Roasted Chickpeas, Kale & Tahini Dressing", calories: 420, protein: 28, carbs: 52, fat: 10, time: "12:30 PM" },
      { mealType: "snack", name: "Edamame (1 cup shelled) with Sea Salt & Lime", calories: 190, protein: 18, carbs: 14, fat: 8, time: "03:30 PM" },
      { mealType: "dinner", name: "Tempeh Stir-Fry (150g) with Brown Rice, Broccoli, Snap Peas & Ginger-Soy Glaze", calories: 460, protein: 32, carbs: 50, fat: 12, time: "07:00 PM" },
      { mealType: "snack", name: "Pea Protein Shake with Unsweetened Almond Milk & Cacao Powder", calories: 150, protein: 25, carbs: 6, fat: 3, time: "09:00 PM" }
    ]
  },

  // ──────────────────────────────────────────────────
  // MAINTENANCE & LIFESTYLE PLANS
  // ──────────────────────────────────────────────────
  {
    id: "balanced-maintenance-2000",
    title: "Balanced Maintenance 2000 kcal",
    badge: "Everyday Eating · Flexible & Balanced",
    description: "A sustainable, well-rounded maintenance plan for everyday life. Moderate protein supports muscle retention, balanced carbs fuel daily activity, and healthy fats ensure hormonal health. No foods are off limits.",
    theme: "emerald",
    goal: "Sustainable Weight Maintenance & Health",
    caloriesTarget: 2000,
    proteinTarget: 130,
    meals: [
      { mealType: "breakfast", name: "2 Whole Eggs & 1 Slice Whole Grain Toast with Avocado Smash & Cherry Tomatoes", calories: 380, protein: 20, carbs: 28, fat: 22, time: "07:30 AM" },
      { mealType: "lunch", name: "Grilled Chicken Caesar Wrap with Romaine, Parmesan & Light Dressing", calories: 480, protein: 38, carbs: 36, fat: 18, time: "12:30 PM" },
      { mealType: "snack", name: "Mixed Nuts (30g) with a Medium Banana", calories: 280, protein: 8, carbs: 32, fat: 14, time: "03:30 PM" },
      { mealType: "dinner", name: "Lean Beef Stir-Fry (5 oz) with Jasmine Rice, Bell Peppers & Snow Peas", calories: 560, protein: 40, carbs: 58, fat: 16, time: "07:00 PM" },
      { mealType: "snack", name: "Low-Fat Greek Yogurt (150g) with Granola & Honey", calories: 220, protein: 16, carbs: 28, fat: 4, time: "09:00 PM" }
    ]
  },
  {
    id: "mediterranean-diet-2100",
    title: "Mediterranean Diet 2100 kcal",
    badge: "Heart-Healthy · Anti-Aging",
    description: "Inspired by the traditional eating patterns of Greece, Italy, and Spain. Centers on extra-virgin olive oil, wild-caught fish, whole grains, legumes, and abundant vegetables. Proven to reduce cardiovascular risk.",
    theme: "coral",
    goal: "Cardiovascular Health & Longevity",
    caloriesTarget: 2100,
    proteinTarget: 120,
    meals: [
      { mealType: "breakfast", name: "Mediterranean Breakfast Plate: Whole Grain Pita, Labneh, Cucumber, Tomato, Olives & Drizzle of Olive Oil", calories: 380, protein: 14, carbs: 40, fat: 18, time: "08:00 AM" },
      { mealType: "lunch", name: "Grilled Sea Bass (6 oz) with Farro Salad, Sun-Dried Tomatoes, Capers & Lemon-Herb Vinaigrette", calories: 520, protein: 38, carbs: 46, fat: 18, time: "01:00 PM" },
      { mealType: "snack", name: "Hummus (3 tbsp) with Carrot Sticks, Cucumber & Whole Wheat Crackers", calories: 220, protein: 8, carbs: 26, fat: 10, time: "04:00 PM" },
      { mealType: "dinner", name: "Herb-Roasted Chicken Thighs with Roasted Eggplant, Zucchini & Quinoa Tabbouleh", calories: 580, protein: 40, carbs: 44, fat: 24, time: "07:30 PM" },
      { mealType: "snack", name: "Fresh Figs (3) with Walnuts (20g) & a Drizzle of Honey", calories: 250, protein: 5, carbs: 34, fat: 12, time: "09:00 PM" }
    ]
  },
  {
    id: "anti-inflammatory-recovery-1900",
    title: "Anti-Inflammatory Recovery 1900 kcal",
    badge: "Omega-3 Rich · Antioxidant Dense",
    description: "Designed around anti-inflammatory superfoods: wild salmon, turmeric, ginger, dark leafy greens, berries, and extra-virgin olive oil. Ideal for athletes managing joint stress, chronic soreness, or recovery from injury.",
    theme: "pink",
    goal: "Reduce Inflammation & Accelerate Recovery",
    caloriesTarget: 1900,
    proteinTarget: 130,
    meals: [
      { mealType: "breakfast", name: "Anti-Inflammatory Smoothie Bowl: Blueberries, Tart Cherry Juice, Spinach, Turmeric, Ginger, Flaxseed & Whey", calories: 350, protein: 28, carbs: 42, fat: 8, time: "07:30 AM" },
      { mealType: "lunch", name: "Wild Salmon Poke Bowl (5 oz) with Brown Rice, Edamame, Avocado, Seaweed & Ginger-Sesame Dressing", calories: 520, protein: 36, carbs: 48, fat: 18, time: "12:30 PM" },
      { mealType: "snack", name: "Golden Turmeric Latte (Oat Milk) with Walnuts (20g)", calories: 200, protein: 6, carbs: 14, fat: 14, time: "03:30 PM" },
      { mealType: "dinner", name: "Herb-Baked Mackerel (6 oz) with Roasted Beets, Sweet Potato & Sautéed Kale", calories: 550, protein: 38, carbs: 44, fat: 22, time: "07:00 PM" },
      { mealType: "snack", name: "Tart Cherry Juice (8 oz) with Dark Chocolate (20g, 85% cacao)", calories: 210, protein: 3, carbs: 32, fat: 8, time: "09:00 PM" }
    ]
  },
  {
    id: "vegetarian-balanced-2000",
    title: "Vegetarian Balanced 2000 kcal",
    badge: "Lacto-Ovo Vegetarian · Complete Nutrition",
    description: "A nutritionally complete lacto-ovo vegetarian plan that hits all essential amino acids through strategic food combining. Eggs, dairy, legumes, and grains provide quality protein without any meat.",
    theme: "babyblue",
    goal: "Vegetarian Wellness & Complete Protein",
    caloriesTarget: 2000,
    proteinTarget: 115,
    meals: [
      { mealType: "breakfast", name: "Veggie Frittata (3 eggs) with Mushrooms, Bell Peppers, Feta & Whole Grain Toast", calories: 420, protein: 28, carbs: 28, fat: 22, time: "07:30 AM" },
      { mealType: "lunch", name: "Black Bean & Sweet Potato Buddha Bowl with Quinoa, Corn, Lime-Cilantro Dressing & Cotija Cheese", calories: 520, protein: 24, carbs: 68, fat: 14, time: "12:30 PM" },
      { mealType: "snack", name: "Greek Yogurt Parfait (200g) with Granola, Sliced Almonds & Honey", calories: 280, protein: 18, carbs: 34, fat: 8, time: "03:30 PM" },
      { mealType: "dinner", name: "Paneer Tikka Masala (150g paneer) with Basmati Rice & Raita", calories: 580, protein: 30, carbs: 56, fat: 24, time: "07:00 PM" },
      { mealType: "snack", name: "Warm Milk (250ml) with a Handful of Pistachios (20g)", calories: 230, protein: 14, carbs: 16, fat: 12, time: "09:30 PM" }
    ]
  },

  // ──────────────────────────────────────────────────
  // MUSCLE BUILDING & BULKING PLANS
  // ──────────────────────────────────────────────────
  {
    id: "clean-lean-bulk-2800",
    title: "Clean Lean Bulk 2800 kcal",
    badge: "Moderate Surplus · High Protein",
    description: "A disciplined lean bulk providing a 300-500 calorie surplus with emphasis on whole food protein sources. Designed to maximize muscle protein synthesis with minimal fat gain through timed nutrient delivery.",
    theme: "emerald",
    goal: "Lean Muscle Gain & Minimal Fat Accumulation",
    caloriesTarget: 2800,
    proteinTarget: 200,
    meals: [
      { mealType: "breakfast", name: "Oatmeal (80g) with Whey Protein, Banana, Peanut Butter (1 tbsp) & Cinnamon", calories: 550, protein: 40, carbs: 68, fat: 14, time: "07:00 AM" },
      { mealType: "lunch", name: "Grilled Chicken Breast (8 oz) with Jasmine Rice (1 cup cooked), Steamed Broccoli & Teriyaki Glaze", calories: 620, protein: 52, carbs: 68, fat: 10, time: "12:00 PM" },
      { mealType: "snack", name: "Rice Cakes (3) with Cottage Cheese (200g) & Sliced Banana", calories: 340, protein: 24, carbs: 48, fat: 4, time: "03:30 PM" },
      { mealType: "dinner", name: "Lean Ground Beef Pasta (93/7, 6 oz) with Whole Wheat Penne, Marinara & Side Salad", calories: 680, protein: 48, carbs: 72, fat: 18, time: "07:00 PM" },
      { mealType: "snack", name: "Casein Protein Shake with Whole Milk (250ml) & Almonds (20g)", calories: 380, protein: 36, carbs: 18, fat: 18, time: "09:30 PM" }
    ]
  },
  {
    id: "mass-gain-power-bulk-3500",
    title: "Mass Gain Power Bulk 3500 kcal",
    badge: "Aggressive Surplus · Hardgainer Protocol",
    description: "An aggressive caloric surplus designed for hardgainers and ectomorphs who struggle to gain weight. Six meals spread throughout the day ensure a constant anabolic environment with emphasis on calorie-dense whole foods.",
    theme: "coral",
    goal: "Maximum Muscle & Weight Gain for Hardgainers",
    caloriesTarget: 3500,
    proteinTarget: 220,
    meals: [
      { mealType: "breakfast", name: "4-Egg Omelette with Cheese, Turkey Sausage, Hash Browns & Orange Juice", calories: 720, protein: 44, carbs: 60, fat: 32, time: "07:00 AM" },
      { mealType: "snack", name: "Mass Gainer Shake: Whey, Oats (50g), Banana, Peanut Butter (2 tbsp) & Whole Milk", calories: 650, protein: 42, carbs: 72, fat: 20, time: "10:00 AM" },
      { mealType: "lunch", name: "Double Chicken Breast (10 oz) with White Rice (1.5 cups), Black Beans & Guacamole", calories: 780, protein: 58, carbs: 82, fat: 20, time: "01:00 PM" },
      { mealType: "snack", name: "Bagel with Cream Cheese, Smoked Salmon & Capers", calories: 420, protein: 24, carbs: 44, fat: 16, time: "04:00 PM" },
      { mealType: "dinner", name: "8 oz Sirloin Steak with Baked Potato (loaded with butter & sour cream), Steamed Asparagus", calories: 720, protein: 50, carbs: 52, fat: 32, time: "07:30 PM" },
      { mealType: "snack", name: "Peanut Butter & Jelly Sandwich on Whole Wheat with Casein Shake", calories: 480, protein: 32, carbs: 52, fat: 16, time: "10:00 PM" }
    ]
  },
  {
    id: "plant-based-muscle-2600",
    title: "Plant-Based Muscle 2600 kcal",
    badge: "100% Vegan · Complete Aminos",
    description: "A vegan bulking plan that strategically pairs complementary proteins (rice + beans, soy + grains) to deliver all essential amino acids. Leverages tempeh, seitan, tofu, legumes, and pea protein for muscle growth.",
    theme: "pink",
    goal: "Vegan Muscle Hypertrophy & Strength",
    caloriesTarget: 2600,
    proteinTarget: 155,
    meals: [
      { mealType: "breakfast", name: "High-Protein Oatmeal (80g) with Pea Protein, Soy Milk, Banana, Chia Seeds & Maple Syrup", calories: 520, protein: 34, carbs: 72, fat: 10, time: "07:00 AM" },
      { mealType: "lunch", name: "Seitan Stir-Fry (200g) with Brown Rice, Broccoli, Carrots & Peanut Sauce", calories: 620, protein: 48, carbs: 64, fat: 16, time: "12:00 PM" },
      { mealType: "snack", name: "Pea Protein Smoothie with Oat Milk, Frozen Mango & Spinach", calories: 300, protein: 28, carbs: 36, fat: 4, time: "03:30 PM" },
      { mealType: "dinner", name: "Baked Tofu (250g extra-firm) with Quinoa, Roasted Sweet Potato & Tahini Drizzle", calories: 580, protein: 36, carbs: 62, fat: 18, time: "07:00 PM" },
      { mealType: "snack", name: "Whole Wheat Bread (2 slices) with Almond Butter (2 tbsp) & Sliced Banana", calories: 420, protein: 14, carbs: 50, fat: 20, time: "09:30 PM" }
    ]
  },

  // ──────────────────────────────────────────────────
  // SPORT-SPECIFIC PLANS
  // ──────────────────────────────────────────────────
  {
    id: "endurance-athlete-fuel-2400",
    title: "Endurance Athlete Fuel 2400 kcal",
    badge: "High Carb · Glycogen Loading",
    description: "Optimized for runners, cyclists, swimmers, and endurance athletes. Carbohydrate-dominant macros (55-60%) maximize glycogen stores, while moderate protein supports recovery between long training sessions.",
    theme: "babyblue",
    goal: "Endurance Performance & Glycogen Optimization",
    caloriesTarget: 2400,
    proteinTarget: 120,
    meals: [
      { mealType: "breakfast", name: "Banana Pancakes (3) with Maple Syrup, Berries & a Side of Scrambled Eggs (2)", calories: 520, protein: 22, carbs: 76, fat: 14, time: "06:30 AM" },
      { mealType: "snack", name: "Energy Bar (homemade oat & date) with a Large Banana", calories: 320, protein: 8, carbs: 60, fat: 8, time: "10:00 AM" },
      { mealType: "lunch", name: "Whole Wheat Pasta (2 cups) with Grilled Chicken (5 oz), Marinara Sauce & Side Salad", calories: 620, protein: 40, carbs: 78, fat: 14, time: "01:00 PM" },
      { mealType: "snack", name: "PB&J Rice Cakes (3) with Natural Peanut Butter & Jam", calories: 280, protein: 10, carbs: 40, fat: 10, time: "04:00 PM" },
      { mealType: "dinner", name: "Teriyaki Salmon (6 oz) with White Rice (1 cup), Steamed Bok Choy & Miso Soup", calories: 560, protein: 38, carbs: 56, fat: 16, time: "07:30 PM" }
    ]
  },
  {
    id: "calisthenics-lean-performance-2200",
    title: "Calisthenics Lean Performance 2200 kcal",
    badge: "Optimal Power-to-Weight · Bodyweight Focus",
    description: "Engineered for bodyweight athletes pursuing skills like muscle-ups, planches, and front levers. Keeps body fat low to maximize relative strength while providing enough fuel for progressive overload and skill work.",
    theme: "emerald",
    goal: "Power-to-Weight Ratio & Relative Strength",
    caloriesTarget: 2200,
    proteinTarget: 165,
    meals: [
      { mealType: "breakfast", name: "Egg White Omelette (6 whites, 1 whole) with Whole Wheat Toast, Avocado & Tomato", calories: 380, protein: 32, carbs: 30, fat: 14, time: "07:30 AM" },
      { mealType: "lunch", name: "Herb-Grilled Turkey Breast (7 oz) with Brown Rice, Zucchini & Bell Peppers", calories: 520, protein: 48, carbs: 50, fat: 10, time: "12:30 PM" },
      { mealType: "snack", name: "Greek Yogurt (200g) with Raspberries, Walnuts (15g) & Honey", calories: 260, protein: 22, carbs: 24, fat: 10, time: "04:00 PM" },
      { mealType: "dinner", name: "Baked Cod Fillet (7 oz) with Quinoa, Roasted Asparagus & Lemon-Dill Sauce", calories: 480, protein: 44, carbs: 40, fat: 12, time: "07:30 PM" },
      { mealType: "snack", name: "Low-Fat Cottage Cheese (200g) with Pineapple Chunks & Cinnamon", calories: 180, protein: 24, carbs: 16, fat: 2, time: "09:30 PM" }
    ]
  },
  {
    id: "combat-sport-recomp-2000",
    title: "Combat Sport Recomp 2000 kcal",
    badge: "Weight Class Management · High Protein",
    description: "Built for fighters, wrestlers, and martial artists who need to maintain or make weight while building functional strength. Ultra-high protein protects muscle during weight manipulation, while moderate carbs fuel explosive training.",
    theme: "coral",
    goal: "Weight Class Management & Combat Performance",
    caloriesTarget: 2000,
    proteinTarget: 175,
    meals: [
      { mealType: "breakfast", name: "3 Whole Eggs Scrambled with Turkey Bacon (3 slices), Spinach & Whole Grain English Muffin", calories: 420, protein: 36, carbs: 28, fat: 18, time: "07:00 AM" },
      { mealType: "lunch", name: "Grilled Chicken Breast (7 oz) with Sweet Potato (medium), Steamed Broccoli & Hot Sauce", calories: 500, protein: 50, carbs: 46, fat: 8, time: "12:00 PM" },
      { mealType: "snack", name: "Whey Protein Shake (2 scoops) with Water & a Small Apple", calories: 280, protein: 48, carbs: 20, fat: 2, time: "03:30 PM" },
      { mealType: "dinner", name: "Lean Bison Burger Patty (6 oz, no bun) with Mixed Green Salad, Olive Oil & Balsamic", calories: 450, protein: 42, carbs: 10, fat: 28, time: "07:00 PM" },
      { mealType: "snack", name: "Casein Protein Pudding (1 scoop mixed thick) with Sliced Almonds (10g)", calories: 180, protein: 26, carbs: 8, fat: 5, time: "09:30 PM" }
    ]
  },
  {
    id: "pre-contest-bodybuilding-1700",
    title: "Pre-Contest Bodybuilding 1700 kcal",
    badge: "Peak Week · Precision Macros",
    description: "A competition-prep diet for the final 4-8 weeks before a bodybuilding show. Extremely precise macro targets, meal timing, and food selection designed to strip the last layers of subcutaneous fat while maintaining maximum muscle fullness.",
    theme: "pink",
    goal: "Stage-Ready Conditioning & Maximum Definition",
    caloriesTarget: 1700,
    proteinTarget: 190,
    meals: [
      { mealType: "breakfast", name: "Egg Whites (8) with Cream of Rice (40g dry), Cinnamon & Sugar-Free Syrup", calories: 310, protein: 36, carbs: 32, fat: 2, time: "06:00 AM" },
      { mealType: "snack", name: "Tilapia Fillet (5 oz) with Jasmine Rice (80g cooked) & Asparagus (6 spears)", calories: 280, protein: 34, carbs: 28, fat: 4, time: "09:00 AM" },
      { mealType: "lunch", name: "Chicken Breast (7 oz) with Sweet Potato (medium) & Green Beans", calories: 440, protein: 50, carbs: 40, fat: 6, time: "12:00 PM" },
      { mealType: "snack", name: "Whey Isolate (1 scoop) with Rice Cakes (2) & 10 Raw Almonds", calories: 250, protein: 28, carbs: 22, fat: 6, time: "03:00 PM" },
      { mealType: "dinner", name: "Extra-Lean Ground Turkey (6 oz) with Steamed Spinach, Mushrooms & 1 tsp Olive Oil", calories: 320, protein: 40, carbs: 6, fat: 14, time: "06:00 PM" },
      { mealType: "snack", name: "Casein Protein (1 scoop) mixed with Water & Cinnamon", calories: 120, protein: 24, carbs: 3, fat: 1, time: "09:00 PM" }
    ]
  }
]

export function NutritionLibrary() {
  const { user, isSignedIn } = useUser()
  const userId = isSignedIn && user ? user.id : "default-user"

  const [searchQuery, setSearchQuery] = useState("")
  const [expandedDiet, setExpandedDiet] = useState<string | null>(null)
  const [activeDietId, setActiveDietId] = useState<string | null>(null)
  const [activatingId, setActivatingId] = useState<string | null>(null)
  const [showSyncSuccess, setShowSyncSuccess] = useState(false)

  // Filter diet plans based on search
  const filteredDiets = DIET_LIBRARY.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.goal.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Set active diet in planStore via Next.js API
  const handleActivateDiet = async (diet: DietPlan) => {
    try {
      setActivatingId(diet.id)
      console.log(`📡 [Nutrition Library] Activating diet: "${diet.title}" for user:`, userId)
      
      const formattedMeals = diet.meals.map((m) => ({
        mealType: m.mealType,
        name: m.name,
        calories: m.calories,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat,
        time: m.time
      }))

      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          planType: "nutrition",
          customMeals: formattedMeals,
          userMessage: `Customized with diet: ${diet.title}`
        })
      })

      if (response.ok) {
        setActiveDietId(diet.id)
        setShowSyncSuccess(true)
        console.log(`✅ [Nutrition Library] Diet "${diet.title}" active in planStore.`)

        // Trigger context refresh across panels
        window.dispatchEvent(new CustomEvent("refreshContext"))

        setTimeout(() => {
          setShowSyncSuccess(false)
        }, 4000)
      } else {
        throw new Error(`Failed to activate: ${response.statusText}`)
      }
    } catch (e) {
      console.error("Failed to activate diet:", e)
      alert("Unable to activate diet plan. Check your connection or server console.")
    } finally {
      setActivatingId(null)
    }
  }

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case "emerald":
        return {
          border: "border-emerald-500/20 hover:border-emerald-500/40",
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          accentText: "text-emerald-400",
          glow: "from-emerald-500/10"
        }
      case "coral":
        return {
          border: "border-coral-500/20 hover:border-coral-500/40",
          badge: "bg-coral-500/10 text-primary border-coral-500/20",
          accentText: "text-[hsl(var(--primary))]",
          glow: "from-coral-500/10"
        }
      case "pink":
        return {
          border: "border-pink-500/20 hover:border-pink-500/40",
          badge: "bg-pink-500/10 text-pink-400 border-pink-500/20",
          accentText: "text-pink-400",
          glow: "from-pink-500/10"
        }
      case "babyblue":
      default:
        return {
          border: "border-sky-500/20 hover:border-sky-500/40",
          badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
          accentText: "text-sky-400",
          glow: "from-sky-500/10"
        }
    }
  }

  const getMealIcon = (type: string) => {
    switch (type) {
      case "breakfast":
        return <Coffee className="w-3.5 h-3.5 text-indigo-400" />
      case "lunch":
      case "dinner":
        return <Utensils className="w-3.5 h-3.5 text-secondary" />
      case "snack":
      default:
        return <Moon className="w-3.5 h-3.5 text-emerald-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-extrabold uppercase px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Interactive Diets Library
          </span>
        </div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Select Nutrition Program</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Browse and activate macro-balanced diet plans. Click **Activate** to dynamically configure your active meal checklist, calorie budgets, and macronutrient targets instantly.
        </p>
      </div>

      {/* 2. Success Alert Box */}
      {showSyncSuccess && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Nutrition Plan Activated!</p>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
              Unified stores synchronized. Switch to the **Meals** tab to view your updated active meal checklist and macro budgets.
            </p>
          </div>
        </div>
      )}

      {/* 3. Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search diet plans by focus or title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-xs bg-slate-950/60 border border-white/5 rounded-2xl text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>

      {/* 4. Diets List */}
      <div className="space-y-4">
        {filteredDiets.length === 0 ? (
          <div className="glass-panel rounded-3xl py-12 text-center">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-xs text-slate-500">No diet plans found matching that search.</p>
          </div>
        ) : (
          filteredDiets.map((diet) => {
            const styles = getThemeStyles(diet.theme)
            const isExpanded = expandedDiet === diet.id
            const isActive = activeDietId === diet.id
            const isActivating = activatingId === diet.id

            return (
              <div
                key={diet.id}
                className={cn(
                  "glass-panel rounded-3xl overflow-hidden transition-all duration-300 relative border",
                  styles.border,
                  isActive ? "bg-slate-950/50 shadow-lg shadow-black/85" : "bg-slate-950/10"
                )}
              >
                {/* Accent glow on hover */}
                <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 hover:opacity-[0.03] pointer-events-none transition-all duration-300", styles.glow)} />

                {/* Card Header summary */}
                <div className="p-6 relative">
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border", styles.badge)}>
                      {diet.badge}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                      {diet.caloriesTarget} kcal
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white tracking-tight leading-snug">{diet.title}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{diet.description}</p>

                  <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-4">
                    <div className="flex-1 text-[10px] text-slate-500 font-medium">
                      Goal Focus: <span className="text-slate-300 font-semibold">{diet.goal}</span>
                    </div>

                    <button
                      onClick={() => setExpandedDiet(isExpanded ? null : diet.id)}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          Hide Meals <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          Show Menu <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Menu Panel */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-white/5 bg-slate-950/30 space-y-5 pt-5 animate-in slide-in-from-top duration-300">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-primary" />
                      Daily Macronutrient Targets
                    </h5>

                    {/* Macro Bar */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                      <div className="text-center border-r border-white/5">
                        <div className="text-lg font-black text-white font-mono">{diet.caloriesTarget}</div>
                        <div className="text-[9px] text-slate-505 font-bold uppercase tracking-wider">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-emerald-400 font-mono">{diet.proteinTarget}g</div>
                        <div className="text-[9px] text-slate-505 font-bold uppercase tracking-wider">Protein Goal</div>
                      </div>
                    </div>

                    {/* Meals List */}
                    <div className="space-y-3">
                      {diet.meals.map((m, index) => (
                        <div key={index} className="flex gap-3 bg-slate-950/20 p-3.5 rounded-xl border border-white/5 text-xs">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center flex-shrink-0">
                            {getMealIcon(m.mealType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-0.5">
                              <span className="font-bold text-white capitalize">{m.mealType} ({m.time})</span>
                              <span className="font-mono text-slate-400 font-semibold">{m.calories} cal</span>
                            </div>
                            <p className="text-[11px] text-slate-350 leading-relaxed font-medium">{m.name}</p>
                            <div className="flex gap-2 mt-1.5 text-[9px] text-slate-500 font-mono">
                              <span>P: {m.protein}g</span>
                              <span>•</span>
                              <span>C: {m.carbs}g</span>
                              <span>•</span>
                              <span>F: {m.fat}g</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Activation Button */}
                    <div className="pt-2 border-t border-white/5">
                      <Button
                        onClick={() => handleActivateDiet(diet)}
                        disabled={isActivating}
                        className={cn(
                          "w-full rounded-2xl transition-all duration-300 uppercase text-xs font-black tracking-wider h-11 border",
                          isActive
                            ? "bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                            : "btn-premium shadow-lg shadow-coral-500/15"
                        )}
                      >
                        {isActivating ? (
                          <>
                            <div className="w-4 h-4 animate-spin rounded-full border border-current border-t-transparent mr-2" />
                            Synchronizing Active Client Diet...
                          </>
                        ) : isActive ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            This Diet Plan Is Active
                          </>
                        ) : (
                          <>
                            <Apple className="w-4 h-4 mr-2" />
                            Activate Plan & Load Meals
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
