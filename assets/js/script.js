// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Navbar background change on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".custom-navbar")
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)"
    navbar.style.boxShadow = "0 2px 30px rgba(0, 0, 0, 0.15)"
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)"
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  }
})

// Download APK function
function downloadAPK() {
  // Show download modal
  const modal = document.getElementById("downloadModal")
  modal.style.display = "block" // Assuming Bootstrap modal is shown by setting display to block

  // Simulate download preparation
  setTimeout(() => {
    // Hide modal
    modal.style.display = "none" // Assuming Bootstrap modal is hidden by setting display to none

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

  // Simulate API call
  setTimeout(() => {
    showNotification("Obrigado por se inscrever! 📧", "success")
    event.target.reset()
  }, 1000)
}

// Show notification function
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `alert alert-${type === "success" ? "success" : "info"} notification-toast`
  notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === "success" ? "check-circle" : "info-circle"} me-2"></i>
            <span>${message}</span>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease-out;
    `

  // Add to body
  document.body.appendChild(notification)

  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-in"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
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
  const phoneScreen = document.querySelector(".phone-screen")
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

// Lazy loading for images
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
})

// Console welcome message
console.log(`
🚀 Bem-vindo ao Lummy!
📱 Educação financeira lúdica para crianças
💡 Desenvolvido com ❤️ para transformar o aprendizado sobre dinheiro em diversão!

🔗 Visite: https://lummy.app
📧 Contato: contato@lummy.app
`)
