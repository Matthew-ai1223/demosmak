/**
 * DEMOSMAK TUTORIAL - Central Database & State Management
 * Persistent mock data store using localStorage
 * Strictly professional - No emojis
 */

const STORAGE_KEY_PREFIX = 'demosmak_';

// Initial Seed Data
const DEFAULT_STUDENTS = [
    {
        id: 'DT-2026-001',
        fullName: 'Chidinma Okafor',
        email: 'chidinma.okafor@example.com',
        phone: '+234 803 123 4567',
        grade: 'SSS 3',
        department: 'Science',
        parentName: 'Chief Emmanuel Okafor',
        parentPhone: '+234 802 987 6543',
        parentEmail: 'e.okafor@example.com',
        enrollmentDate: '2026-01-10',
        avatarInitial: 'CO',
        status: 'Active',
        subjects: ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology'],
        assignedTutors: [
            { subject: 'Mathematics & Physics', tutorName: 'Dr. Michael Adeyemi' },
            { subject: 'Chemistry', tutorName: 'Mrs. Folake Balogun' },
            { subject: 'English Language', tutorName: 'Mr. Jude Okon' }
        ],
        attendance: {
            overallRate: 94,
            presentDays: 47,
            totalDays: 50,
            recentLogs: [
                { date: '2026-11-17', status: 'Present', subject: 'Physics Practical' },
                { date: '2026-11-16', status: 'Present', subject: 'Mathematics' },
                { date: '2026-11-15', status: 'Present', subject: 'Chemistry' },
                { date: '2026-11-14', status: 'Excused', subject: 'Biology Lab' },
                { date: '2026-11-13', status: 'Present', subject: 'English Language' }
            ]
        },
        financials: {
            termFee: 65000,
            amountPaid: 45000,
            outstandingBalance: 20000,
            paymentStatus: 'Partial',
            history: [
                {
                    ref: 'PSTK-DEMO-982341',
                    date: '2026-09-15',
                    description: 'First Term Initial Deposit',
                    amount: 45000,
                    status: 'Verified',
                    channel: 'Paystack Card'
                }
            ]
        },
        academicReport: {
            gpa: '4.85 / 5.0',
            averageScore: 88.4,
            termStanding: '1st in Class',
            scores: [
                { subject: 'Mathematics', score: 92, grade: 'A1', remark: 'Excellent mastery' },
                { subject: 'English Language', score: 85, grade: 'B2', remark: 'Strong comprehension' },
                { subject: 'Physics', score: 89, grade: 'A1', remark: 'Analytical excellence' },
                { subject: 'Chemistry', score: 91, grade: 'A1', remark: 'Superb lab accuracy' },
                { subject: 'Biology', score: 85, grade: 'B2', remark: 'Good memorization' }
            ]
        },
        tutorFeedback: [
            {
                date: '2026-11-12',
                tutor: 'Dr. Michael Adeyemi',
                subject: 'Physics',
                note: 'Chidinma demonstrated outstanding aptitude during the rotational motion workshop. Ready for advanced JAMB/UTME problem sets.'
            },
            {
                date: '2026-11-05',
                tutor: 'Mrs. Folake Balogun',
                subject: 'Chemistry',
                note: 'Remarkable progress in organic reactions nomenclature. Recommended for mock Olympiad selection.'
            }
        ]
    },
    {
        id: 'DT-2026-002',
        fullName: 'David Adeleke',
        email: 'david.adeleke@example.com',
        phone: '+234 812 456 7890',
        grade: 'JSS 2',
        department: 'Junior Secondary',
        parentName: 'Mrs. Grace Adeleke',
        parentPhone: '+234 813 555 1212',
        parentEmail: 'grace.adeleke@example.com',
        enrollmentDate: '2026-02-01',
        avatarInitial: 'DA',
        status: 'Active',
        subjects: ['Mathematics', 'English Language', 'Basic Science', 'Basic Technology', 'Civic Education'],
        assignedTutors: [
            { subject: 'Mathematics & Basic Science', tutorName: 'Mr. Emmanuel Nwosu' },
            { subject: 'English Language', tutorName: 'Mr. Jude Okon' }
        ],
        attendance: {
            overallRate: 90,
            presentDays: 45,
            totalDays: 50,
            recentLogs: [
                { date: '2026-11-17', status: 'Present', subject: 'Basic Science' },
                { date: '2026-11-16', status: 'Present', subject: 'Mathematics' },
                { date: '2026-11-15', status: 'Absent', subject: 'Basic Technology' },
                { date: '2026-11-14', status: 'Present', subject: 'English Language' }
            ]
        },
        financials: {
            termFee: 50000,
            amountPaid: 50000,
            outstandingBalance: 0,
            paymentStatus: 'Paid',
            history: [
                {
                    ref: 'PSTK-DEMO-871120',
                    date: '2026-09-10',
                    description: 'Term 1 Full Payment',
                    amount: 50000,
                    status: 'Verified',
                    channel: 'Paystack Transfer'
                }
            ]
        },
        academicReport: {
            gpa: '4.20 / 5.0',
            averageScore: 82.0,
            termStanding: '4th in Class',
            scores: [
                { subject: 'Mathematics', score: 84, grade: 'A', remark: 'Solid calculation skills' },
                { subject: 'English Language', score: 80, grade: 'B', remark: 'Good vocabulary development' },
                { subject: 'Basic Science', score: 86, grade: 'A', remark: 'Active participation' },
                { subject: 'Basic Technology', score: 78, grade: 'B', remark: 'Improving technical drawing' }
            ]
        },
        tutorFeedback: [
            {
                date: '2026-11-10',
                tutor: 'Mr. Emmanuel Nwosu',
                subject: 'Basic Science',
                note: 'David grasps living systems concepts quickly. Keep encouraging daily practice in algebraic fractions.'
            }
        ]
    }
];

