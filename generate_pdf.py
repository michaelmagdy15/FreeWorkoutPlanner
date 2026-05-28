from fpdf import FPDF
import datetime

class WorkoutPDF(FPDF):
    def header(self):
        # Draw a sleek top accent line
        self.set_fill_color(255, 94, 58) # Coral Primary
        self.rect(0, 0, 210, 4, 'F')
        
        self.set_font('Helvetica', 'B', 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, "MIRNA'S PLATEAU-BREAKER WORKOUT PLAN", 0, 0, 'L')
        self.cell(0, 10, "PHASE 1 SPLIT", 0, 1, 'R')
        self.ln(2)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", 0, 0, 'C')
        
        # Bottom decorative violet accent dot
        self.set_fill_color(138, 43, 226) # Electric Violet
        self.circle(105, 292, 1.5, 'F')

def create_workout_pdf():
    pdf = WorkoutPDF(orientation='P', unit='mm', format='A4')
    pdf.alias_nb_pages()
    
    # --------------------------------------------------------------------------
    # PAGE 1: TITLE & CORE GUIDELINES
    # --------------------------------------------------------------------------
    pdf.add_page()
    
    # Main Header
    pdf.ln(10)
    pdf.set_font('Helvetica', 'B', 24)
    pdf.set_text_color(30, 30, 35) # Obsidian Black
    pdf.cell(0, 10, "The Plateau-Breaker Split", 0, 1, 'L')
    
    pdf.set_font('Helvetica', '', 12)
    pdf.set_text_color(255, 94, 58) # Neon Coral
    pdf.cell(0, 8, "PREMIUM PERSONALIZED TRAINING PROGRAM FOR MIRNA", 0, 1, 'L')
    
    # Subtle Divider
    pdf.ln(4)
    pdf.set_draw_color(230, 230, 235)
    pdf.set_line_width(0.5)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)
    
    # Welcome message
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(80, 80, 85)
    intro_txt = (
        "Welcome to your elite training portal handout, Mirna. This program is scientifically "
        "calibrated to move away from rigid machine tracks, build structural leg and upper-body strength, "
        "and maximize mechanical tension. Stick to the phase rules below to break through plateaus."
    )
    pdf.multi_cell(0, 5, intro_txt)
    pdf.ln(8)
    
    # Guidelines Section Header
    pdf.set_font('Helvetica', 'B', 14)
    pdf.set_text_color(30, 30, 35)
    pdf.cell(0, 8, "Core Phase Rules & Guidelines", 0, 1, 'L')
    pdf.ln(2)
    
    # Rule 1 Card
    pdf.set_fill_color(248, 248, 250)
    pdf.rect(10, pdf.get_y(), 190, 26, 'F')
    # Draw left border line in Coral
    pdf.set_draw_color(255, 94, 58)
    pdf.set_line_width(1)
    pdf.line(10, pdf.get_y(), 10, pdf.get_y() + 26)
    
    pdf.set_xy(14, pdf.get_y() + 2)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(255, 94, 58)
    pdf.cell(0, 5, "1. PROGRESSIVE OVERLOAD RULE", 0, 1, 'L')
    pdf.set_x(14)
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(80, 80, 85)
    rule1_text = (
        "If the target rep range is 8-12, select a weight where you struggle at rep 10. "
        "Once you can perform 12 reps with perfect, controlled form, increase the weight "
        "slightly (e.g. 2.5 to 5 lbs) in your following workout."
    )
    pdf.multi_cell(182, 4.5, rule1_text)
    pdf.set_y(pdf.get_y() + 6)
    
    # Rule 2 Card
    pdf.set_fill_color(248, 248, 250)
    pdf.rect(10, pdf.get_y(), 190, 26, 'F')
    # Draw left border line in Violet
    pdf.set_draw_color(138, 43, 226)
    pdf.set_line_width(1)
    pdf.line(10, pdf.get_y(), 10, pdf.get_y() + 26)
    
    pdf.set_xy(14, pdf.get_y() + 2)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(138, 43, 226)
    pdf.cell(0, 5, "2. TEMPO CADENCE RULE (3-0-1)", 0, 1, 'L')
    pdf.set_x(14)
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(80, 80, 85)
    rule2_text = (
        "Lower the weight slowly for 3 seconds (eccentric phase), make no pause at the bottom "
        "(0 seconds), and immediately explode upward on the lifting phase for 1 second "
        "(concentric phase). This eliminates momentum."
    )
    pdf.multi_cell(182, 4.5, rule2_text)
    pdf.set_y(pdf.get_y() + 6)
    
    # Rule 3 Card
    pdf.set_fill_color(248, 248, 250)
    pdf.rect(10, pdf.get_y(), 190, 22, 'F')
    # Draw left border line in Coral
    pdf.set_draw_color(255, 94, 58)
    pdf.set_line_width(1)
    pdf.line(10, pdf.get_y(), 10, pdf.get_y() + 22)
    
    pdf.set_xy(14, pdf.get_y() + 2)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(255, 94, 58)
    pdf.cell(0, 5, "3. OPTIMAL REST INTERVALS", 0, 1, 'L')
    pdf.set_x(14)
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(80, 80, 85)
    rule3_text = (
        "Rest for 60 to 90 seconds between sets to allow your nervous system and ATP reserves "
        "to recover sufficiently to push heavy weights again."
    )
    pdf.multi_cell(182, 4.5, rule3_text)
    
    # --------------------------------------------------------------------------
    # PAGE 2: DAY 1 - LOWER BODY
    # --------------------------------------------------------------------------
    pdf.add_page()
    pdf.ln(5)
    
    # Day Header
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(30, 30, 35)
    pdf.cell(0, 8, "DAY 1: Lower Body (Glute & Hamstring Emphasis)", 0, 1, 'L')
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(255, 94, 58)
    pdf.cell(0, 6, "Focus: Structural Strength & Posterior Chain Growth", 0, 1, 'L')
    
    # Active Warm-up
    pdf.ln(2)
    pdf.set_fill_color(253, 244, 242)
    pdf.set_draw_color(255, 200, 190)
    pdf.set_line_width(0.3)
    pdf.rect(10, pdf.get_y(), 190, 14, 'DF')
    pdf.set_xy(14, pdf.get_y() + 2)
    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_text_color(255, 94, 58)
    pdf.cell(0, 4, "ACTIVE WARM-UP:", 0, 1, 'L')
    pdf.set_x(14)
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(80, 80, 85)
    pdf.cell(0, 4, "5 Mins cycling + Dynamic Leg Swings & Bodyweight Good Mornings (1 Set x 15 Reps).", 0, 1, 'L')
    pdf.ln(6)
    
    # Day 1 Exercises
    exercises_d1 = [
      {
        "name": "1. Dumbbell Romanian Deadlifts (RDLs)",
        "target": "Posterior Chain",
        "sets_reps": "4 Sets x 8-10 Reps",
        "note": "Push your hips straight back as if trying to touch a wall behind you. Keep the dumbbells scraping down your shins. Stop lowering immediately when your hips stop moving back. Squeeze your glutes to stand upright."
      },
      {
        "name": "2. Bulgarian Split Squats",
        "target": "Glute Dominant",
        "sets_reps": "3 Sets x 8-10 Reps (Each Leg)",
        "note": "Place your back foot on a bench behind you. Take a slight forward lean with your torso to shift the entire training load onto your working front glute. Control the descent down to deep depth, and drive back up through the front heel."
      },
      {
        "name": "3. Leg Press (High & Wide Foot Placement)",
        "target": "Hamstrings & Glutes",
        "sets_reps": "3 Sets x 10-12 Reps",
        "note": "Place your feet high and wide on the sled platform. This specific foot placement shifts the focus completely away from the quadriceps and directs the load straight onto the hamstrings and glutes. Drive out through your heels."
      },
      {
        "name": "4. Lying Hamstring Curls",
        "target": "Hamstrings",
        "sets_reps": "3 Sets x 10-12 Reps (Drop-Set Last Set)",
        "note": "Lie flat and keep your hips pushed firmly down against the pad throughout the exercise. Curl the pad upward and control the eccentric lowering. On the very last set, immediately drop the weight by 30% and perform reps until failure."
      },
      {
        "name": "5. Core Activation Circuit",
        "target": "Core Activation",
        "sets_reps": "3 Rounds (Plank & Knee Raises)",
        "note": "A. Plank: 3 Sets x 60 Seconds. Keep your body in a straight line, squeezing your core and glutes. B. Hanging Knee Raises: 3 Sets x 12 Reps. Hang from a bar and raise your knees to your chest, controlling the drop without swinging."
      }
    ]
    
    for ex in exercises_d1:
        pdf.set_fill_color(248, 248, 250)
        
        # Dynamic height calculation
        start_y = pdf.get_y()
        pdf.rect(10, start_y, 190, 24, 'F')
        
        pdf.set_draw_color(255, 94, 58)
        pdf.set_line_width(0.8)
        pdf.line(10, start_y, 10, start_y + 24)
        
        pdf.set_xy(14, start_y + 2)
        pdf.set_font('Helvetica', 'B', 10)
        pdf.set_text_color(30, 30, 35)
        pdf.cell(120, 5, ex["name"], 0, 0, 'L')
        
        pdf.set_font('Helvetica', 'B', 8.5)
        pdf.set_text_color(138, 43, 226) # Violet
        pdf.cell(58, 5, ex["sets_reps"], 0, 1, 'R')
        
        pdf.set_x(14)
        pdf.set_font('Helvetica', 'I', 8)
        pdf.set_text_color(120, 120, 120)
        pdf.cell(0, 4, f"Target: {ex['target']}", 0, 1, 'L')
        
        pdf.set_x(14)
        pdf.set_font('Helvetica', '', 8.5)
        pdf.set_text_color(80, 80, 85)
        pdf.multi_cell(182, 4, ex["note"])
        
        pdf.set_y(start_y + 28)
        
    # --------------------------------------------------------------------------
    # PAGE 3: DAY 2 - UPPER BODY
    # --------------------------------------------------------------------------
    pdf.add_page()
    pdf.ln(5)
    
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(30, 30, 35)
    pdf.cell(0, 8, "DAY 2: Upper Body (Hourglass & Posture Focus)", 0, 1, 'L')
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(138, 43, 226) # Violet Accent
    pdf.cell(0, 6, "Focus: Scapular Retraction & Shoulder Definition", 0, 1, 'L')
    
    # Active Warm-up
    pdf.ln(2)
    pdf.set_fill_color(245, 240, 252)
    pdf.set_draw_color(218, 198, 244)
    pdf.set_line_width(0.3)
    pdf.rect(10, pdf.get_y(), 190, 14, 'DF')
    pdf.set_xy(14, pdf.get_y() + 2)
    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_text_color(138, 43, 226)
    pdf.cell(0, 4, "ACTIVE WARM-UP:", 0, 1, 'L')
    pdf.set_x(14)
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(80, 80, 85)
    pdf.cell(0, 4, "5 Mins Dynamic Arm Swings, Band Pull-Aparts, & Shoulder Circles (1 Set x 15 Reps).", 0, 1, 'L')
    pdf.ln(6)
    
    exercises_d2 = [
      {
        "name": "1. Seated Dumbbell Shoulder Press",
        "target": "Shoulders (Deltoids)",
        "sets_reps": "3 Sets x 8-10 Reps",
        "note": "Press the dumbbells straight upward over your head while keeping your core actively engaged and back flat against the bench. Lower the weights slowly and under control to ear height."
      },
      {
        "name": "2. Lat Pulldowns",
        "target": "Upper Back (Lats)",
        "sets_reps": "3 Sets x 10-12 Reps",
        "note": "Pull the bar down toward your upper chest by driving your elbows down. Focus on pulling from your back rather than your biceps, and squeeze your shoulder blades together at the bottom."
      },
      {
        "name": "3. Incline Dumbbell Chest Press",
        "target": "Upper Chest & Shoulders",
        "sets_reps": "3 Sets x 10 Reps",
        "note": "Set the workout bench to a 30-degree incline. Press dumbbells straight up. This variation is much better for upper-body shoulder stability and chest activation than standard flat benches."
      },
      {
        "name": "4. Dumbbell Lateral Raises (Lean-Away or Seated)",
        "target": "Lateral Delts",
        "sets_reps": "4 Sets x 12-15 Reps",
        "note": "Think about pushing the dumbbells out to the walls, not just up. Keep your pinkies slightly higher than your thumbs at the peak contract position to maximize side deltoid recruitment."
      },
      {
        "name": "5. Cable Face Pulls (with Rope)",
        "target": "Rear Delts & Posture",
        "sets_reps": "3 Sets x 12-15 Reps",
        "note": "Pull the rope directly toward your nose/forehead and actively separate your hands at the end. Great for shoulder joint health, scapular retraction, and posture control."
      },
      {
        "name": "6. Obliques Activation (Side Planks)",
        "target": "Obliques & Core",
        "sets_reps": "3 Sets x 45 Seconds (Each Side)",
        "note": "Side Planks hold. Rest on your elbow, raise your hips, and squeeze your oblique muscles. Keep body in a completely straight alignment dynamically."
      }
    ]
    
    for ex in exercises_d2:
        pdf.set_fill_color(248, 248, 250)
        
        start_y = pdf.get_y()
        pdf.rect(10, start_y, 190, 24, 'F')
        
        pdf.set_draw_color(138, 43, 226) # Violet
        pdf.set_line_width(0.8)
        pdf.line(10, start_y, 10, start_y + 24)
        
        pdf.set_xy(14, start_y + 2)
        pdf.set_font('Helvetica', 'B', 10)
        pdf.set_text_color(30, 30, 35)
        pdf.cell(120, 5, ex["name"], 0, 0, 'L')
        
        pdf.set_font('Helvetica', 'B', 8.5)
        pdf.set_text_color(255, 94, 58) # Coral
        pdf.cell(58, 5, ex["sets_reps"], 0, 1, 'R')
        
        pdf.set_x(14)
        pdf.set_font('Helvetica', 'I', 8)
        pdf.set_text_color(120, 120, 120)
        pdf.cell(0, 4, f"Target: {ex['target']}", 0, 1, 'L')
        
        pdf.set_x(14)
        pdf.set_font('Helvetica', '', 8.5)
        pdf.set_text_color(80, 80, 85)
        pdf.multi_cell(182, 4, ex["note"])
        
        pdf.set_y(start_y + 28)

    # --------------------------------------------------------------------------
    # PAGE 4: DAY 3 - FULL BODY
    # --------------------------------------------------------------------------
    pdf.add_page()
    pdf.ln(5)
    
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(30, 30, 35)
    pdf.cell(0, 8, "DAY 3: Full Body (Posterior Chain & Conditioning)", 0, 1, 'L')
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(255, 94, 58)
    pdf.cell(0, 6, "Focus: Squeezed Hips, Strong Pulled Rows, & Aerobic Energy", 0, 1, 'L')
    
    # Active Warm-up
    pdf.ln(2)
    pdf.set_fill_color(253, 244, 242)
    pdf.set_draw_color(255, 200, 190)
    pdf.set_line_width(0.3)
    pdf.rect(10, pdf.get_y(), 190, 14, 'DF')
    pdf.set_xy(14, pdf.get_y() + 2)
    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_text_color(255, 94, 58)
    pdf.cell(0, 4, "ACTIVE WARM-UP:", 0, 1, 'L')
    pdf.set_x(14)
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(80, 80, 85)
    pdf.cell(0, 4, "5 Mins Treadmill walk + Dynamic stretching exercises.", 0, 1, 'L')
    pdf.ln(6)
    
    exercises_d3 = [
      {
        "name": "1. Barbell Hip Thrusts",
        "target": "Glute Dominant",
        "sets_reps": "4 Sets x 8-10 Reps",
        "note": "Hold the squeeze for 2 seconds at the top of every rep. Keep your chin tucked forward looking at the wall in front of you throughout the entire movement. Do not arch your lower back."
      },
      {
        "name": "2. Dumbbell Goblet Squats",
        "target": "Quads & Glutes",
        "sets_reps": "3 Sets x 10-12 Reps",
        "note": "Hold a single heavy dumbbell vertically at your chest. Drop as deep as your hip mobility allows while keeping your chest upright and core braced."
      },
      {
        "name": "3. Seated Cable Rows",
        "target": "Mid-Back & Lats",
        "sets_reps": "3 Sets x 10-12 Reps",
        "note": "Pull the attachment toward your lower stomach, squeezing your shoulder blades together. Control the eccentric extension back to standard arm stretch."
      },
      {
        "name": "4. Hammer Curls Super-set with Overhead Triceps Extensions",
        "target": "Biceps & Triceps",
        "sets_reps": "3 Sets x 12 Reps Each (Super-Set)",
        "note": "A. Dumbbell Hammer Curls: Curls with palms facing each other. B. Overhead Triceps Extensions: Hinge elbows to lower dumbbell behind head. Perform back-to-back with no rest."
      },
      {
        "name": "5. Finisher: Cardio Conditioning",
        "target": "Conditioning & Metabolism",
        "sets_reps": "15-20 Mins (Steady Pace)",
        "note": "Complete 15 to 20 minutes on the Stairmaster or Incline Treadmill at a steady, challenging conditioning pace. Keep your breathing deep."
      }
    ]
    
    for ex in exercises_d3:
        pdf.set_fill_color(248, 248, 250)
        
        start_y = pdf.get_y()
        pdf.rect(10, start_y, 190, 24, 'F')
        
        pdf.set_draw_color(255, 94, 58) # Coral
        pdf.set_line_width(0.8)
        pdf.line(10, start_y, 10, start_y + 24)
        
        pdf.set_xy(14, start_y + 2)
        pdf.set_font('Helvetica', 'B', 10)
        pdf.set_text_color(30, 30, 35)
        pdf.cell(120, 5, ex["name"], 0, 0, 'L')
        
        pdf.set_font('Helvetica', 'B', 8.5)
        pdf.set_text_color(138, 43, 226) # Violet
        pdf.cell(58, 5, ex["sets_reps"], 0, 1, 'R')
        
        pdf.set_x(14)
        pdf.set_font('Helvetica', 'I', 8)
        pdf.set_text_color(120, 120, 120)
        pdf.cell(0, 4, f"Target: {ex['target']}", 0, 1, 'L')
        
        pdf.set_x(14)
        pdf.set_font('Helvetica', '', 8.5)
        pdf.set_text_color(80, 80, 85)
        pdf.multi_cell(182, 4, ex["note"])
        
        pdf.set_y(start_y + 28)
        
    pdf.output("mirna_workout_plan.pdf")
    print("PDF Generation complete.")

if __name__ == "__main__":
    create_workout_pdf()
