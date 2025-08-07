// Enhanced smooth scrolling for navigation links with active tracking
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const targetPosition = target.offsetTop
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
      // Update active link
      updateActiveLink(this.getAttribute("href").substring(1))
    }
  })
})

// Update active navigation link based on scroll position
function updateActiveSection() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link[data-section]")
  let currentSection = ""
  const scrollPosition = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  // Update active class
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("data-section") === currentSection) {
      link.classList.add("active")
    }
  })
}

// Update active link manually
function updateActiveLink(sectionId) {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link[data-section]")
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("data-section") === sectionId) {
      link.classList.add("active")
    }
  })
}

// Enhanced mobile menu behavior
document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const navbarCollapse = document.querySelector(".navbar-collapse")
    const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, {
      toggle: false,
    })
    bsCollapse.hide()
  })
})

// Navbar brand animation on hover
const navbarBrand = document.querySelector(".animated-brand")
if (navbarBrand) {
  navbarBrand.addEventListener("mouseenter", () => {
    navbarBrand.style.transform = "scale(1.05) rotate(2deg)"
  })
  navbarBrand.addEventListener("mouseleave", () => {
    navbarBrand.style.transform = "scale(1) rotate(0deg)"
  })
}

// Enhanced download button interactions
const downloadBtn = document.querySelector(".btn-lummy-download")
if (downloadBtn) {
  downloadBtn.addEventListener("mouseenter", () => {
    downloadBtn.style.transform = "translateY(-3px) scale(1.05)"
  })
  downloadBtn.addEventListener("mouseleave", () => {
    downloadBtn.style.transform = "translateY(0) scale(1)"
  })
  
  downloadBtn.addEventListener("click", (e) => {
    // Add ripple effect
    const ripple = document.createElement("span")
    const rect = downloadBtn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `
    
    downloadBtn.style.position = "relative"
    downloadBtn.style.overflow = "hidden"
    downloadBtn.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, 600)
  })
}

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const navbarCollapse = document.querySelector(".navbar-collapse")
    if (navbarCollapse.classList.contains("show")) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, {
        toggle: false,
      })
      bsCollapse.hide()
    }
  }
})

// Initialize active section on page load
document.addEventListener("DOMContentLoaded", () => {
  updateActiveSection()
  
  // Add intersection observer for better performance
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -80% 0px",
    threshold: 0,
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute("id")
        updateActiveLink(sectionId)
      }
    })
  }, observerOptions)
  
  // Observe all sections
  document.querySelectorAll("section[id]").forEach((section) => {
    observer.observe(section)
  })
})

// Scroll event listener
window.addEventListener("scroll", () => {
  updateActiveSection()
})

// Download APK function
function downloadAPK() {
  // Show download modal
  const modal = new window.bootstrap.Modal(document.getElementById("downloadModal"))
  modal.show()
  
  // Simulate download preparation
  setTimeout(() => {
    // Hide modal
    modal.hide()
    // Create download link (replace with actual APK URL)
    const link = document.createElement("a")
    link.href = "assets/downloads/lummy-app.apk" // Replace with actual APK path
    link.download = "Lummy-App-v1.0.apk"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // Show success message
    showNotification("Download iniciado! 🎉", "success")
  }, 3000)
}

// Newsletter subscription
function subscribeNewsletter(event) {
  event.preventDefault()
  const email = event.target.querySelector('input[type="email"]').value
  
  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]')
  const originalHTML = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
  submitBtn.disabled = true
  
  // Simulate API call
  setTimeout(() => {
    showNotification("Obrigado por se inscrever! 📧", "success")
    event.target.reset()
    // Reset button
    submitBtn.innerHTML = originalHTML
    submitBtn.disabled = false
  }, 1000)
}

// Show notification function
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification-toast")
  existingNotifications.forEach((notification) => notification.remove())
  
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `alert alert-${type === "success" ? "success" : "info"} notification-toast position-fixed`
  notification.innerHTML = `
    <div class="d-flex align-items-center">
      <i class="fas fa-${type === "success" ? "check-circle" : "info-circle"} me-2"></i>
      <span>${message}</span>
      <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
    </div>
  `
  
  // Add styles
  notification.style.cssText = `
    top: 100px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    max-width: 90vw;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: slideInRight 0.3s ease-out;
  `
  
  // Add to body
  document.body.appendChild(notification)
  
  // Remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOutRight 0.3s ease-in"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }
  }, 4000)
}

// Add CSS animations for notifications
const style = document.createElement("style")
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @media (max-width: 576px) {
    .notification-toast {
      right: 10px !important;
      left: 10px !important;
      min-width: auto !important;
    }
  }
`
document.head.appendChild(style)

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up")
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".feature-card, .screenshot-item, .section-title")
  animateElements.forEach((el) => observer.observe(el))
})