const DEFAULT_PROGRAMMES = [
    {
        id: 'prog-jss',
        title: 'Junior Secondary Foundation (JSS 1 - 3)',
        category: 'junior',
        levelBadge: 'Foundational',
        duration: 'Academic Term / Year',
        description: 'Core JSS subjects with BECE-focused drills.',
        subjects: ['Mathematics', 'English Language', 'Basic Science', 'Basic Technology', 'Civic Education'],
        schedule: 'Monday to Thursday (4:00 PM - 6:30 PM)',
        fee: 50000
    },
    {
        id: 'prog-sss-science',
        title: 'Senior Secondary Science Mastery (SSS 1 - 3)',
        category: 'senior',
        levelBadge: 'Intermediate & Advanced',
        duration: 'Academic Term / Year',
        description: 'STEM coaching for WAEC, NECO, and Cambridge.',
        subjects: ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Further Mathematics'],
        schedule: 'Monday to Friday (4:00 PM - 7:00 PM)',
        fee: 65000
    },
    {
        id: 'prog-sss-arts-comm',
        title: 'Senior Secondary Arts & Commercial (SSS 1 - 3)',
        category: 'senior',
        levelBadge: 'Senior Secondary',
        duration: 'Academic Term / Year',
        description: 'Arts and commercial subjects for top WAEC grades.',
        subjects: ['English Language', 'Mathematics', 'Economics', 'Government', 'Literature in English', 'Commerce'],
        schedule: 'Monday to Friday (4:00 PM - 7:00 PM)',
        fee: 60000
    },
    {
        id: 'prog-jamb-waec',
        title: 'Intensive JAMB / UTME & WAEC Crash Programme',
        category: 'exam-prep',
        levelBadge: 'Intensive Prep',
        duration: '12 Weeks Accelerated',
        description: 'Past questions, speed tactics, and weekly CBT mocks.',
        subjects: ['UTME 4 Subject Combinations', 'WAEC 9 Subject Coaching', 'Weekly CBT Mock Drills'],
        schedule: 'Weekend & Evening Cohorts Available',
        fee: 45000
    },
    {
        id: 'prog-primary',
        title: 'Primary Academic Acceleration (Primary 4 - 6)',
        category: 'primary',
        levelBadge: 'Primary',
        duration: 'Term / Holiday Lessons',
        description: 'Numeracy and literacy for secondary school entrance.',
        subjects: ['Quantitative Reasoning', 'Verbal Reasoning', 'General Mathematics', 'English Studies'],
        schedule: 'Monday to Wednesday (3:30 PM - 5:30 PM)',
        fee: 40000
    }
];

