// Authentication functionality
document.addEventListener("DOMContentLoaded", () => {
  // Import validation module (assuming it's in a separate file)
  // In a real application, you would use a proper module bundler
  // For this example, we'll assume it's a global variable
  // If it's not a global variable, you'll need to adjust the import accordingly
  // For example:
  // import * as validation from './validation.js';

  // Or, if it's a script tag in your HTML:
  // The validation object will be available globally

  // Initialize user storage if it doesn't exist
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]))
  }

  // Handle signup form submission
  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Validate form
      if (validation.validateSignupForm(this)) {
        // Get form data
        const name = this.name.value.trim()
        const email = this.email.value.trim().toLowerCase()
        const password = this.password.value

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem("users"))
        const existingUser = users.find((user) => user.email === email)

        if (existingUser) {
          validation.showError("email", "This email is already registered")
          return
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          name,
          email,
          password, // In a real app, this should be hashed
          createdAt: new Date().toISOString(),
        }

        // Add user to storage
        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        // Show success modal
        const modal = document.getElementById("success-modal")
        modal.style.display = "flex"

        // Reset form
        this.reset()
      }
    })
  }

  // Handle signin form submission
  const signinForm = document.getElementById("signin-form")
  if (signinForm) {
    signinForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Validate form
      if (validation.validateSigninForm(this)) {
        // Get form data
        const email = this["login-email"].value.trim().toLowerCase()
        const password = this["login-password"].value
        const rememberMe = this.remember.checked

        // Check if user exists
        const users = JSON.parse(localStorage.getItem("users"))
        const user = users.find((user) => user.email === email && user.password === password)

        if (!user) {
          validation.showError("login-password", "Invalid email or password")
          return
        }

        // Store user session
        if (rememberMe) {
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              id: user.id,
              name: user.name,
              email: user.email,
            }),
          )
        } else {
          sessionStorage.setItem(
            "currentUser",
            JSON.stringify({
              id: user.id,
              name: user.name,
              email: user.email,
            }),
          )
        }

        // Redirect to dashboard (in a real app)
        alert("Login successful! Redirecting to dashboard...")
        // window.location.href = 'dashboard.html';
      }
    })
  }

  // Handle forgot password form submission
  const forgotForm = document.getElementById("forgot-form")
  if (forgotForm) {
    forgotForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Validate form
      if (validation.validateForgotPasswordForm(this)) {
        // Get form data
        const email = this["reset-email"].value.trim().toLowerCase()

        // Check if user exists
        const users = JSON.parse(localStorage.getItem("users"))
        const user = users.find((user) => user.email === email)

        if (!user) {
          validation.showError("reset-email", "No account found with this email")
          return
        }

        // Generate verification code (in a real app, this would be sent via email)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

        // Store verification code in session storage
        sessionStorage.setItem("resetPasswordEmail", email)
        sessionStorage.setItem("verificationCode", verificationCode)

        // Show verification code (in a real app, this would be sent via email)
        alert(`Your verification code is: ${verificationCode}`)

        // Show step 2
        document.getElementById("step-1").style.display = "none"
        document.getElementById("step-2").style.display = "block"
      }
    })
  }

  // Handle verification code form submission
  const verifyCodeForm = document.getElementById("verify-code-form")
  if (verifyCodeForm) {
    verifyCodeForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get all verification inputs
      const verificationInputs = document.querySelectorAll(".verification-input")

      // Validate verification code
      const { isValid, code } = validation.validateVerificationCode(verificationInputs)

      if (isValid) {
        // Check if verification code matches
        const storedCode = sessionStorage.getItem("verificationCode")

        if (code !== storedCode) {
          document.getElementById("verification-code-error").textContent = "Invalid verification code"
          return
        }

        // Show step 3
        document.getElementById("step-2").style.display = "none"
        document.getElementById("step-3").style.display = "block"
      }
    })
  }

  // Handle reset password form submission
  const resetPasswordForm = document.getElementById("reset-password-form")
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Validate form
      if (validation.validateResetPasswordForm(this)) {
        // Get form data
        const newPassword = this["new-password"].value
        const email = sessionStorage.getItem("resetPasswordEmail")

        // Update user password
        const users = JSON.parse(localStorage.getItem("users"))
        const userIndex = users.findIndex((user) => user.email === email)

        if (userIndex !== -1) {
          users[userIndex].password = newPassword
          localStorage.setItem("users", JSON.stringify(users))

          // Clear session storage
          sessionStorage.removeItem("resetPasswordEmail")
          sessionStorage.removeItem("verificationCode")

          // Show success modal
          const modal = document.getElementById("success-modal")
          modal.style.display = "flex"
        }
      }
    })
  }

  // Handle resend code
  const resendCodeButton = document.getElementById("resend-code")
  if (resendCodeButton) {
    resendCodeButton.addEventListener("click", (e) => {
      e.preventDefault()

      // Generate new verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

      // Store verification code in session storage
      sessionStorage.setItem("verificationCode", verificationCode)

      // Show verification code (in a real app, this would be sent via email)
      alert(`Your new verification code is: ${verificationCode}`)
    })
  }

  // Handle modal close
  const closeButtons = document.querySelectorAll(".close")
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal")
      modal.style.display = "none"
    })
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    const modals = document.querySelectorAll(".modal")
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none"
      }
    })
  })
})

