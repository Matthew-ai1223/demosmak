/**
 * DEMOSMAK TUTORIAL - CBT Engine
 * Interactive examination engine with timer, auto-marking, review & student profile linkage.
 * Strictly NO EMOJIS. Clean SVG icons and professional typography only.
 */

class CbtEngine {
    constructor() {
        this.currentTest = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {}; // { questionId: selectedIndex }
        this.flaggedQuestions = new Set();
        this.timerInterval = null;
        this.secondsRemaining = 0;
        this.totalDurationSeconds = 0;
        this.isExamActive = false;
        this.startTime = null;
    }

    startTest(testId, studentId) {
        const test = window.demosmakDB.getCbtTestById(testId);
        if (!test) {
            console.error('Test not found:', testId);
            return false;
        }

        this.currentTest = test;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.flaggedQuestions.clear();
        this.totalDurationSeconds = test.durationMinutes * 60;
        this.secondsRemaining = this.totalDurationSeconds;
        this.isExamActive = true;
        this.startTime = Date.now();
        this.studentId = studentId || window.demosmakDB.getActiveStudentId();

        this.startTimer();
        return true;
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.secondsRemaining--;
            this.updateTimerDisplay();

            if (this.secondsRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.isExamActive = false;
                window.dispatchEvent(new CustomEvent('cbtTimeExpired'));
                this.submitExam(true);
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.secondsRemaining / 60);
        const seconds = this.secondsRemaining % 60;
        const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const el = document.getElementById('cbt-timer-display');
        if (el) {
            el.textContent = formatted;
            if (this.secondsRemaining < 120) {
                el.classList.add('cbt-timer-warning');
            } else {
                el.classList.remove('cbt-timer-warning');
            }
        }

        // Progress bar if present
        const progressEl = document.getElementById('cbt-timer-progress');
        if (progressEl) {
            const pct = ((this.totalDurationSeconds - this.secondsRemaining) / this.totalDurationSeconds) * 100;
            progressEl.style.width = `${pct}%`;
        }
    }

    selectAnswer(questionId, optionIndex) {
        if (!this.isExamActive) return;
        this.userAnswers[questionId] = optionIndex;
    }

    toggleFlag(questionId) {
        if (this.flaggedQuestions.has(questionId)) {
            this.flaggedQuestions.delete(questionId);
        } else {
            this.flaggedQuestions.add(questionId);
        }
    }

    goToQuestion(index) {
        if (index >= 0 && index < this.currentTest.questions.length) {
            this.currentQuestionIndex = index;
            return true;
        }
        return false;
    }

    nextQuestion() {
        return this.goToQuestion(this.currentQuestionIndex + 1);
    }

    prevQuestion() {
        return this.goToQuestion(this.currentQuestionIndex - 1);
    }

    submitExam(isAutoSubmit = false) {
        clearInterval(this.timerInterval);
        this.isExamActive = false;

        const timeElapsedSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
        const elapsedMinutes = Math.floor(timeElapsedSeconds / 60);
        const elapsedSecs = timeElapsedSeconds % 60;
        const timeSpentStr = `${elapsedMinutes}m ${elapsedSecs}s`;

        // Grading
        let correctCount = 0;
        const breakdown = this.currentTest.questions.map((q) => {
            const userPick = this.userAnswers[q.id];
            const isCorrect = userPick !== undefined && userPick === q.correctAnswer;
            if (isCorrect) correctCount++;
            return {
                id: q.id,
                question: q.question,
                options: q.options,
                userChoice: userPick !== undefined ? userPick : null,
                correctChoice: q.correctAnswer,
                isCorrect: isCorrect,
                explanation: q.explanation
            };
        });

        const totalQuestions = this.currentTest.questions.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);

        let grade = 'F';
        let standing = 'Needs Improvement';
        if (percentage >= 80) {
            grade = 'A (Distinction)';
            standing = 'Excellent Performance';
        } else if (percentage >= 70) {
            grade = 'B (Credit)';
            standing = 'Very Good';
        } else if (percentage >= 60) {
            grade = 'C (Pass)';
            standing = 'Good Understanding';
        } else if (percentage >= 50) {
            grade = 'D';
            standing = 'Fair';
        }

        const student = window.demosmakDB.getStudentById(this.studentId);
        const resultRecord = {
            studentId: this.studentId,
            studentName: student ? student.fullName : 'Guest Student',
            testId: this.currentTest.id,
            testTitle: this.currentTest.title,
            subject: this.currentTest.subject,
            score: correctCount,
            total: totalQuestions,
            percentage: percentage,
            grade: grade,
            standing: standing,
            timeSpent: timeSpentStr,
            breakdown: breakdown,
            autoSubmitted: isAutoSubmit
        };

        // Save to central DB and link to student profile
        const saved = window.demosmakDB.recordCbtResult(resultRecord);
        return { result: saved, breakdown: breakdown };
    }
}

window.demosmakCbt = new CbtEngine();