const DEFAULT_CBT_TESTS = [
    {
        id: 'cbt-math-01',
        title: 'Mathematics Comprehensive Mock Test',
        subject: 'Mathematics',
        category: 'Senior Secondary / JAMB',
        durationMinutes: 15,
        totalQuestions: 10,
        instructions: 'Answer all 10 questions. Calculators are simulated. Click Submit when finished.',
        questions: [
            {
                id: 1,
                question: 'Solve for x in the quadratic equation: 2x² - 5x - 3 = 0',
                options: [
                    'A) x = 3 or x = -1/2',
                    'B) x = -3 or x = 1/2',
                    'C) x = 2 or x = -3',
                    'D) x = 5 or x = -1'
                ],
                correctAnswer: 0,
                explanation: 'Factoring 2x² - 5x - 3: (2x + 1)(x - 3) = 0. Therefore, 2x + 1 = 0 => x = -1/2, or x - 3 = 0 => x = 3.'
            },
            {
                id: 2,
                question: 'If log₁₀(x) + log₁₀(x - 3) = 1, find the valid value of x.',
                options: [
                    'A) x = 2',
                    'B) x = 5',
                    'C) x = -2',
                    'D) x = 10'
                ],
                correctAnswer: 1,
                explanation: 'By log laws: log₁₀(x(x - 3)) = 1 => x² - 3x = 10 => x² - 3x - 10 = 0 => (x - 5)(x + 2) = 0. Since log argument must be positive, x = 5.'
            },
            {
                id: 3,
                question: 'Find the derivative of f(x) = 3x⁴ - 5x² + 7 with respect to x.',
                options: [
                    'A) 12x³ - 10x',
                    'B) 12x³ - 5x + 7',
                    'C) 7x³ - 10x',
                    'D) 12x⁴ - 10x²'
                ],
                correctAnswer: 0,
                explanation: 'Using power rule d/dx[a*x^n] = n*a*x^(n-1): d/dx(3x⁴) = 12x³, d/dx(-5x²) = -10x, d/dx(7) = 0.'
            },
            {
                id: 4,
                question: 'The third term of a Geometric Progression (G.P.) is 12 and the sixth term is 96. What is the common ratio (r)?',
                options: [
                    'A) 4',
                    'B) 3',
                    'C) 2',
                    'D) 1.5'
                ],
                correctAnswer: 2,
                explanation: 'T₃ = ar² = 12 and T₆ = ar⁵ = 96. Dividing: ar⁵ / ar² = 96 / 12 => r³ = 8 => r = 2.'
            },
            {
                id: 5,
                question: 'Evaluate the limit as x approaches 0 of sin(3x) / x.',
                options: [
                    'A) 0',
                    'B) 1',
                    'C) 3',
                    'D) Undefined'
                ],
                correctAnswer: 2,
                explanation: 'Using standard trigonometric limit rule lim(x->0) [sin(kx)/x] = k. Here k = 3, so limit equals 3.'
            },
            {
                id: 6,
                question: 'A bag contains 5 red balls, 4 blue balls, and 3 green balls. One ball is drawn at random. What is the probability of selecting a blue ball?',
                options: [
                    'A) 1/4',
                    'B) 1/3',
                    'C) 5/12',
                    'D) 7/12'
                ],
                correctAnswer: 1,
                explanation: 'Total balls = 5 + 4 + 3 = 12. P(Blue) = 4 / 12 = 1/3.'
            },
            {
                id: 7,
                question: 'Calculate the simple interest on NGN 150,000 for 3 years at 8% per annum.',
                options: [
                    'A) NGN 36,000',
                    'B) NGN 24,000',
                    'C) NGN 18,000',
                    'D) NGN 42,000'
                ],
                correctAnswer: 0,
                explanation: 'Simple Interest = (Principal * Rate * Time) / 100 = (150,000 * 8 * 3) / 100 = 3,600,000 / 100 = NGN 36,000.'
            },
            {
                id: 8,
                question: 'In a right-angled triangle, the adjacent side to angle theta is 8 cm and the hypotenuse is 10 cm. Find tan(theta).',
                options: [
                    'A) 3/4',
                    'B) 4/5',
                    'C) 4/3',
                    'D) 3/5'
                ],
                correctAnswer: 0,
                explanation: 'By Pythagoras theorem, Opposite = √(10² - 8²) = √(100 - 64) = √36 = 6 cm. tan(theta) = Opposite / Adjacent = 6 / 8 = 3/4.'
            },
            {
                id: 9,
                question: 'If 3^(2x - 1) = 27, determine x.',
                options: [
                    'A) 1',
                    'B) 2',
                    'C) 3',
                    'D) 4'
                ],
                correctAnswer: 1,
                explanation: '27 = 3³. Therefore, 3^(2x - 1) = 3³ => 2x - 1 = 3 => 2x = 4 => x = 2.'
            },
            {
                id: 10,
                question: 'The mean of five numbers is 18. If a sixth number is added and the new mean becomes 20, what is the sixth number?',
                options: [
                    'A) 24',
                    'B) 28',
                    'C) 30',
                    'D) 32'
                ],
                correctAnswer: 2,
                explanation: 'Sum of 5 numbers = 5 * 18 = 90. Sum of 6 numbers = 6 * 20 = 120. Sixth number = 120 - 90 = 30.'
            }
        ]
    },
    {
        id: 'cbt-eng-01',
        title: 'English Language Lexis & Structure Drill',
        subject: 'English Language',
        category: 'All Levels / WAEC',
        durationMinutes: 12,
        totalQuestions: 8,
        instructions: 'Choose the most appropriate option for each question.',
        questions: [
            {
                id: 1,
                question: 'Choose the option nearest in meaning to the italicized word: The speaker gave a *lucid* presentation of the research findings.',
                options: [
                    'A) Lengthy',
                    'B) Clear and intelligible',
                    'C) Complicated',
                    'D) Monotonous'
                ],
                correctAnswer: 1,
                explanation: 'Lucid means clear, easily understood, and completely coherent.'
            },
            {
                id: 2,
                question: 'Identify the sentence with the correct subject-verb agreement.',
                options: [
                    'A) Neither the tutor nor the students was present in the hall.',
                    'B) Neither the tutor nor the students were present in the hall.',
                    'C) Either the boys or the girl have the book.',
                    'D) The list of participants are published.'
                ],
                correctAnswer: 1,
                explanation: 'Under the rule of proximity with "neither...nor", the verb agrees with the subject closest to it ("the students", plural => "were").'
            },
            {
                id: 3,
                question: 'Choose the correct preposition: She was accused _____ negligence during the laboratory experiment.',
                options: [
                    'A) with',
                    'B) for',
                    'C) of',
                    'D) at'
                ],
                correctAnswer: 2,
                explanation: 'The verb "accuse" takes the fixed preposition "of" (accused of something).'
            },
            {
                id: 4,
                question: 'Select the option opposite in meaning to *ephemeral*.',
                options: [
                    'A) Transient',
                    'B) Permanent',
                    'C) Fleeting',
                    'D) Temporary'
                ],
                correctAnswer: 1,
                explanation: 'Ephemeral means lasting for a very short time. The antonym is permanent.'
            },
            {
                id: 5,
                question: 'Complete the sentence: By the time the examination commenced, Ade ______ studying for six hours.',
                options: [
                    'A) had been',
                    'B) has been',
                    'C) is',
                    'D) was'
                ],
                correctAnswer: 0,
                explanation: 'Past perfect continuous ("had been") shows an ongoing action completed before another past event.'
            },
            {
                id: 6,
                question: 'Which of the following contains an adverbial clause of time?',
                options: [
                    'A) Because he worked hard, he passed.',
                    'B) As soon as the bell rang, the students submitted their papers.',
                    'C) He wrote where everyone could see.',
                    'D) She spoke so quietly that no one heard.'
                ],
                correctAnswer: 1,
                explanation: '"As soon as the bell rang" answers "when" the action occurred, making it an adverbial clause of time.'
            },
            {
                id: 7,
                question: 'Choose the word with the correct spelling:',
                options: [
                    'A) Accomodation',
                    'B) Accommodation',
                    'C) Acommodation',
                    'D) Acomodation'
                ],
                correctAnswer: 1,
                explanation: 'Accommodation is spelled with double "c" and double "m".'
            },
            {
                id: 8,
                question: 'Choose the correct reported speech: "I will submit the assignment tomorrow," said Amina.',
                options: [
                    'A) Amina said she will submit the assignment tomorrow.',
                    'B) Amina said that she would submit the assignment the following day.',
                    'C) Amina says she would submit the assignment yesterday.',
                    'D) Amina said she would submit the assignment tomorrow.'
                ],
                correctAnswer: 1,
                explanation: 'In indirect speech, "will" shifts to "would", and "tomorrow" shifts to "the following day" or "the next day".'
            }
        ]
    },
    {
        id: 'cbt-phys-01',
        title: 'Physics Mechanics & Waves Assessment',
        subject: 'Physics',
        category: 'Senior Secondary / JAMB',
        durationMinutes: 15,
        totalQuestions: 8,
        instructions: 'Take acceleration due to gravity g = 10 m/s² unless otherwise stated.',
        questions: [
            {
                id: 1,
                question: 'A car accelerates uniformly from rest to a velocity of 20 m/s in 5 seconds. What is its acceleration?',
                options: [
                    'A) 2 m/s²',
                    'B) 4 m/s²',
                    'C) 5 m/s²',
                    'D) 100 m/s²'
                ],
                correctAnswer: 1,
                explanation: 'a = (v - u) / t = (20 - 0) / 5 = 4 m/s².'
            },
            {
                id: 2,
                question: 'What is the work done when an object of mass 10 kg is lifted vertically through a height of 6 meters? (g = 10 m/s²)',
                options: [
                    'A) 60 J',
                    'B) 100 J',
                    'C) 600 J',
                    'D) 6000 J'
                ],
                correctAnswer: 2,
                explanation: 'Work done = mgh = 10 * 10 * 6 = 600 Joules.'
            },
            {
                id: 3,
                question: 'The frequency of a wave is 500 Hz and its wavelength is 0.68 m. Calculate the velocity of the wave.',
                options: [
                    'A) 340 m/s',
                    'B) 300 m/s',
                    'C) 735 m/s',
                    'D) 170 m/s'
                ],
                correctAnswer: 0,
                explanation: 'v = f * λ = 500 * 0.68 = 340 m/s.'
            },
            {
                id: 4,
                question: 'Which of the following statements about Newton\'s third law of motion is true?',
                options: [
                    'A) Action and reaction act on the same body.',
                    'B) Action and reaction act on different bodies and are equal in magnitude and opposite in direction.',
                    'C) Action is always greater than reaction.',
                    'D) Reaction precedes action.'
                ],
                correctAnswer: 1,
                explanation: 'Action and reaction forces act simultaneously on two different interacting bodies in opposite directions.'
            },
            {
                id: 5,
                question: 'An electric heater of resistance 20 ohms is connected to a 240 V mains supply. Find the current flowing through it.',
                options: [
                    'A) 10 A',
                    'B) 12 A',
                    'C) 24 A',
                    'D) 48 A'
                ],
                correctAnswer: 1,
                explanation: 'Ohm\'s Law: I = V / R = 240 / 20 = 12 Amperes.'
            },
            {
                id: 6,
                question: 'A convex lens of focal length 20 cm produces a real image of an object placed 30 cm in front of it. Find the image distance.',
                options: [
                    'A) 12 cm',
                    'B) 60 cm',
                    'C) 45 cm',
                    'D) 50 cm'
                ],
                correctAnswer: 1,
                explanation: '1/f = 1/u + 1/v => 1/20 = 1/30 + 1/v => 1/v = 1/20 - 1/30 = (3 - 2)/60 = 1/60 => v = 60 cm.'
            },
            {
                id: 7,
                question: 'Which electromagnetic radiation has the highest frequency?',
                options: [
                    'A) Radio waves',
                    'B) Ultraviolet rays',
                    'C) Gamma rays',
                    'D) Infrared waves'
                ],
                correctAnswer: 2,
                explanation: 'Gamma rays possess the shortest wavelength and hence the highest frequency and photon energy in the EM spectrum.'
            },
            {
                id: 8,
                question: 'A simple pendulum has a length of 0.99 m. If g = 9.8 m/s², what is its approximate period of oscillation? (Period T = 2π√(L/g))',
                options: [
                    'A) 1.0 s',
                    'B) 2.0 s',
                    'C) 3.14 s',
                    'D) 4.0 s'
                ],
                correctAnswer: 1,
                explanation: 'T = 2 * 3.1416 * √(0.99 / 9.8) ≈ 6.283 * √0.101 ≈ 6.283 * 0.318 ≈ 2.0 seconds.'
            }
        ]
    }
];

