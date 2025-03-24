document.addEventListener("DOMContentLoaded", function () {
    // Initialize modal functionality
    initializeModal();
});

function initializeModal() {
    const startProjectButtons = document.querySelectorAll('.start-project-btn');
    const modal = document.getElementById('dhq-form-modal');
    const closeModal = document.getElementById('close-form-modal');
    
    // Form trigger buttons
    if (startProjectButtons && startProjectButtons.length > 0) {
        startProjectButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (modal) {
                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
                    
                    // Initialize form when modal opens
                    initializeForm();
                }
            });
        });
    }
    
    // Close modal button
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
        
        // Close modal when clicking outside content
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });
        }
    }
}

// Initialize form functionality
function initializeForm() {
    const questions = document.querySelectorAll(".question");
    const progress = document.getElementById("progress");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const submitBtn = document.getElementById("submit");
    const form = document.getElementById("dhq-questionnaire");
    const answerBtns = document.querySelectorAll(".answer-btn");
    
    // Skip if elements don't exist
    if (!questions.length || !form) return;
    
    console.log("Initializing form with " + questions.length + " questions");
    console.log("Answer buttons found: " + answerBtns.length);
    
    // We'll store user answers here - IMPORTANT: Initialize this before calling resetForm
    let answers = {};
    
    // Reset form state if it was previously used
    resetForm();
    
    // Start with the first question
    let currentQuestion = 0;

    // Listen for text/email input changes, update answers object
    document.querySelectorAll("input[type=text], input[type=email]").forEach(inputEl => {
        inputEl.addEventListener("input", function() {
            const fieldName = this.name;
            answers[fieldName] = this.value.trim();
            
            // Also update the hidden input field
            const hiddenInput = document.querySelector(`input[name="${fieldName}"][type="hidden"]`);
            if (hiddenInput) {
                hiddenInput.value = this.value.trim();
            }
            
            checkConditions(); // Re-check if conditions are fulfilled
        });
    });

    // For image-button questions
    if (answerBtns && answerBtns.length > 0) {
        answerBtns.forEach(button => {
            button.addEventListener("click", function(e) {
                e.preventDefault(); // Prevent any default behavior
                
                const name = this.getAttribute("data-name");
                const value = this.getAttribute("data-value");
                
                console.log("Button clicked: " + name + " = " + value);
    
                // Save to answers object
                answers[name] = value;
    
                // Also set hidden input
                const hiddenInput = document.querySelector(`input[name="${name}"][type="hidden"]`);
                if (hiddenInput) {
                    hiddenInput.value = value;
                }
    
                // Highlight selected button
                document.querySelectorAll(`button[data-name="${name}"]`).forEach(btn => {
                    btn.classList.remove("selected");
                });
                this.classList.add("selected");
    
                // Re-check conditions so next question can appear
                checkConditions();
    
                // Move automatically to next question after a short delay
                setTimeout(() => {
                    goToNextVisibleQuestion();
                }, 500);
            });
        });
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const currentQuestionEl = questions[currentQuestion];
            
            // Check if current question has required text/email input fields
            const requiredInputs = currentQuestionEl.querySelectorAll('input[type="text"], input[type="email"]');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (input.type !== 'hidden' && !input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
                
                // Validate email format
                if (input.type === 'email' && input.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value.trim())) {
                        input.classList.add('error');
                        isValid = false;
                    }
                }
            });
            
            if (!isValid) {
                // Show error message or highlight fields
                return;
            }
            
            goToNextVisibleQuestion();
        });
    }

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            // Move to the previous visible question
            for (let i = currentQuestion - 1; i >= 0; i--) {
                if (questions[i].style.display !== "none") {
                    currentQuestion = i;
                    showQuestion();
                    return;
                }
            }
        });
    }

    // Handle form submission
    if (form) {
        form.addEventListener("submit", function(event) {
            // Prevent the default form submission
            event.preventDefault();
            
            // Simple validation before submission
            const lastQ = questions[currentQuestion];
            const inputFields = lastQ.querySelectorAll('input[type="text"], input[type="email"]');
            
            let isValid = true;
            inputFields.forEach(field => {
                if (field.type !== 'hidden' && !field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
                
                // Validate email format if it's an email field
                if (field.type === 'email' && field.value.trim() !== '') {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(field.value.trim())) {
                        field.classList.add('error');
                        isValid = false;
                    }
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields correctly.');
                return;
            }
            
            // Set submission time
            const submissionTimeField = document.getElementById("submissionTime");
            if (submissionTimeField) {
                submissionTimeField.value = new Date().toISOString();
            }
            
            // Set Timestamp field as well
            const timestampField = document.getElementById("Timestamp");
            if (timestampField) {
                timestampField.value = new Date().toISOString();
            }
            
            // Transfer values from selected buttons to hidden fields
            answerBtns.forEach(btn => {
                if (btn.classList.contains('selected')) {
                    const name = btn.getAttribute('data-name');
                    const value = btn.getAttribute('data-value');
                    const hiddenField = form.querySelector(`input[name="${name}"][type="hidden"]`);
                    if (hiddenField) {
                        hiddenField.value = value;
                    }
                }
            });
            
            // Disable the submit button and show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Submitting...";
            }
            
            // Create a FormData object from the form
            const formData = new FormData(form);
            
            // Use fetch to submit the form data
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                // Show success message first
                const formContainer = document.querySelector(".dhq-form-container");
                if (formContainer) {
                    formContainer.innerHTML = `
                        <div class="success-message">
                            <div class="solar-icon">☀️</div>
                            <h2>Thank you for your submission!</h2>
                            <p>We've received your solar project details and will review them promptly.</p>
                            <p>One of our solar energy experts will contact you within 24-48 hours to discuss your project further.</p>
                            <p>Redirecting you to our About Us page...</p>
                        </div>`;
                }
                
                // Redirect after a short delay (3 seconds)
                setTimeout(() => {
                    window.location.href = "#about"; // Redirect to About Us section
                }, 3000);
            })
            .catch(error => {
                console.error("Form submission error:", error);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Submit";
                }
                alert("An error occurred. Please try again or contact us directly.");
            });
        });
    }

    // ----------------------------------------------------------------------------------
    // Conditional Display Logic
    // ----------------------------------------------------------------------------------
    function checkConditions() {
        // For each question, check if it has a condition and if it's met
        questions.forEach(q => {
            let condition = q.getAttribute("data-condition");
            if (!condition || condition.trim() === "") {
                // No condition => always show
                q.style.display = "block";
            } else {
                // Condition => evaluate
                let show = checkIfConditionsMet(condition);
                q.style.display = show ? "block" : "none";
            }
        });
        // After adjusting what's visible, refresh the question UI
        // because "currentQuestion" might now be out of bounds
        if (questions[currentQuestion].style.display === "none") {
            // If the current question is hidden, jump forward or backward
            // to the nearest visible question
            findNearestVisibleQuestion();
        }
        updateButtons();
        updateProgress();
    }

    function checkIfConditionsMet(condition) {
        // Condition can have OR parts separated by " | "
        let orParts = condition.split(" | ");
        return orParts.some(orPart => {
            // Each OR part can have multiple AND conditions " & "
            let andParts = orPart.split(" & ");
            return andParts.every(sub => {
                // e.g. "OwnsLand: Yes" => key="OwnsLand", value="Yes"
                let [key, value] = sub.trim().split(": ");
                if (typeof value === "undefined") {
                    // Means user just wrote "LandLocation" => check not empty
                    return answers[key] && answers[key].trim() !== "";
                }
                // If there's a specific needed value
                return answers[key] === value;
            });
        });
    }

    function findNearestVisibleQuestion() {
        // First try to go forward
        for (let i = currentQuestion; i < questions.length; i++) {
            if (questions[i].style.display !== "none") {
                currentQuestion = i;
                showQuestion();
                return;
            }
        }
        // If no forward is visible, go backward
        for (let i = currentQuestion; i >= 0; i--) {
            if (questions[i].style.display !== "none") {
                currentQuestion = i;
                showQuestion();
                return;
            }
        }
    }

    function goToNextVisibleQuestion() {
        for (let i = currentQuestion + 1; i < questions.length; i++) {
            if (questions[i].style.display !== "none") {
                currentQuestion = i;
                showQuestion();
                return;
            }
        }
        // If no next visible found, show the current one
        showQuestion();
    }

    function showQuestion() {
        // Hide all first
        questions.forEach(q => {
            q.classList.remove("active");
            q.style.visibility = "hidden";
            q.style.position = "absolute";
        });
        // Show the current question
        questions[currentQuestion].classList.add("active");
        questions[currentQuestion].style.visibility = "visible";
        questions[currentQuestion].style.position = "relative";

        updateButtons();
        updateProgress();
    }

    function updateProgress() {
        if (!progress) return;
        
        // Count how many questions are visible
        let visibleQuestions = Array.from(questions).filter(q => q.style.display !== "none");
        let currentIndex = visibleQuestions.indexOf(questions[currentQuestion]);
        let progressPercent = ((currentIndex + 1) / visibleQuestions.length) * 100;
        progress.style.width = progressPercent + "%";
    }

    function updateButtons() {
        if (!prevBtn || !nextBtn || !submitBtn) return;
        
        // If current question is the first visible question => disable "Previous"
        let firstVisibleIndex = findFirstVisibleIndex();
        prevBtn.disabled = (currentQuestion === firstVisibleIndex);

        // If current question is the last visible question => show Submit, hide Next
        let lastVisibleIndex = findLastVisibleIndex();
        if (currentQuestion < lastVisibleIndex) {
            nextBtn.style.display = "inline-block";
            submitBtn.style.display = "none";
        } else {
            nextBtn.style.display = "none";
            submitBtn.style.display = "inline-block";
            submitBtn.disabled = false;
        }
    }

    function findFirstVisibleIndex() {
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].style.display !== "none") {
                return i;
            }
        }
        return 0; // fallback
    }

    function findLastVisibleIndex() {
        let last = 0;
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].style.display !== "none") {
                last = i;
            }
        }
        return last;
    }
    
    function resetForm() {
        // Reset all text and email inputs
        document.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
            input.value = '';
            input.classList.remove('error');
        });
        
        // Reset all hidden inputs
        document.querySelectorAll('input[type="hidden"]').forEach(input => {
            if (input.id !== 'submissionTime') {
                input.value = '';
            }
        });
        
        // Reset all selected buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Reset progress
        if (progress) progress.style.width = '0%';
    }

    // On initialization, check conditions & show the first visible question
    checkConditions();
    showQuestion();
    
    // Log that initialization is complete
    console.log("Form initialization complete");
}