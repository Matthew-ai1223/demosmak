/**
 * DEMOSMAK TUTORIAL - Main UI Framework & Shared Interactivity
 * Zero emojis - Pure clean SVG iconography & professional typography.
 */

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.remove('scroll-locked');
    document.body.style.overflow = '';
    initNavigation();
    initStudentSwitcher();
    initRegistrationModal();
    initToastContainer();
});

// Navigation & Mobile Drawer
function initNavigation() {
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-menu-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isOpen);
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const dropdowns = document.querySelectorAll('.nav-item-dropdown');
    dropdowns.forEach((item) => {
        const toggle = item.querySelector('.nav-dropdown-toggle');
        if (!toggle) return;
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = !item.classList.contains('open');
            dropdowns.forEach((other) => other.classList.remove('open'));
            item.classList.toggle('open', willOpen);
            toggle.setAttribute('aria-expanded', willOpen);
        });
    });

    document.addEventListener('click', () => {
        dropdowns.forEach((item) => {
            item.classList.remove('open');
            const toggle = item.querySelector('.nav-dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Set active link based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    if (['sms.html', 'parent.html', 'admin.html'].includes(currentPath)) {
        const portalToggle = document.querySelector('.nav-dropdown-toggle');
        if (portalToggle) portalToggle.classList.add('active');
        document.querySelectorAll('.nav-dropdown a').forEach((link) => {
            if (link.getAttribute('href') === currentPath) link.classList.add('active');
        });
    }
}

// Student Switcher
function initStudentSwitcher() {
    const switcher = document.getElementById('global-student-select');
    if (!switcher || !window.demosmakDB) return;

    const populateStudents = () => {
        const students = window.demosmakDB.getStudents();
        const activeId = window.demosmakDB.getActiveStudentId();

        switcher.innerHTML = students.map(s => `
            <option value="${s.id}" ${s.id === activeId ? 'selected' : ''}>
                ${s.fullName} (${s.id} - ${s.grade})
            </option>
        `).join('');
    };

    populateStudents();

    switcher.addEventListener('change', (e) => {
        const selectedId = e.target.value;
        window.demosmakDB.setActiveStudentId(selectedId);
        showToast(`Active student switched to ${selectedId}`, 'info');
        // Let other components react
        window.dispatchEvent(new CustomEvent('studentChanged', { detail: { studentId: selectedId } }));
    });

    window.addEventListener('studentRegistered', () => {
        populateStudents();
    });
}

// Online Student Registration Modal
function initRegistrationModal() {
    const modal = document.getElementById('registration-modal');
    const closeBtn = document.getElementById('close-register-modal-btn');
    const form = document.getElementById('student-registration-form');

    if (!modal) return;

    const setScrollLock = (locked) => {
        document.body.classList.toggle('scroll-locked', locked);
        document.body.style.overflow = locked ? 'hidden' : '';
    };

    const openModal = () => {
        modal.classList.add('visible');
        setScrollLock(true);
    };

    const closeModal = () => {
        modal.classList.remove('visible');
        setScrollLock(false);
    };

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.open-register-modal-btn');
        if (!trigger) return;
        e.preventDefault();
        openModal();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    const cancelBtn = document.getElementById('cancel-register-modal-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('reg-fullname').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const grade = document.getElementById('reg-grade').value;
            const parentName = document.getElementById('reg-parent-name').value.trim();
            const parentPhone = document.getElementById('reg-parent-phone').value.trim();

            const selectedSubjects = Array.from(document.querySelectorAll('input[name="reg_subjects"]:checked')).map(cb => cb.value);

            if (!fullName || !email || !grade) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }

            const newStudent = window.demosmakDB.registerStudent({
                fullName,
                email,
                phone,
                grade,
                parentName,
                parentPhone,
                subjects: selectedSubjects.length > 0 ? selectedSubjects : ['Mathematics', 'English Language']
            });

            closeModal();
            form.reset();
            showToast(`Registration Successful! Assigned ID: ${newStudent.id}`, 'success');
            window.dispatchEvent(new CustomEvent('studentRegistered', { detail: newStudent }));

            // If user is currently on the homepage, offer to jump to SMS
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
                setTimeout(() => {
                    if (confirm(`Student ${newStudent.fullName} registered successfully with ID ${newStudent.id}.\n\nWould you like to open the Student Management Portal now?`)) {
                        window.location.href = 'sms.html';
                    }
                }, 400);
            }
        });
    }
}

// Toast Notification
function initToastContainer() {
    if (!document.getElementById('toast-container')) {
        const tc = document.createElement('div');
        tc.id = 'toast-container';
        tc.className = 'toast-container';
        document.body.appendChild(tc);
    }
}

function showToast(message, type = 'info') {
    initToastContainer();
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-text">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

window.showToast = showToast;