// Floating coins animation enhancement
document.addEventListener("DOMContentLoaded", () => {
  const coins = document.querySelectorAll(".floating-coin")
  coins.forEach((coin, index) => {
    // Add random movement
    setInterval(
      () => {
        const randomX = Math.random() * 20 - 10
        const randomY = Math.random() * 20 - 10
        coin.style.transform = `translate(${randomX}px, ${randomY}px)`
      },
      3000 + index * 500,
    )
  })
})

// Phone mockup interaction
document.addEventListener("DOMContentLoaded", () => {
  const phoneScreens = document.querySelectorAll(".phone-screen")
  phoneScreens.forEach((phoneScreen) => {
    if (phoneScreen) {
      phoneScreen.addEventListener("mouseenter", () => {
        phoneScreen.style.transform = "scale(1.02)"
        phoneScreen.style.transition = "transform 0.3s ease"
      })
      phoneScreen.addEventListener("mouseleave", () => {
        phoneScreen.style.transform = "scale(1)"
      })
    }
  })
})

// Statistics counter animation
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)
  const timer = setInterval(() => {
    start += increment
    if (start >= target) {
      element.textContent = target
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(start)
    }
  }, 16)
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll(".stat-number")
      statNumbers.forEach((stat) => {
        const text = stat.textContent
        if (text.includes("K+")) {
          animateCounter(stat, 10)
          setTimeout(() => {
            stat.textContent = "10K+"
          }, 2000)
        } else if (text.includes("%")) {
          animateCounter(stat, 95)
          setTimeout(() => {
            stat.textContent = "95%"
          }, 2000)
        }
      })
      statsObserver.unobserve(entry.target)
    }
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const heroStats = document.querySelector(".hero-stats")
  if (heroStats) {
    statsObserver.observe(heroStats)
  }
})

// Form validation enhancement
document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      if (!form.checkValidity()) {
        e.preventDefault()
        e.stopPropagation()
      }
      form.classList.add("was-validated")
    })
  })
})

// Responsive adjustments
function handleResize() {
  const width = window.innerWidth
  
  // Adjust floating coins size based on screen size
  const coins = document.querySelectorAll(".floating-coin")
  coins.forEach((coin) => {
    if (width < 576) {
      coin.style.fontSize = "1rem"
    } else if (width < 768) {
      coin.style.fontSize = "1.2rem"
    } else if (width < 992) {
      coin.style.fontSize = "1.5rem"
    } else {
      coin.style.fontSize = "2rem"
    }
  })
  
  // Adjust notification position on mobile
  const notifications = document.querySelectorAll(".notification-toast")
  notifications.forEach((notification) => {
    if (width < 576) {
      notification.style.left = "10px"
      notification.style.right = "10px"
      notification.style.minWidth = "auto"
    } else {
      notification.style.left = "auto"
      notification.style.right = "20px"
      notification.style.minWidth = "300px"
    }
  })
}

// Listen for resize events
window.addEventListener("resize", handleResize)
document.addEventListener("DOMContentLoaded", handleResize)

// Console welcome message
console.log(`
🚀 Bem-vindo ao Lummy!
📱 Educação financeira lúdica para crianças
💡 Nova navbar super estilizada!
✨ Desenvolvido com ❤️
`)
