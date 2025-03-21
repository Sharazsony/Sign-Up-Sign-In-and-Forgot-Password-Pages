// Form validation functions
const validation = {
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate password strength
  isStrongPassword: (password) => {
    // Password must be at least 8 characters long and contain at least one uppercase letter,
    // one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
  },

  // Check if passwords match
  doPasswordsMatch: (password, confirmPassword) => password === confirmPassword,

  // Display error message
  showError: (inputId, message) => {
    const errorElement = document.getElementById(`${inputId}-error`)
    if (errorElement) {
      errorElement.textContent = message
      document.getElementById(inputId).classList.add("error")
    }
  },

  // Clear error message
  clearError: (inputId) => {
    const errorElement = document.getElementById(`${inputId}-error`)
    if (errorElement) {
      errorElement.textContent = ""
      document.getElementById(inputId).classList.remove("error")
    }
  },

  // Validate signup form
  validateSignupForm: function (form) {
    let isValid = true

    // Validate name
    const name = form.name.value.trim()
    if (name === "") {
      this.showError("name", "Name is required")
      isValid = false
    } else if (name.length < 2) {
      this.showError("name", "Name must be at least 2 characters")
      isValid = false
    } else {
      this.clearError("name")
    }

    // Validate email
    const email = form.email.value.trim()
    if (email === "") {
      this.showError("email", "Email is required")
      isValid = false
    } else if (!this.isValidEmail(email)) {
      this.showError("email", "Please enter a valid email address")
      isValid = false
    } else {
      this.clearError("email")
    }

    // Validate password
    const password = form.password.value
    if (password === "") {
      this.showError("password", "Password is required")
      isValid = false
    } else if (!this.isStrongPassword(password)) {
      this.showError(
        "password",
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      )
      isValid = false
    } else {
      this.clearError("password")
    }

    // Validate confirm password
    const confirmPassword = form["confirm-password"].value
    if (confirmPassword === "") {
      this.showError("confirm-password", "Please confirm your password")
      isValid = false
    } else if (!this.doPasswordsMatch(password, confirmPassword)) {
      this.showError("confirm-password", "Passwords do not match")
      isValid = false
    } else {
      this.clearError("confirm-password")
    }

    // Validate terms checkbox
    if (!form.terms.checked) {
      this.showError("terms", "You must agree to the Terms of Service and Privacy Policy")
      isValid = false
    } else {
      this.clearError("terms")
    }

    return isValid
  },

  // Validate signin form
  validateSigninForm: function (form) {
    let isValid = true

    // Validate email
    const email = form["login-email"].value.trim()
    if (email === "") {
      this.showError("login-email", "Email is required")
      isValid = false
    } else if (!this.isValidEmail(email)) {
      this.showError("login-email", "Please enter a valid email address")
      isValid = false
    } else {
      this.clearError("login-email")
    }

    // Validate password
    const password = form["login-password"].value
    if (password === "") {
      this.showError("login-password", "Password is required")
      isValid = false
    } else {
      this.clearError("login-password")
    }

    return isValid
  },

  // Validate forgot password form
  validateForgotPasswordForm: function (form) {
    let isValid = true

    // Validate email
    const email = form["reset-email"].value.trim()
    if (email === "") {
      this.showError("reset-email", "Email is required")
      isValid = false
    } else if (!this.isValidEmail(email)) {
      this.showError("reset-email", "Please enter a valid email address")
      isValid = false
    } else {
      this.clearError("reset-email")
    }

    return isValid
  },

  // Validate verification code
  validateVerificationCode: (inputs) => {
    let isValid = true
    let code = ""

    for (const input of inputs) {
      if (input.value === "") {
        document.getElementById("verification-code-error").textContent = "Please enter the complete verification code"
        isValid = false
        break
      }
      code += input.value
    }

    if (isValid) {
      document.getElementById("verification-code-error").textContent = ""
    }

    return { isValid, code }
  },

  // Validate reset password form
  validateResetPasswordForm: function (form) {
    let isValid = true

    // Validate new password
    const newPassword = form["new-password"].value
    if (newPassword === "") {
      this.showError("new-password", "Password is required")
      isValid = false
    } else if (!this.isStrongPassword(newPassword)) {
      this.showError(
        "new-password",
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      )
      isValid = false
    } else {
      this.clearError("new-password")
    }

    // Validate confirm new password
    const confirmNewPassword = form["confirm-new-password"].value
    if (confirmNewPassword === "") {
      this.showError("confirm-new-password", "Please confirm your password")
      isValid = false
    } else if (!this.doPasswordsMatch(newPassword, confirmNewPassword)) {
      this.showError("confirm-new-password", "Passwords do not match")
      isValid = false
    } else {
      this.clearError("confirm-new-password")
    }

    return isValid
  },
}

// Toggle password visibility
document.addEventListener("DOMContentLoaded", () => {
  const togglePasswordButtons = document.querySelectorAll(".toggle-password")

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target")
      const passwordInput = document.getElementById(targetId)

      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        this.classList.remove("fa-eye-slash")
        this.classList.add("fa-eye")
      } else {
        passwordInput.type = "password"
        this.classList.remove("fa-eye")
        this.classList.add("fa-eye-slash")
      }
    })
  })

  // Handle verification code inputs
  const verificationInputs = document.querySelectorAll(".verification-input")

  verificationInputs.forEach((input, index) => {
    // Auto-focus next input when a digit is entered
    input.addEventListener("input", function () {
      if (this.value.length === 1) {
        if (index < verificationInputs.length - 1) {
          verificationInputs[index + 1].focus()
        }
      }
    })

    // Handle backspace
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && this.value === "" && index > 0) {
        verificationInputs[index - 1].focus()
      }
    })

    // Allow only numbers
    input.addEventListener("keypress", (e) => {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault()
      }
    })
  })
})

