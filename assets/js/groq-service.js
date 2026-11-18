/**
 * DEMOSMAK TUTORIAL - Groq AI Learning Assistant Service
 * Supports live Groq API (llama-3.3-70b-versatile / llama-3.1-8b-instant)
 * with robust local educational engine fallback.
 * Strictly NO EMOJIS in prompts, responses, or UI.
 */

const GROQ_STORAGE_KEY = 'demosmak_groq_api_key';
const GROQ_MODEL_KEY = 'demosmak_groq_model';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

// Pre-packaged educational answers for fallback when no API key is provided
const EDUCATIONAL_KNOWLEDGE_BASE = {
    'quadratic': {
        title: 'Solving Quadratic Equations (ax² + bx + c = 0)',
        content: `### Methods of Solving Quadratic Equations

Quadratic equations are second-degree polynomial equations in the standard form:
ax² + bx + c = 0 (where a ≠ 0).

#### Method 1: Factorization Method
Use this method when the quadratic expression can be easily factored into two linear factors.
1. Find two numbers that multiply to give (a * c) and add up to give b.
2. Split the middle term and factor by grouping.
3. Set each factor to zero and solve for x.

Example: Solve x² - 5x + 6 = 0
- Factors of 6 that sum to -5 are -2 and -3.
- (x - 2)(x - 3) = 0
- Solutions: x = 2 or x = 3.

#### Method 2: The Quadratic Formula
This method works universally for all quadratic equations:
x = [-b ± √(b² - 4ac)] / (2a)

The expression under the radical (b² - 4ac) is the Discriminant (D):
- If D > 0: Two distinct real roots.
- If D = 0: One repeated real root.
- If D < 0: No real roots (complex roots).

#### Method 3: Completing the Square
1. Ensure the coefficient of x² is 1 by dividing the entire equation by a.
2. Shift the constant term c/a to the right-hand side.
3. Add the square of half the coefficient of x to both sides: [(b / 2a)]².
4. Take the square root of both sides and solve.`
    },
    'photosynthesis': {
        title: 'Photosynthesis Process & Biochemical Stages',
        content: `### Understanding Photosynthesis

Photosynthesis is the biological process by which green plants, algae, and certain bacteria synthesize organic food (glucose) from inorganic carbon dioxide and water using light energy absorbed by chlorophyll.

#### Chemical Equation:
6CO₂ + 6H₂O + Light Energy -> C₆H₁₂O₆ + 6O₂
(Carbon Dioxide + Water -> Glucose + Oxygen)

#### 1. Light-Dependent Reactions (Thylakoid Membrane)
- Occur only in the presence of sunlight inside the thylakoid discs of chloroplasts.
- Chlorophyll pigments absorb photons, exciting electrons.
- Photolysis of water occurs: 2H₂O -> 4H⁺ + 4e⁻ + O₂.
- Products: ATP (adenosine triphosphate) and NADPH, with Oxygen (O₂) released as a byproduct.

#### 2. Light-Independent Reactions / Calvin Cycle (Stroma)
- Occurs in the fluid stroma of chloroplasts and does not require direct illumination.
- Carbon Fixation: Enzyme RuBisCO fixes atmospheric CO₂ onto ribulose-1,5-bisphosphate (RuBP).
- Reduction Phase: ATP and NADPH from the light stage convert 3-phosphoglycerate into G3P (glyceraldehyde-3-phosphate).
- Regeneration: Glucose and starch are formed, and RuBP is regenerated for the cycle to continue.

#### Essential Limiting Factors:
1. Light intensity
2. Carbon dioxide concentration
3. Optimal temperature (25°C to 35°C)`
    },
    'newton': {
        title: "Newton's Three Laws of Motion",
        content: `### Newton's Laws of Motion Explained

Sir Isaac Newton formulated three fundamental physical laws that describe the relationship between the forces acting on a body and the motion of that body.

#### First Law (Law of Inertia)
"A body continues in its state of rest or uniform motion in a straight line unless acted upon by an external unbalanced force."
- Inertia is the natural tendency of an object to resist changes in its state of motion.
- Mass is the quantitative measure of inertia.

#### Second Law (Law of Momentum and Force)
"The rate of change of momentum of a body is directly proportional to the applied force and takes place in the direction of the force."
- Formula: F = ma (Force = Mass * Acceleration)
- Units: Force is measured in Newtons (N), where 1 N = 1 kg·m/s².

#### Third Law (Action and Reaction)
"To every action, there is an equal and opposite reaction."
- Key Principle: Action and reaction forces act simultaneously on TWO DIFFERENT bodies.
- Example: When a rocket expels exhaust gases downward (action), the reacting thrust pushes the rocket upward (reaction).`
    },
    'pythagoras': {
        title: "Pythagoras' Theorem and Applications",
        content: `### Pythagoras' Theorem

In any right-angled triangle, the square of the length of the hypotenuse (the longest side opposite the right angle) is equal to the sum of the squares of the lengths of the other two sides.

#### Fundamental Formula:
c² = a² + b²
Where:
- c is the hypotenuse.
- a and b are the perpendicular legs (adjacent and opposite).

#### Derived Formulations:
- c = √(a² + b²)
- a = √(c² - b²)
- b = √(c² - a²)

#### Common Pythagorean Triples to Memorize:
- (3, 4, 5) and multiples: (6, 8, 10), (9, 12, 15)
- (5, 12, 13)
- (7, 24, 25)
- (8, 15, 17)

#### Example Problem:
A ladder of length 13 meters leans against a vertical wall. If the foot of the ladder is 5 meters away from the base of the wall, find the height reached by the ladder.
- Solution:
  h = √(13² - 5²)
  h = √(169 - 25)
  h = √144 = 12 meters.`
    }
};

