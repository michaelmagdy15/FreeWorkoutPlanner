"use client"

import React, { useState, useEffect } from "react"
import { Dumbbell, Sparkles, BookOpen, Target, CheckCircle2, ChevronRight, ChevronDown, ChevronUp, Search, Flame, ShieldAlert, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFitnessData } from "@/hooks/useFitnessData"
import { useUser } from "@/lib/auth"

interface Exercise {
  name: string
  type: "strength" | "cardio"
  sets: number
  reps?: number
  weight?: string
  duration?: string
  day: number
  note?: string
  img?: string
}

interface Routine {
  id: string
  title: string
  badge: string
  description: string
  theme: "babyblue" | "emerald" | "coral" | "pink"
  goal: string
  level: "Beginner" | "Intermediate" | "Advanced"
  exercises: Exercise[]
}

const ROUTINE_LIBRARY: Routine[] = [
  // ═══════════════════════════════════════════════════════════════
  // BEGINNER LEVEL (6 programs)
  // ═══════════════════════════════════════════════════════════════

  // 1. Absolute Beginner Full-Body
  {
    id: "beginner-full-body",
    title: "Absolute Beginner Full-Body",
    badge: "Emphasis: Machine & Bodyweight Basics",
    description: "Your first gym program. Uses guided machines and simple bodyweight movements to build foundational strength, coordination, and confidence across all major muscle groups.",
    theme: "babyblue",
    goal: "Build Foundational Strength & Gym Confidence",
    level: "Beginner",
    exercises: [
      // Day 1
      { name: "Leg Press Machine", type: "strength", sets: 3, reps: 12, weight: "70 lbs", day: 1, note: "Place feet shoulder-width on the platform. Press through your heels, don't lock knees at the top." },
      { name: "Chest Press Machine", type: "strength", sets: 3, reps: 10, weight: "30 lbs", day: 1, note: "Grip handles at chest height. Press forward until arms are extended, control the return slowly." },
      { name: "Seated Row Machine", type: "strength", sets: 3, reps: 10, weight: "40 lbs", day: 1, note: "Pull handles to your torso, squeeze shoulder blades together for 1 second at the end." },
      { name: "Bodyweight Squats", type: "strength", sets: 3, reps: 15, weight: "Bodyweight", day: 1, note: "Arms forward for balance. Sit back like sitting in a chair, keep chest up and knees over toes." },
      { name: "Plank Hold", type: "strength", sets: 3, duration: "20s", day: 1, note: "Forearms on ground, body in a straight line from head to heels. Breathe steadily, don't hold your breath." },
      // Day 2
      { name: "Lat Pulldown Machine", type: "strength", sets: 3, reps: 10, weight: "40 lbs", day: 2, note: "Pull the bar to your upper chest, lean back slightly. Think about pulling with your elbows, not hands." },
      { name: "Shoulder Press Machine", type: "strength", sets: 3, reps: 10, weight: "20 lbs", day: 2, note: "Press handles straight up, stop just before locking elbows. Keep your back flat against the pad." },
      { name: "Leg Curl Machine", type: "strength", sets: 3, reps: 12, weight: "30 lbs", day: 2, note: "Curl the pad toward your glutes smoothly. 2-second squeeze at the top, 3-second lower." },
      { name: "Wall Push-ups", type: "strength", sets: 3, reps: 12, weight: "Bodyweight", day: 2, note: "Hands on wall at shoulder height. Lower chest toward wall, then push back. Great for building push-up strength." },
      { name: "Dead Bug", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 2, note: "Lie on back, extend opposite arm and leg while keeping lower back pressed into the floor." },
      // Day 3
      { name: "Goblet Squat (Dumbbell)", type: "strength", sets: 3, reps: 10, weight: "15 lbs", day: 3, note: "Hold dumbbell at your chest vertically. Elbows between knees at the bottom, sit deep." },
      { name: "Cable Chest Fly", type: "strength", sets: 3, reps: 12, weight: "15 lbs", day: 3, note: "Set cables at chest height. Bring handles together in a hugging motion, squeeze pecs at center." },
      { name: "Assisted Pull-up Machine", type: "strength", sets: 3, reps: 8, weight: "Assisted -40 lbs", day: 3, note: "Set counterweight so you can complete 8 reps. Pull chin above bar, lower slowly for 3 seconds." },
      { name: "Leg Extension Machine", type: "strength", sets: 3, reps: 12, weight: "30 lbs", day: 3, note: "Extend legs fully, squeeze quads at the top for 1 second. Lower slowly, don't let weight slam." },
      { name: "Bird Dog", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 3, note: "On hands and knees, extend opposite arm and leg. Hold 2 seconds, keep hips level and square." }
    ]
  },

  // 2. Beginner Calisthenics Foundation
  {
    id: "beginner-calisthenics",
    title: "Beginner Calisthenics Foundation",
    badge: "Emphasis: Bodyweight Progressions",
    description: "Master your own bodyweight first. Progressive pull-up, push-up, and squat variations that build real-world functional strength without any equipment.",
    theme: "emerald",
    goal: "Bodyweight Mastery & Functional Strength",
    level: "Beginner",
    exercises: [
      // Day 1 (Push Focus)
      { name: "Knee Push-ups", type: "strength", sets: 3, reps: 12, weight: "Bodyweight", day: 1, note: "Hands slightly wider than shoulders. Lower chest to floor, keep core tight. Progress to full push-ups." },
      { name: "Pike Push-ups", type: "strength", sets: 3, reps: 8, weight: "Bodyweight", day: 1, note: "Hips high in an inverted V. Lower head toward the floor to build shoulder pressing strength." },
      { name: "Bench Dips", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 1, note: "Hands on bench behind you. Lower until elbows hit 90 degrees, press back up. Keep back close to bench." },
      { name: "Bodyweight Squats", type: "strength", sets: 3, reps: 15, weight: "Bodyweight", day: 1, note: "Full depth every rep. Drive through heels, squeeze glutes at the top." },
      { name: "Plank Hold", type: "strength", sets: 3, duration: "30s", day: 1, note: "Elbows under shoulders, squeeze everything tight. Build to 60 seconds over 4 weeks." },
      // Day 2 (Pull Focus)
      { name: "Dead Hang", type: "strength", sets: 3, duration: "20s", day: 2, note: "Hang from pull-up bar with straight arms. Builds grip strength and decompresses the spine." },
      { name: "Australian Rows (Inverted Rows)", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 2, note: "Under a bar at waist height, pull chest to bar. The more horizontal your body, the harder it is." },
      { name: "Negative Pull-ups", type: "strength", sets: 3, reps: 5, weight: "Bodyweight", day: 2, note: "Jump to chin-over-bar position, lower yourself as slowly as possible (5-8 seconds). Best pull-up builder." },
      { name: "Glute Bridges", type: "strength", sets: 3, reps: 15, weight: "Bodyweight", day: 2, note: "Feet flat on floor, drive hips to ceiling. Squeeze glutes hard for 2 seconds at the top." },
      { name: "Superman Holds", type: "strength", sets: 3, duration: "15s", day: 2, note: "Lying face down, lift arms and legs off the floor simultaneously. Strengthens lower back and posterior chain." },
      // Day 3 (Full Body)
      { name: "Full Push-ups (or Knee)", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 3, note: "Progress from knees to toes as you get stronger. Quality over quantity—full range of motion." },
      { name: "Negative Pull-ups", type: "strength", sets: 3, reps: 5, weight: "Bodyweight", day: 3, note: "Aim for slower negatives each week. When you can do 8-second negatives, try a full pull-up." },
      { name: "Bodyweight Lunges", type: "strength", sets: 3, reps: 12, weight: "Bodyweight", day: 3, note: "Step forward, drop back knee toward floor. Keep front knee over ankle, torso upright." },
      { name: "Bear Crawl", type: "cardio", sets: 3, duration: "30s", day: 3, note: "Hands and feet on ground, knees hovering 2 inches off floor. Crawl forward and backward. Incredible core work." },
      { name: "Side Plank", type: "strength", sets: 3, duration: "20s", day: 3, note: "Stack feet or stagger them for balance. Keep hips high, don't let them sag. 20 seconds each side." }
    ]
  },

  // 3. Beginner Fat Loss Circuit
  {
    id: "beginner-fat-loss",
    title: "Beginner Fat Loss Circuit",
    badge: "Emphasis: Low-Impact HIIT",
    description: "Burn calories without destroying your joints. Low-impact intervals paired with light resistance to boost metabolism and build endurance safely.",
    theme: "coral",
    goal: "Fat Loss & Metabolic Conditioning",
    level: "Beginner",
    exercises: [
      // Day 1
      { name: "Brisk Walking (Incline)", type: "cardio", sets: 1, duration: "15m", day: 1, note: "Treadmill at 8-10% incline, 3.2 mph. Pump your arms actively—burns 3x more than flat walking." },
      { name: "Bodyweight Step-ups", type: "strength", sets: 3, reps: 12, weight: "Bodyweight", day: 1, note: "Use a sturdy bench or step. Alternate legs, drive through heel of the top foot. Keep torso upright." },
      { name: "Band Pull-Aparts", type: "strength", sets: 3, reps: 15, weight: "Light band", day: 1, note: "Hold resistance band at chest height, pull apart until arms are wide. Builds posture and burns shoulders." },
      { name: "Modified Burpees (No Jump)", type: "cardio", sets: 3, reps: 8, weight: "Bodyweight", day: 1, note: "Step back to plank instead of jumping. Step feet forward and stand tall. Low impact, high calorie burn." },
      { name: "Dead Bug", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 1, note: "Lower back stays glued to the floor the entire time. If it lifts, reduce range of motion." },
      // Day 2
      { name: "Stationary Bike Intervals", type: "cardio", sets: 1, duration: "20m", day: 2, note: "30 seconds hard pedaling, 60 seconds easy. Repeat for 20 minutes. Zero joint impact." },
      { name: "Dumbbell Goblet Squats", type: "strength", sets: 3, reps: 12, weight: "10 lbs", day: 2, note: "Hold dumbbell at chest. Slow descent for 3 seconds, explode up. Feel it in your quads and glutes." },
      { name: "Dumbbell Floor Press", type: "strength", sets: 3, reps: 10, weight: "2x 10 lbs", day: 2, note: "Lie on floor, press dumbbells up. Floor limits range to protect shoulders while still building chest." },
      { name: "Standing March in Place", type: "cardio", sets: 3, duration: "45s", day: 2, note: "High knees with exaggerated arm pumps. Keep pace consistent and controlled. Great active recovery." },
      { name: "Glute Bridge Hold", type: "strength", sets: 3, duration: "30s", day: 2, note: "Hold hips at the top, squeeze glutes as hard as possible. Don't let hips drop until time is up." },
      // Day 3
      { name: "Rowing Machine (Easy Pace)", type: "cardio", sets: 1, duration: "15m", day: 3, note: "Stroke rate 20-22/min. Focus on leg drive, then lean back, then arms. Reverse on the return." },
      { name: "Dumbbell Lateral Raises", type: "strength", sets: 3, reps: 12, weight: "2x 5 lbs", day: 3, note: "Lift to shoulder height only. Control the descent—don't swing. Light weight with perfect form." },
      { name: "Bodyweight Reverse Lunges", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 3, note: "Step backward instead of forward—much easier on knees. Back knee hovers 1 inch off floor." },
      { name: "Seal Jacks", type: "cardio", sets: 3, reps: 20, weight: "Bodyweight", day: 3, note: "Like jumping jacks but arms go forward and back instead of overhead. Easier on shoulders." },
      { name: "Forearm Plank", type: "strength", sets: 3, duration: "25s", day: 3, note: "Build duration by 5 seconds each week. Quality position matters more than time." }
    ]
  },

  // 4. Beginner Dumbbell-Only Home
  {
    id: "beginner-dumbbell-home",
    title: "Beginner Dumbbell-Only Home",
    badge: "Emphasis: Home Workout Essentials",
    description: "No gym required. A complete full-body program using only a pair of adjustable dumbbells. Perfect for building your first foundation of real strength at home.",
    theme: "pink",
    goal: "Home Strength Building & Muscle Tone",
    level: "Beginner",
    exercises: [
      // Day 1 (Lower Body & Core)
      { name: "Dumbbell Goblet Squats", type: "strength", sets: 3, reps: 12, weight: "20 lbs", day: 1, note: "Hold one dumbbell vertically at chest. Drop hips below knees, push through heels to stand." },
      { name: "Dumbbell Romanian Deadlifts", type: "strength", sets: 3, reps: 10, weight: "2x 15 lbs", day: 1, note: "Slide dumbbells down your shins keeping them close. Feel the stretch in your hamstrings, then squeeze glutes to stand." },
      { name: "Dumbbell Reverse Lunges", type: "strength", sets: 3, reps: 10, weight: "2x 10 lbs", day: 1, note: "Step back, lower until back knee nearly touches floor. Front shin stays vertical." },
      { name: "Dumbbell Calf Raises", type: "strength", sets: 3, reps: 15, weight: "2x 15 lbs", day: 1, note: "Stand on edge of a step if possible. Rise to tippy-toes, hold 1 second, lower for 2 seconds." },
      { name: "Weighted Sit-ups", type: "strength", sets: 3, reps: 12, weight: "10 lbs", day: 1, note: "Hold one dumbbell at chest. Curl up using abs, not momentum. Lower slowly." },
      // Day 2 (Upper Push)
      { name: "Dumbbell Floor Press", type: "strength", sets: 3, reps: 10, weight: "2x 15 lbs", day: 2, note: "Lie on floor, elbows touch ground each rep. Press up, squeeze chest at top." },
      { name: "Dumbbell Shoulder Press (Seated)", type: "strength", sets: 3, reps: 10, weight: "2x 12 lbs", day: 2, note: "Sit against a wall for back support. Press straight up, lower to ear height." },
      { name: "Dumbbell Lateral Raises", type: "strength", sets: 3, reps: 12, weight: "2x 8 lbs", day: 2, note: "Slight bend in elbows, raise to shoulder height. Control the descent—no swinging." },
      { name: "Dumbbell Overhead Tricep Extension", type: "strength", sets: 3, reps: 12, weight: "15 lbs", day: 2, note: "Hold one dumbbell with both hands behind head. Extend overhead, keep elbows pointing forward." },
      { name: "Push-ups", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 2, note: "Finish with bodyweight push-ups to failure. Use knees if needed. Chase the chest pump." },
      // Day 3 (Upper Pull & Core)
      { name: "Dumbbell Bent-Over Rows", type: "strength", sets: 3, reps: 10, weight: "2x 15 lbs", day: 3, note: "Hinge at hips 45 degrees, pull dumbbells to your hip bones. Squeeze shoulder blades 1 second." },
      { name: "Dumbbell Bicep Curls", type: "strength", sets: 3, reps: 12, weight: "2x 10 lbs", day: 3, note: "Keep elbows pinned to your sides. Supinate wrists as you curl up. Squeeze at the top." },
      { name: "Dumbbell Shrugs", type: "strength", sets: 3, reps: 15, weight: "2x 20 lbs", day: 3, note: "Pull shoulders straight up to your ears. Hold 2 seconds at top. Don't roll shoulders." },
      { name: "Renegade Rows", type: "strength", sets: 3, reps: 8, weight: "2x 10 lbs", day: 3, note: "In push-up position on dumbbells, row one arm at a time. Keep hips square—don't rotate." },
      { name: "Dumbbell Russian Twists", type: "strength", sets: 3, reps: 16, weight: "10 lbs", day: 3, note: "Sit with feet off floor, rotate dumbbell side to side. 16 total reps means 8 each direction." }
    ]
  },

  // 5. Beginner Women's Toning
  {
    id: "beginner-womens-toning",
    title: "Beginner Women's Toning",
    badge: "Emphasis: Full-Body Sculpting",
    description: "Light weights, higher reps, and targeted movements to build lean, toned muscle across your entire body. Designed to build confidence and strength progressively.",
    theme: "babyblue",
    goal: "Lean Muscle Definition & Body Sculpting",
    level: "Beginner",
    exercises: [
      // Day 1 (Lower Body Sculpt)
      { name: "Sumo Dumbbell Squats", type: "strength", sets: 3, reps: 15, weight: "15 lbs", day: 1, note: "Wide stance, toes out 45°. Hold one dumbbell between legs. Squeeze inner thighs and glutes at top." },
      { name: "Glute Kickbacks (Cable or Band)", type: "strength", sets: 3, reps: 12, weight: "Light band", day: 1, note: "On all fours, drive heel toward ceiling. Squeeze glute at the top, don't arch lower back." },
      { name: "Dumbbell Walking Lunges", type: "strength", sets: 3, reps: 12, weight: "2x 8 lbs", day: 1, note: "Take long steps, keep torso tall. Back knee hovers just off the floor each rep." },
      { name: "Standing Calf Raises", type: "strength", sets: 3, reps: 20, weight: "Bodyweight", day: 1, note: "Rise slowly for 2 seconds, hold 1 second at the top, lower for 3 seconds. Feel the burn." },
      { name: "Glute Bridge Pulse", type: "strength", sets: 3, reps: 20, weight: "Bodyweight", day: 1, note: "Hold bridge at the top and pulse up and down 1 inch for all 20 reps. Glutes should be on fire." },
      // Day 2 (Upper Body Tone)
      { name: "Dumbbell Chest Fly", type: "strength", sets: 3, reps: 12, weight: "2x 8 lbs", day: 2, note: "Lie on bench or floor. Open arms wide like hugging a tree, squeeze chest to bring dumbbells together." },
      { name: "Dumbbell Arnold Press", type: "strength", sets: 3, reps: 10, weight: "2x 8 lbs", day: 2, note: "Start with palms facing you, rotate as you press overhead. Hits all three heads of the deltoid." },
      { name: "Dumbbell Bent-Over Reverse Fly", type: "strength", sets: 3, reps: 12, weight: "2x 5 lbs", day: 2, note: "Hinge forward, lift arms out to sides. Targets rear delts and upper back for better posture." },
      { name: "Bicep Curl to Shoulder Press", type: "strength", sets: 3, reps: 10, weight: "2x 8 lbs", day: 2, note: "Curl dumbbells up, then press overhead. Two movements in one—super efficient and builds beautiful arms." },
      { name: "Tricep Kickbacks", type: "strength", sets: 3, reps: 12, weight: "2x 5 lbs", day: 2, note: "Hinge forward, extend arms straight back. Squeeze triceps and hold 1 second at full extension." },
      // Day 3 (Core & Conditioning)
      { name: "Dumbbell Sumo Deadlift", type: "strength", sets: 3, reps: 12, weight: "20 lbs", day: 3, note: "Wide stance, one dumbbell between legs. Hinge at hips, keep chest proud, squeeze glutes to stand." },
      { name: "Dumbbell Thrusters", type: "strength", sets: 3, reps: 10, weight: "2x 8 lbs", day: 3, note: "Squat with dumbbells at shoulders, then drive up and press overhead in one fluid motion." },
      { name: "Bicycle Crunches", type: "strength", sets: 3, reps: 20, weight: "Bodyweight", day: 3, note: "Slow and controlled—no yanking on your neck. Elbow to opposite knee, fully extend the other leg." },
      { name: "Mountain Climbers", type: "cardio", sets: 3, duration: "30s", day: 3, note: "Plank position, drive knees to chest alternately. Keep hips low and level, go at a sustainable pace." },
      { name: "Flutter Kicks", type: "strength", sets: 3, reps: 20, weight: "Bodyweight", day: 3, note: "Lie on back, hands under glutes. Alternate kicking legs 6 inches off the floor. Lower back stays flat." }
    ]
  },

  // 6. Senior Fitness & Mobility
  {
    id: "senior-fitness-mobility",
    title: "Senior Fitness & Mobility",
    badge: "Emphasis: Joint Health & Balance",
    description: "A gentle, joint-friendly program emphasizing balance, flexibility, and functional movement. Designed to improve quality of life and maintain independence safely.",
    theme: "emerald",
    goal: "Joint Health, Balance & Functional Mobility",
    level: "Beginner",
    exercises: [
      // Day 1 (Lower Body & Balance)
      { name: "Chair-Assisted Squats", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 1, note: "Stand in front of a sturdy chair. Sit back slowly until you lightly touch the seat, then stand. Use armrests if needed." },
      { name: "Standing Calf Raises (Wall Support)", type: "strength", sets: 3, reps: 12, weight: "Bodyweight", day: 1, note: "Hold wall for balance. Rise to toes, hold 2 seconds at top. Prevents ankle stiffness and improves balance." },
      { name: "Seated Leg Extensions", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 1, note: "Sit in chair, straighten one leg at a time. Hold 3 seconds at the top. Strengthens quads for stair climbing." },
      { name: "Single-Leg Balance Hold", type: "strength", sets: 3, duration: "15s", day: 1, note: "Stand on one foot near a wall for safety. 15 seconds each side. Close eyes to increase difficulty over time." },
      { name: "Gentle Walking", type: "cardio", sets: 1, duration: "15m", day: 1, note: "15 minutes at comfortable pace. Focus on posture—head up, shoulders back, arms swinging naturally." },
      // Day 2 (Upper Body & Posture)
      { name: "Seated Dumbbell Press", type: "strength", sets: 3, reps: 10, weight: "2x 5 lbs", day: 2, note: "Sit in sturdy chair with back support. Press dumbbells overhead gently, don't lock elbows." },
      { name: "Seated Dumbbell Rows", type: "strength", sets: 3, reps: 10, weight: "2x 5 lbs", day: 2, note: "Lean forward slightly, pull dumbbells to ribs. Strengthens the back muscles that support good posture." },
      { name: "Wall Push-ups", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 2, note: "Stand arm's length from wall, perform push-ups against it. Completely joint-safe upper body builder." },
      { name: "Shoulder Circles", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 2, note: "Arms out to sides, make small circles forward then backward. Maintains shoulder joint health and range." },
      { name: "Chin Tucks (Posture)", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 2, note: "Pull chin straight back creating a double chin. Hold 5 seconds. Corrects forward head posture from sitting." },
      // Day 3 (Flexibility & Core)
      { name: "Seated Torso Rotations", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 3, note: "Sit tall, hands on shoulders, rotate upper body left and right gently. Maintains spine mobility." },
      { name: "Standing Hip Circles", type: "strength", sets: 3, reps: 8, weight: "Bodyweight", day: 3, note: "Hold chair for balance. Circle one leg at the hip, 8 circles each direction. Keeps hip joints healthy." },
      { name: "Cat-Cow Stretch", type: "strength", sets: 3, reps: 8, weight: "Bodyweight", day: 3, note: "On hands and knees, arch back up like a cat, then drop belly toward floor like a cow. Spinal mobility." },
      { name: "Seated Marching", type: "cardio", sets: 3, duration: "45s", day: 3, note: "Sit tall in chair, march knees up alternately. Pump arms to increase heart rate gently." },
      { name: "Gentle Hamstring Stretch", type: "strength", sets: 3, duration: "30s", day: 3, note: "Sit on chair edge, extend one leg. Lean forward gently until you feel a stretch behind the knee. 30 seconds each leg." }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // INTERMEDIATE LEVEL (8 programs)
  // ═══════════════════════════════════════════════════════════════

  // 7. PPL Hypertrophy Classic
  {
    id: "hypertrophy-ppl",
    title: "PPL Hypertrophy Classic",
    badge: "Emphasis: Symmetrical Muscle Growth",
    description: "The gold-standard Push/Pull/Legs split. Maximize training frequency with intelligent volume distribution to build aesthetic, proportional lean muscle mass.",
    theme: "coral",
    goal: "Lean Muscle Hypertrophy & Symmetry",
    level: "Intermediate",
    exercises: [
      // Day 1 (Push)
      { name: "Flat Barbell Bench Press", type: "strength", sets: 4, reps: 8, weight: "95 lbs", day: 1, note: "Retract shoulder blades, arch slightly. Bar touches mid-chest, explode upward. Rest 90 seconds." },
      { name: "Incline Dumbbell Press", type: "strength", sets: 3, reps: 10, weight: "2x 30 lbs", day: 1, note: "30-degree incline hits upper chest. Full stretch at bottom, press dumbbells together at top." },
      { name: "Standing Overhead Press", type: "strength", sets: 3, reps: 8, weight: "65 lbs", day: 1, note: "Brace core and squeeze glutes before pressing. Bar path should go straight up, finishing behind your ears." },
      { name: "Dumbbell Lateral Raises", type: "strength", sets: 4, reps: 12, weight: "2x 12 lbs", day: 1, note: "Slight bend in elbows, raise to shoulder height. Control the negative—swinging is cheating." },
      { name: "Overhead Tricep Extension (Cable)", type: "strength", sets: 3, reps: 12, weight: "30 lbs", day: 1, note: "Face away from cable, extend rope overhead. Stretch triceps fully at bottom, lock out at top." },
      // Day 2 (Pull)
      { name: "Bent-Over Barbell Rows", type: "strength", sets: 4, reps: 8, weight: "95 lbs", day: 2, note: "Torso at 45 degrees. Pull bar to navel, not chest. Squeeze shoulder blades together for 1 second." },
      { name: "Weighted Pull-ups", type: "strength", sets: 3, reps: 8, weight: "+10 lbs", day: 2, note: "Full dead hang to chin over bar. If bodyweight is too easy, add a dumbbell between feet or use a belt." },
      { name: "Seated Cable Rows", type: "strength", sets: 3, reps: 10, weight: "60 lbs", day: 2, note: "V-grip handle, pull to lower stomach. Let shoulders stretch forward on the return, don't round back." },
      { name: "Cable Face Pulls", type: "strength", sets: 3, reps: 15, weight: "25 lbs", day: 2, note: "Pull rope to nose height, separate hands at the end. Focus on rear delts and external rotation." },
      { name: "Barbell Curls", type: "strength", sets: 3, reps: 10, weight: "40 lbs", day: 2, note: "Elbows pinned to sides. Squeeze biceps hard at top, lower for 3 seconds. No body english." },
      // Day 3 (Legs)
      { name: "Barbell Back Squats", type: "strength", sets: 4, reps: 8, weight: "135 lbs", day: 3, note: "Drive knees out over toes, break parallel every rep. Brace core hard, chest stays up throughout." },
      { name: "Romanian Deadlifts", type: "strength", sets: 3, reps: 10, weight: "95 lbs", day: 3, note: "Hinge until you feel a deep hamstring stretch. Stand by squeezing glutes, not pulling with your back." },
      { name: "Leg Press", type: "strength", sets: 3, reps: 12, weight: "180 lbs", day: 3, note: "Feet shoulder-width, mid-platform. Slow 3-second descent, press through heels. Keep safeties engaged." },
      { name: "Standing Calf Raises", type: "strength", sets: 4, reps: 15, weight: "50 lbs", day: 3, note: "Full stretch at bottom (2 seconds), explosive rise, hold squeeze at top (1 second)." },
      { name: "Leg Curls", type: "strength", sets: 3, reps: 12, weight: "50 lbs", day: 3, note: "Squeeze hamstrings at the top. Lower slowly for 3 seconds—the eccentric is where growth happens." }
    ]
  },

  // 8. Upper/Lower Power Builder
  {
    id: "upper-lower-power",
    title: "Upper/Lower Power Builder",
    badge: "Emphasis: Compound Strength + Size",
    description: "Focused on the big compound lifts that build both strength and muscle. Fewer exercises, heavier loads, and longer rest periods for maximum force production.",
    theme: "pink",
    goal: "Compound Strength & Power Development",
    level: "Intermediate",
    exercises: [
      // Day 1 (Upper Power)
      { name: "Barbell Bench Press", type: "strength", sets: 4, reps: 6, weight: "115 lbs", day: 1, note: "Heavy day—rest 2-3 minutes between sets. Touch chest, pause 1 second, explode. Leg drive matters." },
      { name: "Barbell Bent-Over Rows", type: "strength", sets: 4, reps: 6, weight: "105 lbs", day: 1, note: "Match your bench weight roughly. Pull explosively, control the lower. Builds a thick, strong back." },
      { name: "Overhead Press (Barbell)", type: "strength", sets: 4, reps: 6, weight: "75 lbs", day: 1, note: "Strict press—no leg drive. Brace everything tight. If you stall, try push press for the last 2 reps." },
      { name: "Weighted Chin-ups", type: "strength", sets: 3, reps: 6, weight: "+15 lbs", day: 1, note: "Supinated grip builds bigger biceps while training back. Full dead hang each rep." },
      { name: "Dumbbell Hammer Curls", type: "strength", sets: 3, reps: 10, weight: "2x 20 lbs", day: 1, note: "Palms face each other throughout. Targets brachialis and forearms for thicker arms." },
      // Day 2 (Lower Power)
      { name: "Barbell Back Squats", type: "strength", sets: 4, reps: 6, weight: "155 lbs", day: 2, note: "Heavy day. Brace with a big belly breath before each rep. Rest 2-3 minutes. Depth matters." },
      { name: "Barbell Deadlifts (Conventional)", type: "strength", sets: 3, reps: 5, weight: "185 lbs", day: 2, note: "Set up with bar over mid-foot. Push the floor away with your legs, lock out with your hips. Reset each rep." },
      { name: "Barbell Hip Thrusts", type: "strength", sets: 3, reps: 8, weight: "115 lbs", day: 2, note: "Upper back on bench, bar across hips with pad. Drive hips to ceiling, squeeze glutes 2 seconds at top." },
      { name: "Walking Lunges (Dumbbell)", type: "strength", sets: 3, reps: 10, weight: "2x 25 lbs", day: 2, note: "Long steps, upright torso. Each rep is one step. 10 per leg. Builds single-leg strength and stability." },
      { name: "Hanging Leg Raises", type: "strength", sets: 3, reps: 12, weight: "Bodyweight", day: 2, note: "Raise legs to 90 degrees minimum. Avoid swinging—pause at the top. If too hard, bend knees." },
      // Day 3 (Upper Hypertrophy)
      { name: "Incline Dumbbell Press", type: "strength", sets: 3, reps: 10, weight: "2x 35 lbs", day: 3, note: "Moderate weight, controlled tempo. 2 seconds down, 1 second up. Focus on the chest stretch at bottom." },
      { name: "Cable Rows (Neutral Grip)", type: "strength", sets: 3, reps: 10, weight: "65 lbs", day: 3, note: "Pull to belly button, keep chest tall. Let shoulders protract forward on the release for full stretch." },
      { name: "Dumbbell Lateral Raises", type: "strength", sets: 4, reps: 12, weight: "2x 15 lbs", day: 3, note: "Partials on the last set—when you can't do full reps, do half reps to push past failure." },
      { name: "Skull Crushers (EZ Bar)", type: "strength", sets: 3, reps: 10, weight: "40 lbs", day: 3, note: "Lower bar to forehead, keep elbows stationary and pointed at ceiling. Full lockout each rep." },
      { name: "Dumbbell Bicep Curls (Incline)", type: "strength", sets: 3, reps: 10, weight: "2x 15 lbs", day: 3, note: "Set bench at 45 degrees, arms hang straight down. Long stretch at bottom hits the long head of biceps." }
    ]
  },

  // 9. Athletic Performance HIIT
  {
    id: "athletic-hiit",
    title: "Athletic Performance HIIT",
    badge: "Emphasis: Speed, Power & Agility",
    description: "Train like an athlete with plyometrics, agility drills, and explosive movements. Builds real-world power, coordination, and cardiovascular capacity.",
    theme: "babyblue",
    goal: "Explosive Power & Athletic Conditioning",
    level: "Intermediate",
    exercises: [
      // Day 1 (Lower Body Power)
      { name: "Box Jumps", type: "strength", sets: 4, reps: 8, weight: "Bodyweight", day: 1, note: "20-24 inch box. Land softly with bent knees, stand fully on box. Step down—don't jump down to protect joints." },
      { name: "Barbell Front Squats", type: "strength", sets: 4, reps: 6, weight: "95 lbs", day: 1, note: "Elbows high, bar rests on front delts. More upright torso than back squats. Drives quad and core strength." },
      { name: "Lateral Bounds", type: "cardio", sets: 3, reps: 10, weight: "Bodyweight", day: 1, note: "Jump sideways, land on one foot. Stick the landing for 1 second before jumping back. Builds lateral power." },
      { name: "Sprint Intervals (Treadmill)", type: "cardio", sets: 1, duration: "12m", day: 1, note: "20-second all-out sprint, 40-second walk. Repeat 12 rounds. Maximum effort on every sprint." },
      { name: "Broad Jumps", type: "strength", sets: 3, reps: 6, weight: "Bodyweight", day: 1, note: "Swing arms and explode forward. Stick the landing in an athletic stance. Measures real horizontal power." },
      // Day 2 (Upper Body Power & Agility)
      { name: "Clapping Push-ups", type: "strength", sets: 4, reps: 8, weight: "Bodyweight", day: 2, note: "Explode off the floor hard enough to clap. Land with elbows slightly bent to absorb impact. Builds pressing power." },
      { name: "Medicine Ball Slams", type: "strength", sets: 4, reps: 10, weight: "15 lbs", day: 2, note: "Lift ball overhead, slam it into the ground with full-body force. Catch the bounce and repeat. Pure power output." },
      { name: "Battle Rope Waves", type: "cardio", sets: 3, duration: "30s", day: 2, note: "Alternate arms creating waves. Stay in a half-squat position. 30 seconds on, 30 seconds rest." },
      { name: "Agility Ladder Drills", type: "cardio", sets: 4, duration: "30s", day: 2, note: "In-in-out-out pattern, then lateral shuffle through. Quick feet, stay on balls of feet. Builds foot speed." },
      { name: "Plyo Push-ups (Incline)", type: "strength", sets: 3, reps: 8, weight: "Bodyweight", day: 2, note: "Hands on bench, explode upward. Easier variation than floor plyo push-ups. Still builds explosive pressing." },
      // Day 3 (Full Body Conditioning)
      { name: "Kettlebell Swings", type: "strength", sets: 4, reps: 15, weight: "35 lbs", day: 3, note: "Hinge at hips, snap them forward to drive the bell. Arms are just along for the ride—this is a hip exercise." },
      { name: "Dumbbell Thrusters", type: "strength", sets: 3, reps: 10, weight: "2x 20 lbs", day: 3, note: "Front squat straight into overhead press. One fluid movement. Burns everything and spikes heart rate." },
      { name: "Tuck Jumps", type: "cardio", sets: 3, reps: 8, weight: "Bodyweight", day: 3, note: "Jump and pull knees to chest at the peak. Land softly. Rest 60 seconds between sets." },
      { name: "Burpee to Broad Jump", type: "cardio", sets: 3, reps: 6, weight: "Bodyweight", day: 3, note: "Standard burpee but instead of jumping up, explode forward in a broad jump. Brutal but effective." },
      { name: "Farmer's Carry", type: "strength", sets: 3, duration: "45s", day: 3, note: "Heavy dumbbells at your sides, walk with tall posture. Grip, core, shoulders, traps—everything works. Don't rush." }
    ]
  },

  // 10. Intermediate Calisthenics Skills
  {
    id: "intermediate-calisthenics",
    title: "Intermediate Calisthenics Skills",
    badge: "Emphasis: Skill Progressions",
    description: "Level up your bodyweight training with muscle-up progressions, L-sit development, pistol squat mastery, and handstand work. Real gymnastic skill building.",
    theme: "emerald",
    goal: "Advanced Bodyweight Skills & Relative Strength",
    level: "Intermediate",
    exercises: [
      // Day 1 (Push & Handstand)
      { name: "Wall Handstand Practice", type: "strength", sets: 4, duration: "30s", day: 1, note: "Chest facing wall, walk feet up. Arms locked, shoulders active. Build to 60 seconds over 6 weeks." },
      { name: "Ring Dips (or Parallel Bar Dips)", type: "strength", sets: 4, reps: 8, weight: "Bodyweight", day: 1, note: "Full lockout at top, elbows past 90 degrees at bottom. Rings turned out at the top if using rings." },
      { name: "Pseudo Planche Push-ups", type: "strength", sets: 3, reps: 8, weight: "Bodyweight", day: 1, note: "Hands by hips, fingers pointing backward. Lean forward heavily. Builds planche pressing strength." },
      { name: "L-Sit Progression (Floor)", type: "strength", sets: 4, duration: "15s", day: 1, note: "Hands on floor, lift hips and extend legs. If too hard, tuck knees first. Depress shoulders aggressively." },
      { name: "Pike Handstand Push-ups", type: "strength", sets: 3, reps: 6, weight: "Bodyweight", day: 1, note: "Feet elevated on box, hips high. Lower head to floor, press back up. Direct handstand push-up progression." },
      // Day 2 (Pull & Legs)
      { name: "Chest-to-Bar Pull-ups", type: "strength", sets: 4, reps: 6, weight: "Bodyweight", day: 2, note: "Pull higher than chin—chest touches bar. Builds the explosive pull needed for muscle-ups." },
      { name: "Muscle-up Transitions (Low Bar)", type: "strength", sets: 4, reps: 5, weight: "Bodyweight", day: 2, note: "Use a low bar to practice the transition from pull to dip. Jump slightly to assist if needed." },
      { name: "Pistol Squats (Assisted)", type: "strength", sets: 3, reps: 6, weight: "Bodyweight", day: 2, note: "Hold a pole or doorframe for balance. Full depth on one leg, stand without using assistance. 6 each leg." },
      { name: "Nordic Hamstring Curls (Negative)", type: "strength", sets: 3, reps: 5, weight: "Bodyweight", day: 2, note: "Kneel, anchor feet. Lower yourself as slowly as possible toward the floor. Catch with hands, kneel back up." },
      { name: "Skin the Cat", type: "strength", sets: 3, reps: 4, weight: "Bodyweight", day: 2, note: "Hang from bar, tuck and rotate backward through arms. Incredible shoulder mobility and strength builder." },
      // Day 3 (Skills & Core)
      { name: "Freestanding Handstand Kick-ups", type: "strength", sets: 5, reps: 3, weight: "Bodyweight", day: 3, note: "Kick up to handstand away from wall, hold as long as possible. Focus on finger balance. 3 attempts per set." },
      { name: "Archer Pull-ups", type: "strength", sets: 3, reps: 6, weight: "Bodyweight", day: 3, note: "Wide grip, pull toward one hand while the other arm extends straight. Builds one-arm pull-up strength." },
      { name: "Dragon Flags (Negative)", type: "strength", sets: 3, reps: 5, weight: "Bodyweight", day: 3, note: "Lie on bench, grip behind head. Raise body to vertical, then lower as slowly as possible. Keep body straight." },
      { name: "Ring Support Holds", type: "strength", sets: 3, duration: "20s", day: 3, note: "Locked arms on rings, rings turned out. Builds foundational ring strength. Should feel hard—this is normal." }
    ]
  },

  // 11. Functional Fitness & CrossFit-Style
  {
    id: "functional-crossfit",
    title: "Functional Fitness & CrossFit-Style",
    badge: "Emphasis: GPP & Work Capacity",
    description: "Barbell complexes, AMRAPs, and EMOMs that build general physical preparedness. High intensity, constantly varied functional movements at high intensity.",
    theme: "coral",
    goal: "General Physical Preparedness & Work Capacity",
    level: "Intermediate",
    exercises: [
      // Day 1 (Barbell Complex + AMRAP)
      { name: "Barbell Complex (DL-Row-Clean-Press)", type: "strength", sets: 5, reps: 6, weight: "65 lbs", day: 1, note: "6 deadlifts, 6 rows, 6 hang cleans, 6 presses without putting bar down. Rest 90s between rounds." },
      { name: "Wall Balls", type: "strength", sets: 4, reps: 15, weight: "14 lbs", day: 1, note: "Squat deep, explode up and throw ball to 10-foot target. Catch and immediately descend into next squat." },
      { name: "Rowing Machine (AMRAP 4 min)", type: "cardio", sets: 1, duration: "4m", day: 1, note: "Maximum calories in 4 minutes. Rate 28-32 strokes/min. Full leg drive, lay back hard, arms fast." },
      { name: "Toes-to-Bar", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 1, note: "Hang from bar, swing toes to touch the bar. If too hard, do knees-to-elbows instead." },
      { name: "Box Jump Overs", type: "cardio", sets: 3, reps: 12, weight: "Bodyweight", day: 1, note: "Jump onto box, jump or step down the other side. Keep moving—this is for conditioning, not max height." },
      // Day 2 (EMOM + Strength)
      { name: "Front Squats (EMOM 10 min)", type: "strength", sets: 10, reps: 3, weight: "95 lbs", day: 2, note: "Every Minute On the Minute: 3 front squats. Rest the remainder of the minute. Should get harder each round." },
      { name: "Power Cleans", type: "strength", sets: 5, reps: 3, weight: "95 lbs", day: 2, note: "Bar from floor to shoulders in one explosive movement. Catch in quarter squat. Reset each rep." },
      { name: "Push-up + Pull-up Ladder", type: "strength", sets: 5, reps: 10, weight: "Bodyweight", day: 2, note: "10 push-ups then 10 pull-ups. Then 8 and 8, then 6 and 6, then 4 and 4, then 2 and 2. No rest." },
      { name: "Assault Bike Sprint", type: "cardio", sets: 5, duration: "20s", day: 2, note: "20 seconds all-out, 40 seconds rest. 5 rounds. The bike always wins—give it everything anyway." },
      // Day 3 (Chipper + Conditioning)
      { name: "Deadlifts", type: "strength", sets: 4, reps: 8, weight: "135 lbs", day: 3, note: "Moderate weight, perfect form every rep. Bar stays close to body. Stand tall and squeeze glutes at top." },
      { name: "Dumbbell Snatches (Alternating)", type: "strength", sets: 4, reps: 10, weight: "35 lbs", day: 3, note: "Floor to overhead in one motion, one arm at a time. Powerful hip extension drives the weight up." },
      { name: "Double-Unders (or Singles)", type: "cardio", sets: 3, reps: 30, weight: "Bodyweight", day: 3, note: "Jump rope passes under feet twice per jump. If learning, do 60 single-unders instead." },
      { name: "Burpee Pull-ups", type: "cardio", sets: 3, reps: 8, weight: "Bodyweight", day: 3, note: "Burpee under a pull-up bar, jump and do a pull-up at the top. The ultimate full-body conditioning move." },
      { name: "Plank Hold", type: "strength", sets: 3, duration: "45s", day: 3, note: "After all that intensity, hold a perfect plank. Squeeze everything. This is mental toughness training." }
    ]
  },

  // 12. Bodybuilding Bro Split
  {
    id: "bodybuilding-bro-split",
    title: "Bodybuilding Bro Split",
    badge: "Emphasis: Muscle Isolation & Volume",
    description: "The classic bodybuilding approach: dedicate each day to specific muscle groups with high volume and isolation work. Maximizes the mind-muscle connection.",
    theme: "pink",
    goal: "Maximum Muscle Size & Definition",
    level: "Intermediate",
    exercises: [
      // Day 1 (Chest & Triceps)
      { name: "Flat Barbell Bench Press", type: "strength", sets: 4, reps: 10, weight: "95 lbs", day: 1, note: "Warm up thoroughly. Full range of motion, controlled descent, powerful press. Squeeze chest at top." },
      { name: "Incline Dumbbell Chest Fly", type: "strength", sets: 3, reps: 12, weight: "2x 20 lbs", day: 1, note: "30-degree incline, arms open wide. Feel the deep stretch, bring dumbbells together squeezing chest." },
      { name: "Cable Crossovers (Low-to-High)", type: "strength", sets: 3, reps: 12, weight: "20 lbs", day: 1, note: "Cables from low position, bring handles up and together. Targets upper chest fibers specifically." },
      { name: "Tricep Rope Pushdowns", type: "strength", sets: 3, reps: 12, weight: "35 lbs", day: 1, note: "Keep elbows at your sides. Spread the rope apart at the bottom and squeeze triceps hard." },
      { name: "Overhead Dumbbell Tricep Extension", type: "strength", sets: 3, reps: 10, weight: "25 lbs", day: 1, note: "One heavy dumbbell behind your head with both hands. Stretch deep, extend fully. Hits the long head." },
      // Day 2 (Back & Biceps)
      { name: "Barbell Deadlifts", type: "strength", sets: 4, reps: 8, weight: "135 lbs", day: 2, note: "Conventional stance, mixed or hook grip. Drag bar up legs, lock out with hips. Builds a thick back." },
      { name: "Lat Pulldowns (Wide Grip)", type: "strength", sets: 3, reps: 10, weight: "70 lbs", day: 2, note: "Pull bar to upper chest, lean back slightly. Focus on pulling with your lats, not biceps." },
      { name: "Dumbbell Single-Arm Rows", type: "strength", sets: 3, reps: 10, weight: "35 lbs", day: 2, note: "One knee on bench, pull dumbbell to hip. Squeeze lat at the top. 10 each arm." },
      { name: "EZ Bar Curls", type: "strength", sets: 3, reps: 10, weight: "40 lbs", day: 2, note: "Angled grip is easier on wrists. Keep upper arms stationary, curl bar to shoulders, squeeze biceps." },
      { name: "Incline Dumbbell Curls", type: "strength", sets: 3, reps: 10, weight: "2x 15 lbs", day: 2, note: "45-degree bench, arms hang straight down. Long stretch at the bottom targets the long head of biceps." },
      // Day 3 (Shoulders & Legs)
      { name: "Barbell Back Squats", type: "strength", sets: 4, reps: 10, weight: "115 lbs", day: 3, note: "Moderate weight, full depth. Controlled descent for 3 seconds, explosive drive up. Quad and glute builder." },
      { name: "Seated Dumbbell Shoulder Press", type: "strength", sets: 4, reps: 10, weight: "2x 25 lbs", day: 3, note: "Press overhead, lower to ear height. Don't bounce at the bottom. Builds capped delts." },
      { name: "Dumbbell Lateral Raises", type: "strength", sets: 4, reps: 15, weight: "2x 10 lbs", day: 3, note: "Light weight, high reps. Raise to shoulder height with slight bend in elbows. Medial delt builder." },
      { name: "Romanian Deadlifts", type: "strength", sets: 3, reps: 10, weight: "95 lbs", day: 3, note: "Barbell or dumbbells, hinge until hamstrings stretch maximally. Stand by squeezing glutes." },
      { name: "Standing Calf Raises", type: "strength", sets: 4, reps: 15, weight: "55 lbs", day: 3, note: "Calves need high reps. Full stretch at bottom, hard squeeze at top. Slow tempo: 2 up, 2 down." }
    ]
  },

  // 13. Strength & Conditioning Hybrid
  {
    id: "strength-conditioning-hybrid",
    title: "Strength & Conditioning Hybrid",
    badge: "Emphasis: Heavy Lifts + Cardio Finishers",
    description: "Get strong AND fit. Heavy compound lifts paired with conditioning finishers that build both maximal strength and cardiovascular endurance in the same session.",
    theme: "babyblue",
    goal: "Combined Strength & Cardiovascular Fitness",
    level: "Intermediate",
    exercises: [
      // Day 1 (Squat Day + Conditioning)
      { name: "Barbell Back Squats", type: "strength", sets: 5, reps: 5, weight: "145 lbs", day: 1, note: "Work up to a heavy 5x5. Rest 2-3 minutes between sets. Below parallel every rep, no exceptions." },
      { name: "Barbell Front Squats", type: "strength", sets: 3, reps: 8, weight: "95 lbs", day: 1, note: "Elbows high, bar on front delts. Lighter than back squats but more quad-dominant. Stay upright." },
      { name: "Walking Lunges", type: "strength", sets: 3, reps: 12, weight: "2x 25 lbs", day: 1, note: "Finish leg work with lunges—burn out the quads and glutes. Long steps, upright torso." },
      { name: "Assault Bike Finisher", type: "cardio", sets: 1, duration: "8m", day: 1, note: "4 rounds: 30 seconds max effort, 90 seconds easy spin. Heart rate should hit 85%+ max on work intervals." },
      // Day 2 (Bench Day + Conditioning)
      { name: "Barbell Bench Press", type: "strength", sets: 5, reps: 5, weight: "115 lbs", day: 2, note: "Pause 1 second on chest each rep. Builds strength off the chest—the weakest point for most people." },
      { name: "Incline Dumbbell Press", type: "strength", sets: 3, reps: 10, weight: "2x 30 lbs", day: 2, note: "Volume work after heavy benching. Focus on stretch at bottom and chest contraction at top." },
      { name: "Dumbbell Rows (Single Arm)", type: "strength", sets: 3, reps: 10, weight: "40 lbs", day: 2, note: "Pull to hip, squeeze lat. Keep hips square—no rotation. 10 each arm." },
      { name: "Rowing Machine Intervals", type: "cardio", sets: 1, duration: "10m", day: 2, note: "500m hard row, 500m easy row. Repeat for 10 minutes. Target under 1:50/500m on hard pieces." },
      { name: "Plank to Push-up", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 2, note: "Start on forearms, press up to hands one arm at a time. Alternate starting arms. Core stability builder." },
      // Day 3 (Deadlift Day + Conditioning)
      { name: "Barbell Deadlifts", type: "strength", sets: 5, reps: 3, weight: "195 lbs", day: 3, note: "Heavy triples. Reset every rep—no touch-and-go. Focus on perfect position off the floor each time." },
      { name: "Barbell Hip Thrusts", type: "strength", sets: 3, reps: 10, weight: "135 lbs", day: 3, note: "Upper back on bench. Drive hips to full extension, squeeze glutes 2 seconds. Best glute builder that exists." },
      { name: "Farmer's Carries", type: "strength", sets: 3, duration: "45s", day: 3, note: "Heavy dumbbells or trap bar. Walk with tall posture, shoulders packed. 45 seconds continuous walking." },
      { name: "Kettlebell Swing Finisher", type: "cardio", sets: 1, duration: "5m", day: 3, note: "15 swings every minute on the minute for 5 minutes. Use a heavy bell (44-53 lbs). All-out hip snap each rep." }
    ]
  },

  // 14. Core & Posture Correction
  {
    id: "core-posture-correction",
    title: "Core & Posture Correction",
    badge: "Emphasis: Anti-Rotation & Stability",
    description: "Fix your posture and build a bulletproof core with anti-rotation exercises, thoracic mobility drills, and scapular stability work. Essential for desk workers and lifters.",
    theme: "emerald",
    goal: "Postural Correction & Core Stability",
    level: "Intermediate",
    exercises: [
      // Day 1 (Anti-Rotation & Bracing)
      { name: "Pallof Press (Cable)", type: "strength", sets: 3, reps: 10, weight: "20 lbs", day: 1, note: "Stand sideways to cable. Press handles forward, resist rotation. Hold 2 seconds extended. 10 each side." },
      { name: "Dead Bug (Opposite Arm/Leg)", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 1, note: "Lower back MUST stay pressed into the floor. If it lifts, reduce range of motion. Quality over speed." },
      { name: "Bird Dog with Pause", type: "strength", sets: 3, reps: 8, weight: "Bodyweight", day: 1, note: "Extend opposite arm and leg, hold 3 seconds. Keep hips level—don't rotate. 8 each side." },
      { name: "Suitcase Carry (Single-Arm)", type: "strength", sets: 3, duration: "30s", day: 1, note: "Heavy dumbbell in one hand, walk without leaning. Your obliques fight the lateral pull. 30 seconds each side." },
      { name: "Ab Wheel Rollouts (Kneeling)", type: "strength", sets: 3, reps: 8, weight: "Bodyweight", day: 1, note: "Roll out as far as you can control, pull back with abs. If lower back arches, you've gone too far." },
      // Day 2 (Thoracic Mobility & Scapular Health)
      { name: "Thoracic Spine Foam Rolling", type: "strength", sets: 3, duration: "60s", day: 2, note: "Upper back on foam roller, extend over it. Move up and down the thoracic spine. Breathe deeply into the stretch." },
      { name: "Wall Slides", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 2, note: "Back against wall, arms in goalpost position. Slide arms up keeping contact with wall. Opens tight chest and shoulders." },
      { name: "Face Pulls with External Rotation", type: "strength", sets: 3, reps: 15, weight: "20 lbs", day: 2, note: "Pull rope to face, then rotate hands up until forearms are vertical. Strengthens rear delts and rotator cuff." },
      { name: "Banded Pull-Aparts", type: "strength", sets: 3, reps: 15, weight: "Light band", day: 2, note: "Hold band at chest height, pull apart until arms are wide. 2-second hold at full stretch. Builds upper back." },
      { name: "Prone Y-T-W Raises", type: "strength", sets: 3, reps: 8, weight: "Bodyweight", day: 2, note: "Lie face down. Raise arms into Y, T, and W positions. 8 reps of each letter = 1 set. Scapular stability gold." },
      // Day 3 (Hip Stability & Integration)
      { name: "Single-Leg Glute Bridge", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 3, note: "One foot on floor, other leg extended. Drive hips up evenly—don't let hips tilt. 10 each leg." },
      { name: "Copenhagen Plank (Adductor)", type: "strength", sets: 3, duration: "20s", day: 3, note: "Side plank with top leg on bench. Hold 20 seconds each side. Strengthens often-neglected inner thigh muscles." },
      { name: "Half-Kneeling Chop (Cable)", type: "strength", sets: 3, reps: 10, weight: "15 lbs", day: 3, note: "High cable, pull down diagonally across body. Anti-rotation and hip stability in one. 10 each side." },
      { name: "Turkish Get-up", type: "strength", sets: 3, reps: 3, weight: "15 lbs", day: 3, note: "Floor to standing with one arm overhead. Go slowly—this is a skill, not a cardio exercise. 3 each arm." },
      { name: "90/90 Hip Stretch", type: "strength", sets: 3, duration: "30s", day: 3, note: "Both legs at 90 degrees on the floor. Lean forward over front shin. 30 seconds each side. Opens tight hips." }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // ADVANCED LEVEL (6 programs)
  // ═══════════════════════════════════════════════════════════════

  // 15. Powerlifting Peaking Program
  {
    id: "powerlifting-peaking",
    title: "Powerlifting Peaking Program",
    badge: "Emphasis: Squat/Bench/Deadlift Periodization",
    description: "Structured periodization for the three competition lifts. Heavy singles, triples, and fives with specific accessory work to address weak points and peak for maximum 1RMs.",
    theme: "coral",
    goal: "Maximum 1RM Strength on Squat, Bench & Deadlift",
    level: "Advanced",
    exercises: [
      // Day 1 (Heavy Squat + Squat Accessories)
      { name: "Competition Back Squats", type: "strength", sets: 5, reps: 3, weight: "225 lbs", day: 1, note: "Comp depth every rep—crease of hip below top of knee. Rest 3-4 minutes. Belt up for working sets." },
      { name: "Paused Back Squats", type: "strength", sets: 3, reps: 3, weight: "185 lbs", day: 1, note: "3-second pause in the hole. Builds strength out of the bottom. Don't relax at the bottom—stay tight." },
      { name: "Bulgarian Split Squats", type: "strength", sets: 3, reps: 8, weight: "2x 30 lbs", day: 1, note: "Rear foot elevated. Addresses single-leg weaknesses and builds quad strength that carries over to squats." },
      { name: "Leg Press (Close Stance)", type: "strength", sets: 3, reps: 10, weight: "225 lbs", day: 1, note: "Narrow foot placement for quad emphasis. Full range of motion, don't let lower back round off the pad." },
      { name: "GHD Back Extensions", type: "strength", sets: 3, reps: 12, weight: "Bodyweight", day: 1, note: "Glute-ham developer or 45-degree hyperextension. Squeeze glutes at top. Builds spinal erector endurance." },
      // Day 2 (Heavy Bench + Bench Accessories)
      { name: "Competition Bench Press", type: "strength", sets: 5, reps: 3, weight: "185 lbs", day: 2, note: "Pause on chest each rep—commands in competition. Big arch, heels down, drive with legs." },
      { name: "Close-Grip Bench Press", type: "strength", sets: 3, reps: 6, weight: "155 lbs", day: 2, note: "Hands shoulder-width. Builds lockout strength and tricep power. Touch lower on chest than competition grip." },
      { name: "Dumbbell Incline Press", type: "strength", sets: 3, reps: 10, weight: "2x 40 lbs", day: 2, note: "Builds upper chest and stabilizer muscles. Slow eccentric for 3 seconds, press up powerfully." },
      { name: "Barbell Rows (Pendlay)", type: "strength", sets: 4, reps: 6, weight: "135 lbs", day: 2, note: "Bar from floor each rep, explosive row to lower chest. Builds the upper back shelf for bench stability." },
      { name: "JM Press", type: "strength", sets: 3, reps: 8, weight: "75 lbs", day: 2, note: "Hybrid between close-grip bench and skull crusher. Lower bar to chin level, press up. Elite tricep builder." },
      // Day 3 (Heavy Deadlift + DL Accessories)
      { name: "Competition Deadlifts", type: "strength", sets: 5, reps: 2, weight: "315 lbs", day: 3, note: "Heavy doubles, reset every rep. Stance and grip match competition setup. Chalk required. Belt optional." },
      { name: "Deficit Deadlifts (2-inch)", type: "strength", sets: 3, reps: 4, weight: "255 lbs", day: 3, note: "Stand on 2-inch platform. Builds strength off the floor—the most common sticking point. Reduce weight 15-20%." },
      { name: "Barbell Hip Thrusts", type: "strength", sets: 3, reps: 8, weight: "185 lbs", day: 3, note: "Heavy hip thrusts build lockout strength for deadlifts. Pause 2 seconds at the top of each rep." },
      { name: "Weighted Pull-ups", type: "strength", sets: 3, reps: 6, weight: "+25 lbs", day: 3, note: "Builds lat strength that keeps the bar close during deadlifts. Full dead hang, chest to bar." },
      { name: "Heavy Farmer's Walk", type: "strength", sets: 3, duration: "30s", day: 3, note: "Heaviest dumbbells you can carry with good posture. Builds the grip endurance to never lose a deadlift to grip." }
    ]
  },

  // 16. Advanced Calisthenics Mastery
  {
    id: "advanced-calisthenics",
    title: "Advanced Calisthenics Mastery",
    badge: "Emphasis: Planche, Lever & Muscle-up Combos",
    description: "Elite bodyweight training for experienced practitioners. Planche progressions, front lever work, muscle-up combinations, and advanced gymnastic skills.",
    theme: "pink",
    goal: "Elite Bodyweight Skill & Relative Strength",
    level: "Advanced",
    exercises: [
      // Day 1 (Push Skills & Planche)
      { name: "Planche Lean Push-ups", type: "strength", sets: 4, reps: 6, weight: "Bodyweight", day: 1, note: "Hands by hips, lean shoulders as far forward as possible. Press from this position. Extreme shoulder demand." },
      { name: "Weighted Ring Dips", type: "strength", sets: 4, reps: 8, weight: "+20 lbs", day: 1, note: "Deep dip with rings turned out at top. Full lockout. Builds the pressing strength needed for muscle-ups." },
      { name: "Straddle Planche Hold", type: "strength", sets: 5, duration: "8s", day: 1, note: "Hands on floor, lift body horizontal with legs straddled. Even 3-5 seconds is elite. Protract shoulders fully." },
      { name: "Handstand Push-ups (Wall)", type: "strength", sets: 4, reps: 5, weight: "Bodyweight", day: 1, note: "Head touches floor, press to full lockout. Hands slightly wider than shoulders. Ultimate overhead pressing." },
      { name: "L-Sit to Shoulder Stand (Floor)", type: "strength", sets: 3, reps: 3, weight: "Bodyweight", day: 1, note: "L-sit position, press hips up and over into shoulder stand. Requires immense pressing strength and control." },
      // Day 2 (Pull Skills & Front Lever)
      { name: "Muscle-ups (Bar)", type: "strength", sets: 5, reps: 3, weight: "Bodyweight", day: 2, note: "Kip minimally—pull explosively through the transition. Clean reps with full lockout on top. 3 clean reps." },
      { name: "Front Lever Rows", type: "strength", sets: 4, reps: 5, weight: "Bodyweight", day: 2, note: "Hang in front lever (or tuck), row body to bar while maintaining horizontal position. Brutal back exercise." },
      { name: "Front Lever Hold (Progression)", type: "strength", sets: 4, duration: "10s", day: 2, note: "Full front lever or advanced tuck. Body horizontal, arms straight. 10 seconds of quality holds." },
      { name: "One-Arm Pull-up Negatives", type: "strength", sets: 3, reps: 3, weight: "Bodyweight", day: 2, note: "Pull up with two arms, release one, lower on single arm for 5-8 seconds. 3 each arm. Peak pulling strength." },
      { name: "Skin the Cat to Back Lever", type: "strength", sets: 3, reps: 3, weight: "Bodyweight", day: 2, note: "Rotate through skin the cat, hold briefly in back lever position. Builds incredible shoulder flexibility and strength." },
      // Day 3 (Skills Integration & Legs)
      { name: "Freestanding Handstand", type: "strength", sets: 5, duration: "20s", day: 3, note: "No wall. Kick up and balance using fingers and wrist. Practice shape—hollow body, pointed toes, active shoulders." },
      { name: "Pistol Squats (Weighted)", type: "strength", sets: 4, reps: 6, weight: "+15 lbs", day: 3, note: "Hold dumbbell or plate at chest. Full depth single-leg squat, stand without wobbling. 6 each leg." },
      { name: "Muscle-up to L-Sit (Bar)", type: "strength", sets: 3, reps: 3, weight: "Bodyweight", day: 3, note: "Muscle-up, then lift legs to L-sit on top of the bar. Hold 3 seconds. Combination of pulling and compression." },
      { name: "Dragon Flags", type: "strength", sets: 3, reps: 5, weight: "Bodyweight", day: 3, note: "Full dragon flag—body straight as a board from shoulders down. Lower slowly for 4 seconds, raise for 2." },
      { name: "Manna Progression", type: "strength", sets: 3, duration: "8s", day: 3, note: "V-sit with hips lifted as high as possible behind hands. Extreme hip flexor and compression strength required." }
    ]
  },

  // 17. Olympic Lifting Foundation
  {
    id: "olympic-lifting",
    title: "Olympic Lifting Foundation",
    badge: "Emphasis: Clean, Jerk & Snatch Progressions",
    description: "Learn the competitive Olympic lifts with structured progressions. Develops explosive hip power, full-body coordination, and athletic performance that transfers to every sport.",
    theme: "babyblue",
    goal: "Olympic Lift Technique & Explosive Power",
    level: "Advanced",
    exercises: [
      // Day 1 (Clean & Jerk Focus)
      { name: "Muscle Cleans (Technique)", type: "strength", sets: 4, reps: 5, weight: "65 lbs", day: 1, note: "No squat under the bar—pull and receive with straight legs. Ingrains the pull pattern and turnover speed." },
      { name: "Hang Power Cleans", type: "strength", sets: 5, reps: 3, weight: "115 lbs", day: 1, note: "Start at mid-thigh, explode hips, catch in quarter squat. Elbows fast and high in the receiving position." },
      { name: "Push Jerk", type: "strength", sets: 5, reps: 3, weight: "95 lbs", day: 1, note: "Dip and drive with legs, then press under the bar into a quarter squat receiving position. Punch the ceiling." },
      { name: "Front Squats", type: "strength", sets: 4, reps: 5, weight: "135 lbs", day: 1, note: "Full depth, elbows high throughout. Builds the receiving position strength for cleans. No rounding." },
      { name: "Clean Pulls", type: "strength", sets: 3, reps: 5, weight: "155 lbs", day: 1, note: "Same pull as the clean but don't catch—just extend fully onto toes. Overloads the pulling pattern." },
      // Day 2 (Snatch Focus)
      { name: "Snatch Grip Deadlifts", type: "strength", sets: 4, reps: 5, weight: "135 lbs", day: 2, note: "Wide snatch grip. Builds positional strength for the first pull. Keep lats tight, shoulders over the bar." },
      { name: "Hang Power Snatches", type: "strength", sets: 5, reps: 3, weight: "75 lbs", day: 2, note: "From mid-thigh to overhead in one movement. Wide grip, punch up aggressively. Catch with locked arms." },
      { name: "Overhead Squats", type: "strength", sets: 4, reps: 5, weight: "65 lbs", day: 2, note: "Snatch grip with bar locked out overhead, squat to full depth. Demands mobility and stability simultaneously." },
      { name: "Snatch Pulls", type: "strength", sets: 3, reps: 5, weight: "115 lbs", day: 2, note: "Full extension onto toes with wide grip. Shrug aggressively at the top. Builds the second pull." },
      { name: "Pressing Snatch Balance", type: "strength", sets: 3, reps: 5, weight: "55 lbs", day: 2, note: "Bar on back, press overhead while dropping into overhead squat position. Trains the receiving position." },
      // Day 3 (Full Lifts & Strength)
      { name: "Full Cleans (Squat Clean)", type: "strength", sets: 5, reps: 2, weight: "135 lbs", day: 3, note: "Full squat clean. Pull bar from floor, catch in full front squat position, stand up. The complete lift." },
      { name: "Full Snatch", type: "strength", sets: 5, reps: 2, weight: "95 lbs", day: 3, note: "Floor to overhead in one movement, catching in full overhead squat. Master this and you've arrived." },
      { name: "Clean & Jerk Complex", type: "strength", sets: 3, reps: 2, weight: "115 lbs", day: 3, note: "1 clean + 1 jerk = 1 rep. 2 complexes per set. Rest 2-3 minutes between sets. Competition simulation." },
      { name: "Back Squats", type: "strength", sets: 3, reps: 5, weight: "185 lbs", day: 3, note: "Heavy squats build the legs that drive the Olympic lifts. Full depth, controlled descent." },
      { name: "Romanian Deadlifts", type: "strength", sets: 3, reps: 8, weight: "135 lbs", day: 3, note: "Strengthens the posterior chain for the pulling phase. Bar stays close to legs, hamstring stretch at bottom." }
    ]
  },

  // 18. Extreme HIIT Metabolic Conditioning
  {
    id: "extreme-hiit-metcon",
    title: "Extreme HIIT Metabolic Conditioning",
    badge: "Emphasis: Tabata & Brutal Circuits",
    description: "Not for the faint of heart. Tabata intervals, barbell complexes, and metabolic conditioning circuits designed to push your cardiovascular system to absolute limits.",
    theme: "emerald",
    goal: "Maximum Metabolic Output & VO2 Max",
    level: "Advanced",
    exercises: [
      // Day 1 (Tabata Gauntlet)
      { name: "Tabata Assault Bike", type: "cardio", sets: 8, duration: "20s", day: 1, note: "20 seconds absolute max effort, 10 seconds rest. 8 rounds = 4 minutes of hell. Go 100% every interval." },
      { name: "Barbell Thrusters (For Time)", type: "strength", sets: 3, reps: 15, weight: "75 lbs", day: 1, note: "15 unbroken thrusters per set. Front squat to overhead press. Don't put the bar down. Rest 60s between sets." },
      { name: "Box Jump Burpees", type: "cardio", sets: 4, reps: 10, weight: "Bodyweight", day: 1, note: "Burpee facing box, jump onto box, stand fully. Step down. 10 reps without stopping. Move fast." },
      { name: "Kettlebell Snatches", type: "strength", sets: 4, reps: 10, weight: "35 lbs", day: 1, note: "Floor to overhead in one explosive hip-driven motion. 10 each arm without rest. Switch hands at the top." },
      { name: "Tabata Rowing", type: "cardio", sets: 8, duration: "20s", day: 1, note: "Max meters in 20 seconds, 10 seconds rest. 8 rounds. Total meter score is your benchmark—beat it next time." },
      // Day 2 (Complex Circuits)
      { name: "Barbell Complex (Power Clean-FS-PP-BS)", type: "strength", sets: 5, reps: 5, weight: "95 lbs", day: 2, note: "5 power cleans, 5 front squats, 5 push presses, 5 back squats. Don't drop the bar. 90 second rest between." },
      { name: "Devil's Press (DB Burpee to Snatch)", type: "strength", sets: 4, reps: 8, weight: "2x 25 lbs", day: 2, note: "Burpee with dumbbells, then swing them overhead in a snatch motion. One of the most brutal exercises in existence." },
      { name: "Wall Ball Shots", type: "strength", sets: 3, reps: 20, weight: "20 lbs", day: 2, note: "Deep squat, throw ball to 10-foot target. 20 unbroken reps. Your lungs will burn—that's the point." },
      { name: "Calorie Row (Max Effort)", type: "cardio", sets: 3, duration: "60s", day: 2, note: "Maximum calories in 60 seconds. Rate 30+. Full power every stroke. Rest 2 minutes between efforts." },
      { name: "Plank Hold (Endurance)", type: "strength", sets: 1, duration: "120s", day: 2, note: "2-minute plank after everything else. Mental and physical endurance test. Don't let hips drop." },
      // Day 3 (Death by Conditioning)
      { name: "Ski Erg Sprint Intervals", type: "cardio", sets: 6, duration: "30s", day: 3, note: "30 seconds max effort, 30 seconds rest. 6 rounds. Full body pulling motion, engage lats and core." },
      { name: "Dumbbell Man Makers", type: "strength", sets: 3, reps: 8, weight: "2x 30 lbs", day: 3, note: "Push-up, row left, row right, clean to standing, thruster. That's ONE rep. 8 reps without stopping." },
      { name: "Battle Rope Slam Tabata", type: "cardio", sets: 8, duration: "20s", day: 3, note: "20 seconds simultaneous rope slams, 10 seconds rest. 8 rounds. Stay in a half squat throughout." },
      { name: "200m Sprint Repeats", type: "cardio", sets: 4, duration: "35s", day: 3, note: "200 meters at near-max speed. Walk back to start as recovery. 4 repeats. Pure anaerobic capacity." },
      { name: "Hollow Body Holds", type: "strength", sets: 3, duration: "30s", day: 3, note: "Arms overhead, legs extended, lower back on floor. Everything off the ground. The gymnast's core secret." }
    ]
  },

  // 19. Advanced Push/Pull/Legs Volume
  {
    id: "advanced-ppl-volume",
    title: "Advanced Push/Pull/Legs Volume",
    badge: "Emphasis: High Volume, Drop Sets & Giant Sets",
    description: "Extreme training volume with advanced intensification techniques. Drop sets, giant sets, and mechanical advantage strategies to push past every plateau.",
    theme: "coral",
    goal: "Maximum Hypertrophy Through Extreme Volume",
    level: "Advanced",
    exercises: [
      // Day 1 (Push - High Volume)
      { name: "Barbell Bench Press (Pyramid)", type: "strength", sets: 5, reps: 12, weight: "135 lbs", day: 1, note: "Pyramid: 12, 10, 8, 6, 15 reps. Increase weight each set until set 4, then drop to lighter weight for max reps." },
      { name: "Incline DB Press + Fly Giant Set", type: "strength", sets: 4, reps: 10, weight: "2x 35 lbs", day: 1, note: "10 presses immediately into 10 flys. No rest between movements. That's ONE set. 30 seconds rest, repeat." },
      { name: "Cable Crossover Drop Set", type: "strength", sets: 3, reps: 12, weight: "30 lbs", day: 1, note: "12 reps, drop weight 30%, 12 more, drop 30%, max reps. Three drops = one set. Chest should be destroyed." },
      { name: "Seated DB Shoulder Press (Mechanical Drop)", type: "strength", sets: 3, reps: 8, weight: "2x 30 lbs", day: 1, note: "8 strict presses, immediately do 8 push presses using legs for assistance. Extends the set past failure." },
      { name: "Tricep Dip + Pushdown Superset", type: "strength", sets: 3, reps: 12, weight: "Bodyweight + 30 lbs cable", day: 1, note: "12 dips immediately into 15 cable pushdowns. No rest between. Builds massive triceps with accumulated fatigue." },
      { name: "Lateral Raise 21s", type: "strength", sets: 3, reps: 21, weight: "2x 10 lbs", day: 1, note: "7 bottom-half reps, 7 top-half reps, 7 full reps. 21 total = one set. Burns like fire—that's correct." },
      // Day 2 (Pull - High Volume)
      { name: "Weighted Pull-ups (Pyramid)", type: "strength", sets: 5, reps: 8, weight: "+25 lbs", day: 2, note: "Pyramid: 8, 6, 4, 4, max bodyweight. Add weight each set, finish with bodyweight to failure." },
      { name: "Barbell Row + Dumbbell Row Superset", type: "strength", sets: 4, reps: 8, weight: "115 lbs + 40 lbs DB", day: 2, note: "8 barbell rows, immediately 10 single-arm dumbbell rows each arm. Back thickness guaranteed." },
      { name: "Cable Lat Pulldown (Drop Set)", type: "strength", sets: 3, reps: 10, weight: "80 lbs", day: 2, note: "10 reps, drop 20%, 10 more, drop 20%, max reps. Three drops per set. Focus on lat stretch at top." },
      { name: "Barbell Curl 21s", type: "strength", sets: 3, reps: 21, weight: "40 lbs", day: 2, note: "7 bottom-half curls, 7 top-half curls, 7 full curls. Classic bicep shock technique. Don't swing." },
      { name: "Face Pull + Rear Delt Fly Superset", type: "strength", sets: 3, reps: 15, weight: "25 lbs", day: 2, note: "15 face pulls into 12 rear delt cable flys. Builds the rear delts that make shoulders look 3D." },
      // Day 3 (Legs - High Volume)
      { name: "Barbell Back Squats (Ascending)", type: "strength", sets: 5, reps: 10, weight: "155 lbs", day: 3, note: "Start moderate, add weight each set: 10, 8, 6, 4, then strip back to starting weight for max reps." },
      { name: "Leg Press (Mechanical Drop Set)", type: "strength", sets: 3, reps: 12, weight: "225 lbs", day: 3, note: "12 reps wide stance, immediately 12 reps narrow stance, immediately 12 reps feet low. Same weight, three positions." },
      { name: "Romanian Deadlift + Leg Curl Superset", type: "strength", sets: 4, reps: 10, weight: "135 lbs + 60 lbs", day: 3, note: "10 RDLs followed immediately by 12 leg curls. Hamstrings get compound then isolation—brutal combination." },
      { name: "Walking Lunges (Extended Set)", type: "strength", sets: 3, reps: 20, weight: "2x 30 lbs", day: 3, note: "20 total steps per set without stopping. When you want to quit at rep 14, keep going. Mental toughness." },
      { name: "Calf Raise Drop Set", type: "strength", sets: 3, reps: 15, weight: "65 lbs", day: 3, note: "15 standing raises, drop 30%, 15 more, drop again, max reps. Calves need extreme volume to grow." }
    ]
  },

  // 20. Warrior Hybrid Training
  {
    id: "warrior-hybrid",
    title: "Warrior Hybrid Training",
    badge: "Emphasis: Military-Style Mixed Modality",
    description: "Inspired by military and tactical fitness. Combines heavy strength, bodyweight endurance, loaded carries, and rucking for complete combat-ready physical preparedness.",
    theme: "pink",
    goal: "Tactical Fitness & Complete Physical Readiness",
    level: "Advanced",
    exercises: [
      // Day 1 (Strength & Bodyweight Endurance)
      { name: "Barbell Deadlifts", type: "strength", sets: 5, reps: 3, weight: "225 lbs", day: 1, note: "Heavy triples to build absolute pulling strength. Reset each rep. Grip it and rip it with perfect form." },
      { name: "Push-up Max Set", type: "strength", sets: 3, reps: 30, weight: "Bodyweight", day: 1, note: "30+ push-ups per set. Full range, chest to floor. If you can't hit 30, do max reps. Build to 50." },
      { name: "Pull-up Ladder (1-5-1)", type: "strength", sets: 1, reps: 25, weight: "Bodyweight", day: 1, note: "1 pull-up, rest 10s, 2 pull-ups, rest 10s... up to 5, then back down. 25 total reps with micro-rests." },
      { name: "Sandbag Get-ups", type: "strength", sets: 3, reps: 6, weight: "40 lbs", day: 1, note: "Bear hug sandbag on ground, stand up with it. Lay back down. Simulates real-world lifting scenarios." },
      { name: "Farmer's Walk (Heavy)", type: "strength", sets: 3, duration: "60s", day: 1, note: "Heaviest dumbbells available. Walk 60 seconds with tall posture. Grip, traps, core—total body toughness." },
      // Day 2 (Rucking & Conditioning)
      { name: "Weighted Ruck March", type: "cardio", sets: 1, duration: "30m", day: 2, note: "30 minutes with 25-35 lb backpack at 3.5+ mph. Military standard. Builds aerobic base and mental toughness." },
      { name: "Barbell Overhead Press", type: "strength", sets: 4, reps: 6, weight: "95 lbs", day: 2, note: "Strict press, no leg drive. Builds the shoulder strength to carry loads overhead and above your head." },
      { name: "Body Armor Burpees (Weighted Vest)", type: "cardio", sets: 3, reps: 10, weight: "20 lb vest", day: 2, note: "Burpees with a weighted vest. Chest to floor, jump at top. If no vest, add a push-up at the bottom." },
      { name: "Rope Climbs (or Towel Pull-ups)", type: "strength", sets: 3, reps: 3, weight: "Bodyweight", day: 2, note: "Climb a 15-foot rope using legs to assist. If no rope, drape a towel over pull-up bar and do pull-ups on it." },
      { name: "Flutter Kicks", type: "strength", sets: 3, reps: 30, weight: "Bodyweight", day: 2, note: "Military-style: hands under glutes, 6 inches off ground. 30 reps = 15 each leg. Count out loud." },
      // Day 3 (Combat Circuits)
      { name: "Barbell Clean and Press", type: "strength", sets: 5, reps: 5, weight: "115 lbs", day: 3, note: "Clean from floor to shoulders, press overhead. Full body power movement. 5 clean reps with control." },
      { name: "Kettlebell Swing (Heavy)", type: "strength", sets: 4, reps: 15, weight: "53 lbs", day: 3, note: "Russian-style to chest height. Explosive hip snap, control the backswing. Posterior chain and grip builder." },
      { name: "Bear Crawl", type: "cardio", sets: 3, duration: "45s", day: 3, note: "Knees 2 inches off ground, crawl forward 20m, backward 20m. Stay low, stay controlled. Brutal total body." },
      { name: "Sled Push/Pull", type: "cardio", sets: 4, duration: "30s", day: 3, note: "Push sled 25m, drag it back 25m. If no sled, do a heavy prowler push or 30-second hill sprint instead." },
      { name: "Dead Hang (Max Hold)", type: "strength", sets: 3, duration: "45s", day: 3, note: "Hang from bar as long as possible, minimum 45 seconds. Grip endurance determines everything in tactical fitness." }
    ]
  }
]

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const
type DayOfWeek = typeof DAYS_OF_WEEK[number]

// Helper: count unique training days in a routine
function getRoutineDayCount(routine: Routine): number {
  const uniqueDays = new Set(routine.exercises.map(ex => ex.day))
  return uniqueDays.size
}

export function RoutinesLibrary() {
  const { user, isSignedIn } = useUser()
  const userId = isSignedIn && user ? user.id : "default-user"

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGoal, setSelectedGoal] = useState<string>("All")
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null)
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null)
  const [activatingId, setActivatingId] = useState<string | null>(null)
  const [showSyncSuccess, setShowSyncSuccess] = useState(false)

  // Training days selector state
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([])
  const [dayFilterMode, setDayFilterMode] = useState<"off" | "match">("off")

  // Load saved training days from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mitrixo-training-days")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedDays(parsed)
          setDayFilterMode("match")
        }
      }
    } catch {}
  }, [])

  // Save training days to localStorage
  useEffect(() => {
    if (selectedDays.length > 0) {
      localStorage.setItem("mitrixo-training-days", JSON.stringify(selectedDays))
    } else {
      localStorage.removeItem("mitrixo-training-days")
    }
  }, [selectedDays])

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays(prev => {
      const next = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
      setDayFilterMode(next.length > 0 ? "match" : "off")
      return next
    })
  }

  const clearDaySelection = () => {
    setSelectedDays([])
    setDayFilterMode("off")
  }

  const userDayCount = selectedDays.length

  // Filter routines based on search, goal selector, AND training day availability
  const filteredRoutines = ROUTINE_LIBRARY.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.goal.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesGoal = selectedGoal === "All" || item.level === selectedGoal

    // If day filter is on, only show routines that fit within available days
    const routineDays = getRoutineDayCount(item)
    const matchesDays = dayFilterMode === "off" || routineDays <= userDayCount

    return matchesSearch && matchesGoal && matchesDays
  })

  // Set active routine in planStore via Next.js API
  const handleActivateRoutine = async (routine: Routine) => {
    try {
      setActivatingId(routine.id)
      console.log(`📡 [Routines Library] Activating split: "${routine.title}" for user:`, userId)
      
      const formattedExercises = routine.exercises.map((ex) => ({
        name: ex.name,
        type: ex.type,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || "",
        duration: ex.duration || "",
        day: ex.day,
        note: ex.note || "",
        img: ex.img || ""
      }))

      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          planType: "workout",
          customPlan: formattedExercises,
          userMessage: `Customized with routine: ${routine.title}`
        })
      })

      if (response.ok) {
        setActiveRoutineId(routine.id)
        setShowSyncSuccess(true)
        console.log(`✅ [Routines Library] Split "${routine.title}" active in planStore.`)

        // Trigger context refresh across panels
        window.dispatchEvent(new CustomEvent("refreshContext"))

        setTimeout(() => {
          setShowSyncSuccess(false)
        }, 4000)
      } else {
        throw new Error(`Failed to activate: ${response.statusText}`)
      }
    } catch (e) {
      console.error("Failed to activate routine:", e)
      alert("Unable to activate routine. Check your connection or server console.")
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

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-extrabold uppercase px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Interactive Splits Library
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2">Select Workout Program</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Browse and activate professionally designed workout splits. Click <strong>Activate</strong> to dynamically update your active daily checklist and dashboard telemetry instantly.
        </p>
      </div>

      {/* 2. Training Days Selector */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3 border border-[hsl(var(--primary))]/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Your Training Schedule</h4>
              <p className="text-[10px] text-slate-500">Select the days you can work out — we'll show matching programs</p>
            </div>
          </div>
          {selectedDays.length > 0 && (
            <button
              onClick={clearDaySelection}
              className="text-[10px] text-slate-500 hover:text-white underline underline-offset-2 transition-colors flex-shrink-0"
            >
              Clear
            </button>
          )}
        </div>

        {/* Day Toggle Buttons */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDays.includes(day)
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={cn(
                  "py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 border",
                  isSelected
                    ? "bg-[hsl(var(--primary))]/15 border-[hsl(var(--primary))]/40 text-[hsl(var(--primary))] shadow-md shadow-[hsl(var(--primary))]/10"
                    : "bg-slate-950/40 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10"
                )}
              >
                {day}
              </button>
            )
          })}
        </div>

        {/* Summary Bar */}
        {selectedDays.length > 0 && (
          <div className="flex items-center justify-between bg-slate-950/40 rounded-xl px-3 sm:px-4 py-2.5 border border-white/5">
            <div className="text-xs text-slate-400">
              <span className="font-bold text-white">{selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''}</span> per week selected
              <span className="text-slate-600 mx-1.5">•</span>
              <span className="text-[10px] hidden sm:inline">{selectedDays.join(", ")}</span>
              <span className="text-[10px] sm:hidden">{selectedDays.join(", ")}</span>
            </div>
            <span className={cn(
              "text-[9px] font-bold px-2 py-0.5 rounded-full border",
              dayFilterMode === "match"
                ? "bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))]"
                : "bg-slate-800/50 border-white/5 text-slate-500"
            )}>
              {dayFilterMode === "match" ? "Filtering Active" : "No Filter"}
            </span>
          </div>
        )}
      </div>

      {/* 3. Success Alert Box */}
      {showSyncSuccess && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-2xl p-3 sm:p-4 flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Routine Activated Successfully!</p>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
              Unified stores synchronized. Switch to the <strong>Workouts</strong> tab to view your updated active set checklist.
            </p>
          </div>
        </div>
      )}

      {/* 4. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search programs by muscle groups or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs bg-slate-950/60 border border-white/5 rounded-2xl text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="flex gap-1.5 p-1 bg-slate-950/60 border border-white/5 rounded-2xl overflow-x-auto">
          {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedGoal(lvl)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                selectedGoal === lvl
                  ? "bg-white/10 text-white font-bold"
                  : "text-slate-500 hover:text-slate-350"
              )}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Program List */}
      <div className="space-y-4">
        {filteredRoutines.length === 0 ? (
          <div className="glass-panel rounded-3xl py-12 text-center">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-xs text-slate-500">No workout splits found matching that search.</p>
          </div>
        ) : (
          filteredRoutines.map((routine) => {
            const styles = getThemeStyles(routine.theme)
            const isExpanded = expandedRoutine === routine.id
            const isActive = activeRoutineId === routine.id
            const isActivating = activatingId === routine.id

            return (
              <div
                key={routine.id}
                className={cn(
                  "glass-panel rounded-3xl overflow-hidden transition-all duration-300 relative border",
                  styles.border,
                  isActive ? "bg-slate-950/50 shadow-lg shadow-black/85" : "bg-slate-950/10"
                )}
              >
                {/* Visual Accent Glow on Hover */}
                <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 hover:opacity-[0.03] pointer-events-none transition-all duration-300", styles.glow)} />

                {/* Card Header summary */}
                <div className="p-4 sm:p-6 relative">
                  <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border", styles.badge)}>
                        {routine.badge}
                      </span>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] flex items-center gap-1">
                        <CalendarDays className="w-2.5 h-2.5" />
                        {getRoutineDayCount(routine)}-Day Program
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                      Level: {routine.level}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">{routine.title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-2 leading-relaxed">{routine.description}</p>

                  {/* Day match indicator */}
                  {dayFilterMode === "match" && (
                    <div className={cn(
                      "mt-3 text-[10px] font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 border",
                      getRoutineDayCount(routine) <= userDayCount
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    )}>
                      <CheckCircle2 className="w-3 h-3" />
                      {getRoutineDayCount(routine) <= userDayCount
                        ? `Fits your ${userDayCount}-day schedule`
                        : `Needs ${getRoutineDayCount(routine)} days (you selected ${userDayCount})`
                      }
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-4">
                    <div className="flex-1 text-[10px] text-slate-500 font-medium">
                      Goal Focus: <span className="text-slate-300 font-semibold">{routine.goal}</span>
                    </div>

                    <button
                      onClick={() => setExpandedRoutine(isExpanded ? null : routine.id)}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors flex-shrink-0"
                    >
                      {isExpanded ? (
                        <>
                          Hide <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          Show <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Splits Panel */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-white/5 bg-slate-950/30 space-y-5 pt-5 animate-in slide-in-from-top duration-300">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-primary" />
                      Detailed 3-Day Exercise Telemetry
                    </h5>

                    {/* Group by Day */}
                    {[1, 2, 3].map((day) => {
                      const dayExercises = routine.exercises.filter((ex) => ex.day === day)
                      if (dayExercises.length === 0) return null

                      return (
                        <div key={day} className="space-y-2 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-white/5">
                            <span>Day {day} Routine</span>
                            <span className={styles.accentText}>{dayExercises.length} Movements Prescribed</span>
                          </div>

                          <div className="space-y-2.5 pt-2">
                            {dayExercises.map((ex, index) => (
                              <div key={index} className="flex justify-between items-start gap-4 text-xs">
                                <div className="flex-1">
                                  <span className="font-bold text-white leading-snug">{ex.name}</span>
                                  {ex.note && (
                                    <p className="text-[10px] text-slate-500 mt-0.5 leading-normal italic font-medium">
                                      Tip: {ex.note}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <span className="font-mono text-slate-350 font-semibold">
                                    {ex.sets}s × {ex.reps}r
                                  </span>
                                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">
                                    {ex.weight || ex.duration || "Bodyweight"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}

                    {/* Activation Button */}
                    <div className="pt-2 border-t border-white/5">
                      <Button
                        onClick={() => handleActivateRoutine(routine)}
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
                            Synchronizing Active Client Plan...
                          </>
                        ) : isActive ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            This Split Is Active Right Now
                          </>
                        ) : (
                          <>
                            <Target className="w-4 h-4 mr-2" />
                            Activate Program & Start Training
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