const DEFAULT_CBT_HISTORY = [
    {
        id: 'hist-001',
        studentId: 'DT-2026-001',
        studentName: 'Chidinma Okafor',
        testId: 'cbt-math-01',
        testTitle: 'Mathematics Comprehensive Mock Test',
        subject: 'Mathematics',
        score: 9,
        total: 10,
        percentage: 90,
        grade: 'A (Distinction)',
        timeSpent: '11m 45s',
        dateTaken: '2026-11-15 14:32'
    },
    {
        id: 'hist-002',
        studentId: 'DT-2026-001',
        studentName: 'Chidinma Okafor',
        testId: 'cbt-phys-01',
        testTitle: 'Physics Mechanics & Waves Assessment',
        subject: 'Physics',
        score: 7,
        total: 8,
        percentage: 87.5,
        grade: 'A (Distinction)',
        timeSpent: '13m 10s',
        dateTaken: '2026-11-10 10:15'
    },
    {
        id: 'hist-003',
        studentId: 'DT-2026-002',
        studentName: 'David Adeleke',
        testId: 'cbt-eng-01',
        testTitle: 'English Language Lexis & Structure Drill',
        subject: 'English Language',
        score: 7,
        total: 8,
        percentage: 87.5,
        grade: 'A (Distinction)',
        timeSpent: '09m 40s',
        dateTaken: '2026-11-12 16:20'
    }
];