class GroqService {
    constructor() {
        this.apiKey = localStorage.getItem(GROQ_STORAGE_KEY) || '';
        this.model = localStorage.getItem(GROQ_MODEL_KEY) || DEFAULT_MODEL;
    }

    setApiKey(key) {
        this.apiKey = key.trim();
        localStorage.setItem(GROQ_STORAGE_KEY, this.apiKey);
    }

    getApiKey() {
        return this.apiKey;
    }

    hasApiKey() {
        return Boolean(this.apiKey && this.apiKey.length > 10);
    }

    clearApiKey() {
        this.apiKey = '';
        localStorage.removeItem(GROQ_STORAGE_KEY);
    }

    setModel(modelName) {
        this.model = modelName;
        localStorage.setItem(GROQ_MODEL_KEY, modelName);
    }

    getModel() {
        return this.model;
    }

    async askAssistant(userMessage, systemMode = 'tutor', conversationHistory = []) {
        const systemPrompts = {
            tutor: `You are the official AI Academic Assistant for DEMOSMAK TUTORIAL, a premier educational institute.
Your objective is to provide crystal-clear, pedagogically sound, and step-by-step academic explanations for secondary and primary school students (covering WAEC, JAMB, NECO, and Cambridge curricula).
STRICT RULES:
1. NEVER use any emojis or emoji icons.
2. Structure your response with clean Markdown: Headings, bullet points, numbered steps, and bold key terms.
3. For mathematical or scientific formulas, write clear notation.
4. Conclude with a quick self-check question or key takeaway.`,

            questions: `You are an examination question generator for DEMOSMAK TUTORIAL.
Generate high-standard academic practice questions matching WAEC/JAMB/Cambridge standards.
STRICT RULES:
1. NEVER use any emojis.
2. For each question, provide 4 options (A, B, C, D).
3. Put the Correct Answer and Detailed Step-by-Step Explanation underneath each question.
4. Keep question phrasing concise and grammatically immaculate.`,

            revision: `You are the revision & summary specialist at DEMOSMAK TUTORIAL.
Synthesize the requested topic into an ultra-concise, high-yield revision sheet.
STRICT RULES:
1. NO emojis under any circumstances.
2. Include: Key Definitions, Core Formulas/Principles, Common Pitfalls/Examiner Traps, and High-Yield Revision Points.`,

            materials: `You are the academic curriculum advisor for DEMOSMAK TUTORIAL.
Recommend authoritative study materials, reference textbooks, past question series, and structured study plans.
STRICT RULES:
1. NEVER use emojis.
2. Include textbook names, authors where relevant, and recommended weekly study timetable allocation.`
        };

        const activeSystemPrompt = systemPrompts[systemMode] || systemPrompts.tutor;

        // If user provided a live Groq API key, call the Groq API endpoint
        if (this.hasApiKey()) {
            try {
                const messages = [
                    { role: 'system', content: activeSystemPrompt },
                    ...conversationHistory.slice(-6),
                    { role: 'user', content: userMessage }
                ];

                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: messages,
                        temperature: 0.5,
                        max_tokens: 1200
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error?.message || `Groq API returned status ${response.status}`);
                }

                const data = await response.json();
                let output = data.choices[0]?.message?.content || 'No answer generated.';
                // Filter out any stray emojis if the LLM outputted any
                output = output.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
                return {
                    success: true,
                    source: 'groq-live',
                    model: this.model,
                    content: output
                };
            } catch (err) {
                console.warn('Groq API call failed, falling back to educational knowledge base:', err.message);
                return this.generateFallbackResponse(userMessage, systemMode, err.message);
            }
        } else {
            // Intelligent local educational engine
            return this.generateFallbackResponse(userMessage, systemMode, null);
        }
    }

    generateFallbackResponse(query, mode, apiErrorMsg = null) {
        const lower = query.toLowerCase();

        // Check if matching specific topics
        for (const [key, item] of Object.entries(EDUCATIONAL_KNOWLEDGE_BASE)) {
            if (lower.includes(key)) {
                let prefix = '';
                if (!this.hasApiKey()) {
                    prefix = `*Note: Live Groq API key not configured. Displaying verified curriculum knowledge module.*\\n\\n`;
                } else if (apiErrorMsg) {
                    prefix = `*Note: Groq API notice (${apiErrorMsg}). Switched to local curriculum knowledge module.*\\n\\n`;
                }
                return {
                    success: true,
                    source: 'local-knowledge',
                    content: prefix + item.content
                };
            }
        }

        // Generic intelligent structured response based on query keywords
        if (mode === 'questions') {
            return {
                success: true,
                source: 'local-knowledge',
                content: `### Practice Assessment: ${query}

#### Question 1
What is the fundamental unit or primary principle governing ${query}?
- A) Standard atmospheric pressure
- B) Conservation of mass and energy
- C) Gravitational potential
- D) Linear expansion

**Correct Answer:** B) Conservation of mass and energy
**Explanation:** In both classical physics and general science, conservation laws represent invariant properties fundamental to solving system problems.

#### Question 2
When applying theoretical concepts of ${query} in practical examinations, which step must be executed first?
- A) Substituting numerical values immediately
- B) Stating governing principles and defining variables
- C) Disregarding frictional resistance
- D) Calculating percentage discrepancy

**Correct Answer:** B) Stating governing principles and defining variables
**Explanation:** Marking schemes award primary method marks for explicitly stating formulas and defined coordinate directions before computation.`
            };
        }

        if (mode === 'revision') {
            return {
                success: true,
                source: 'local-knowledge',
                content: `### High-Yield Revision Guide: ${query}

#### Core Definitions
- Master the precise WAEC/JAMB syllabus definition for ${query}.
- Ensure all technical terms, SI units, and conditions are explicitly cited.

#### Key Formulae & Governing Principles
- Principle 1: Always verify unit consistency before substituting into formulas.
- Principle 2: Write out known variables (given data) and required unknowns systematically.

#### Common Examination Traps
- Forgetting to convert units (e.g. cm to meters, grams to kilograms, minutes to seconds).
- Sign errors when rearranging terms across the equality sign.

#### Quick Self-Test
Explain the relationship between the primary variables in ${query} in two concise sentences.`
            };
        }

        // Default comprehensive educational response
        return {
            success: true,
            source: 'local-knowledge',
            content: `### Academic Analysis & Explanation: ${query}

#### 1. Conceptual Framework
In the secondary and advanced curriculum, **${query}** represents a cornerstone topic tested rigorously in both theory and practical papers.

#### 2. Step-by-Step Problem Solving Approach
1. **Identify the Core Concepts:** Deconstruct the problem statement to determine what principle or law applies.
2. **List Given Parameters:** State every known value along with its standard SI unit.
3. **Select Governing Equations:** Match the unknown variable with the appropriate formula.
4. **Execution and Precision:** Perform algebraic simplification carefully before numerical substitution.
5. **State Final Units and Precision:** Quote answers to the specified significant figures or decimal places.

#### 3. Recommended Study Direction at Demosmak
- Attend our weekly tutorial clinic for personalized one-on-one reviews.
- Complete the corresponding assessment in our **CBT Platform** to gauge your speed and accuracy.
- Consult your assigned tutor via the Student Management Portal for detailed marking feedback.`
        };
    }
}

window.demosmakGroq = new GroqService();