const DEFAULT_TUTORS = [
    { id: 'TUT-01', name: 'Dr. Michael Adeyemi', subjects: ['Mathematics', 'Physics'], qualifications: 'Ph.D. Applied Physics, Unilag', studentsCount: 42, rating: '4.9/5' },
    { id: 'TUT-02', name: 'Mrs. Folake Balogun', subjects: ['Chemistry', 'Biology'], qualifications: 'M.Sc. Biochemistry, UI', studentsCount: 38, rating: '4.8/5' },
    { id: 'TUT-03', name: 'Mr. Jude Okon', subjects: ['English Language', 'Literature'], qualifications: 'B.A. English & Literary Studies', studentsCount: 50, rating: '4.9/5' },
    { id: 'TUT-04', name: 'Mr. Emmanuel Nwosu', subjects: ['Basic Science', 'Mathematics'], qualifications: 'B.Sc. Ed. Mathematics', studentsCount: 35, rating: '4.7/5' }
];

// Data Store Class
class DemosmakDB {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem(STORAGE_KEY_PREFIX + 'students')) {
            localStorage.setItem(STORAGE_KEY_PREFIX + 'students', JSON.stringify(DEFAULT_STUDENTS));
        }
        if (!localStorage.getItem(STORAGE_KEY_PREFIX + 'programmes')) {
            localStorage.setItem(STORAGE_KEY_PREFIX + 'programmes', JSON.stringify(DEFAULT_PROGRAMMES));
        }
        if (!localStorage.getItem(STORAGE_KEY_PREFIX + 'cbt_tests')) {
            localStorage.setItem(STORAGE_KEY_PREFIX + 'cbt_tests', JSON.stringify(DEFAULT_CBT_TESTS));
        }
        if (!localStorage.getItem(STORAGE_KEY_PREFIX + 'cbt_history')) {
            localStorage.setItem(STORAGE_KEY_PREFIX + 'cbt_history', JSON.stringify(DEFAULT_CBT_HISTORY));
        }
        if (!localStorage.getItem(STORAGE_KEY_PREFIX + 'tutors')) {
            localStorage.setItem(STORAGE_KEY_PREFIX + 'tutors', JSON.stringify(DEFAULT_TUTORS));
        }
        if (!localStorage.getItem(STORAGE_KEY_PREFIX + 'active_student_id')) {
            localStorage.setItem(STORAGE_KEY_PREFIX + 'active_student_id', 'DT-2026-001');
        }
    }

    // Active Student
    getActiveStudentId() {
        return localStorage.getItem(STORAGE_KEY_PREFIX + 'active_student_id') || 'DT-2026-001';
    }

    setActiveStudentId(id) {
        localStorage.setItem(STORAGE_KEY_PREFIX + 'active_student_id', id);
        window.dispatchEvent(new CustomEvent('studentChanged', { detail: { studentId: id } }));
    }

    getActiveStudent() {
        const id = this.getActiveStudentId();
        return this.getStudentById(id) || this.getStudents()[0];
    }

    // Students
    getStudents() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'students') || '[]');
    }

    getStudentById(id) {
        const list = this.getStudents();
        return list.find(s => s.id === id);
    }

    saveStudent(student) {
        const list = this.getStudents();
        const index = list.findIndex(s => s.id === student.id);
        if (index >= 0) {
            list[index] = student;
        } else {
            list.push(student);
        }
        localStorage.setItem(STORAGE_KEY_PREFIX + 'students', JSON.stringify(list));
        return student;
    }

    registerStudent(formData) {
        const list = this.getStudents();
        const count = list.length + 1;
        const newId = `DT-2026-${count.toString().padStart(3, '0')}`;
        
        // Initial letter initials
        const nameParts = (formData.fullName || 'Student').trim().split(' ');
        const initials = nameParts.map(p => p[0]).join('').toUpperCase().slice(0, 2);

        const newStudent = {
            id: newId,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            grade: formData.grade,
            department: formData.department || 'General',
            parentName: formData.parentName,
            parentPhone: formData.parentPhone,
            parentEmail: formData.parentEmail || formData.email,
            enrollmentDate: new Date().toISOString().split('T')[0],
            avatarInitial: initials,
            status: 'Active',
            subjects: formData.subjects || ['Mathematics', 'English Language'],
            assignedTutors: [
                { subject: 'Core Subjects', tutorName: 'Dr. Michael Adeyemi' },
                { subject: 'Language & Literacy', tutorName: 'Mr. Jude Okon' }
            ],
            attendance: {
                overallRate: 100,
                presentDays: 1,
                totalDays: 1,
                recentLogs: [
                    { date: new Date().toISOString().split('T')[0], status: 'Present', subject: 'Orientation Session' }
                ]
            },
            financials: {
                termFee: formData.termFee || 60000,
                amountPaid: 0,
                outstandingBalance: formData.termFee || 60000,
                paymentStatus: 'Unpaid',
                history: []
            },
            academicReport: {
                gpa: 'N/A',
                averageScore: 0,
                termStanding: 'Newly Enrolled',
                scores: (formData.subjects || ['Mathematics', 'English Language']).map(s => ({
                    subject: s,
                    score: 0,
                    grade: 'Pending',
                    remark: 'Course enrolled'
                }))
            },
            tutorFeedback: [
                {
                    date: new Date().toISOString().split('T')[0],
                    tutor: 'Academic Coordinator',
                    subject: 'Admissions',
                    note: 'Student profile created and enrolled successfully in Demosmak Tutorial Programme.'
                }
            ]
        };

        list.push(newStudent);
        localStorage.setItem(STORAGE_KEY_PREFIX + 'students', JSON.stringify(list));
        this.setActiveStudentId(newId);
        return newStudent;
    }

    // Programmes
    getProgrammes() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'programmes') || '[]');
    }

    // CBT
    getCbtTests() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'cbt_tests') || '[]');
    }

    getCbtTestById(id) {
        const tests = this.getCbtTests();
        return tests.find(t => t.id === id);
    }

    getCbtHistory(studentId = null) {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'cbt_history') || '[]');
        if (studentId) {
            return history.filter(h => h.studentId === studentId);
        }
        return history;
    }

    recordCbtResult(record) {
        const history = this.getCbtHistory();
        const newRecord = {
            id: `hist-${Date.now()}`,
            dateTaken: new Date().toISOString().replace('T', ' ').slice(0, 16),
            ...record
        };
        history.unshift(newRecord);
        localStorage.setItem(STORAGE_KEY_PREFIX + 'cbt_history', JSON.stringify(history));

        // Connect with student profile
        const student = this.getStudentById(record.studentId);
        if (student) {
            // Update average score if suitable
            const studentHistory = history.filter(h => h.studentId === record.studentId);
            const totalPct = studentHistory.reduce((sum, h) => sum + h.percentage, 0);
            const avg = (totalPct / studentHistory.length).toFixed(1);
            if (!student.academicReport) student.academicReport = {};
            student.academicReport.averageScore = parseFloat(avg);
            this.saveStudent(student);
        }

        return newRecord;
    }

    // Payments
    recordPayment(studentId, paymentData) {
        const student = this.getStudentById(studentId);
        if (!student) return null;

        const amount = parseFloat(paymentData.amount);
        const ref = paymentData.ref || `PSTK-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
        const dateStr = new Date().toISOString().split('T')[0];

        const record = {
            ref: ref,
            date: dateStr,
            description: paymentData.description || 'Tuition Fee Payment',
            amount: amount,
            status: 'Verified',
            channel: paymentData.channel || 'Paystack Checkout',
            studentName: student.fullName,
            studentId: student.id,
            grade: student.grade
        };

        student.financials.amountPaid += amount;
        student.financials.outstandingBalance = Math.max(0, student.financials.termFee - student.financials.amountPaid);
        
        if (student.financials.outstandingBalance === 0) {
            student.financials.paymentStatus = 'Paid';
        } else {
            student.financials.paymentStatus = 'Partial';
        }

        if (!student.financials.history) {
            student.financials.history = [];
        }
        student.financials.history.unshift(record);

        this.saveStudent(student);

        // Also add to global receipts ledger
        const receipts = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'receipts') || '[]');
        receipts.unshift(record);
        localStorage.setItem(STORAGE_KEY_PREFIX + 'receipts', JSON.stringify(receipts));

        return { student, record };
    }

    getAllReceipts() {
        const receipts = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'receipts') || '[]');
        if (receipts.length === 0) {
            // Populate from existing students
            const all = [];
            this.getStudents().forEach(s => {
                if (s.financials && s.financials.history) {
                    s.financials.history.forEach(h => {
                        all.push({
                            ...h,
                            studentName: s.fullName,
                            studentId: s.id,
                            grade: s.grade
                        });
                    });
                }
            });
            return all;
        }
        return receipts;
    }

    // Tutors
    getTutors() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'tutors') || '[]');
    }

    // Reset Data Helper
    resetToDefaults() {
        localStorage.removeItem(STORAGE_KEY_PREFIX + 'students');
        localStorage.removeItem(STORAGE_KEY_PREFIX + 'programmes');
        localStorage.removeItem(STORAGE_KEY_PREFIX + 'cbt_tests');
        localStorage.removeItem(STORAGE_KEY_PREFIX + 'cbt_history');
        localStorage.removeItem(STORAGE_KEY_PREFIX + 'tutors');
        localStorage.removeItem(STORAGE_KEY_PREFIX + 'receipts');
        this.init();
    }
}

// Global instance
window.demosmakDB = new DemosmakDB();

