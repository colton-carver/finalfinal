document.addEventListener("DOMContentLoaded", () => {
  // List of all 179 members sorted alphabetically by first name
  const members = [
    "Adam Close",
    "Adam Hisel",
    "Addy Kastli",
    "Addy Wenzl",
    "Aidan Sash",
    "Alejandra Valverde",
    "Alex",
    "Alex johnson",
    "Allison Hubbell",
    "Allison Ricotta",
    "Alma Cosgrove",
    "Andrew Pfeiffer",
    "Andrew Smetana",
    "Andy",
    "Andy Kuster",
    "Anna ten Hoeve",
    "Anthony Haberman",
    "Ari Oistad",
    "Ashley Hummel",
    "Ashlyn Crawford",
    "Aubrey Holst",
    "Aubrie Snyder",
    "Austin Deeb",
    "Autumn Tiedens",
    "Ava Post",
    "Avery Heun",
    "Avery Menke",
    "Avery Petzke",
    "Ben Jackson",
    "Bobby main",
    "Braden Lundgren",
    "Brett Simon",
    "Bridget Sullivan",
    "Brooke Thomas",
    "Cady Betsworth",
    "Cael Siebrecht",
    "Caleb Cargill",
    "Cali Wyrobeck",
    "Carson Green",
    "Catherine Curtiss",
    "Cayden Rowin",
    "Chace Cheripka",
    "Christopher Cottrill",
    "Claire Boswell",
    "Claire Freesmeier",
    "Claire h",
    "Cohen Pye",
    "Cole Doty",
    "Colton Carver",
    "Courtney Hubbell",
    "Courtney Larsen",
    "Dallas Dinkla",
    "David Zdravev",
    "Delaney Connors",
    "Deven Patel",
    "Ella Maier",
    "Ella Meyer",
    "Ellie Shepherd",
    "Ellie Taylor",
    "Emilee Kunde",
    "Emma Fuller",
    "Emma Larmie",
    "Erica Klein",
    "Ethan Czyzewicz",
    "Evan Avitia",
    "Evan Bible",
    "Evan Hubbs",
    "Finn Henderson",
    "Gavin",
    "Gavyn",
    "George",
    "George Wald",
    "Grace Roncke",
    "Grace Ulrick",
    "Grace Wing",
    "Hadley Pearson",
    "Hayden Moore",
    "Hope Uggerud",
    "Isabella DiNovo",
    "Isabella H",
    "Isabella Valverde",
    "J.K. Prentice",
    "Jack Albert",
    "Jacob Noonan",
    "Jacob S. V",
    "Jadyn Schmidt",
    "Jake Gilpin",
    "James Oberg",
    "Jayden Quinn",
    "JD Schaer",
    "Jenna Rogers",
    "Jenna Wieskamp",
    "Jensen Brehm",
    "Joe Stelzig",
    "Joey Kohley",
    "Joseph Weisner",
    "Josh",
    "Justin Brandt",
    "Justin Hingtgen",
    "Justin Senese",
    "Jyotika Sharma",
    "Kaitlyn Morrison",
    "Kallie Mitchell",
    "Kassidy",
    "Katie Murphy",
    "Kendall",
    "Kenny Conlin",
    "Kenny Strezo",
    "Kirsten Moyer",
    "Lauren Dean",
    "lauren lade",
    "Lila Pellatt",
    "Lily",
    "Lily Rettig",
    "Lucy Pfab",
    "Lukas Jacobsen",
    "LUKE LEONE",
    "Maddie Burke",
    "Maddie Marsh",
    "Maddie Morris",
    "Magge Cowen",
    "Maggie Schiltz",
    "Maggie Terlouw",
    "Makenna Hansen",
    "Marcus Barker",
    "Mason Reilly",
    "Matthew Hansen",
    "Michael",
    "Michael A",
    "Michael Flavin",
    "Michal Wojcik",
    "Mikey Cling",
    "Molly Rooney",
    "Morgan Ratliff",
    "Nate Defries",
    "Nicholas Pollock",
    "Noah Kaucher",
    "Nojus",
    "Nolan Klemesrud",
    "Olivia Agalianos",
    "Oscar Andestic",
    "Owen Fast",
    "Padruig Roberts",
    "Peyton Riddle",
    "Phillip Drahos",
    "Quinn Weidenaar",
    "Rachel Frost",
    "Raina Henrichs",
    "Raquel Tenbrink",
    "Reagan Phillips",
    "Reese",
    "Robert Dillon",
    "Robert Johnson",
    "Ronan Pompeo",
    "Ryan Sabol",
    "Ryan Ungs",
    "Sadie Floss",
    "Sam Bredensteiner",
    "Samantha Cranstoun",
    "Samantha Zeeck",
    "Sarah Barklow",
    "Sean Nelsen",
    "Sean Nolting",
    "Seth Noyes",
    "Shae Nickels",
    "Shelby Fraker",
    "Sid P",
    "Sidney Allen",
    "Spencer Clifton",
    "Steven Wolfe",
    "Tiarus Slanger",
    "Tom Nitsch",
    "Tyler",
    "Tyler Hesseling",
    "Viviana",
    "Wyatt Shirley",
    "Zach Post",
    "Zachary Ogorzaly",
    "Zoey Lohse",
  ]

  // Populate the member select dropdown
  const memberSelect = document.getElementById("member-select")
  if (memberSelect) {
    // Add a default option
    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.textContent = "-- Select a Member --"
    memberSelect.appendChild(defaultOption)

    // Add all members
    members.forEach((member) => {
      const option = document.createElement("option")
      option.value = encodeURIComponent(member.toLowerCase().replace(/\s+/g, "-"))
      option.textContent = member
      memberSelect.appendChild(option)
    })
  }

  // Handle URL parameters for member selection
  const urlParams = new URLSearchParams(window.location.search)
  const memberParam = urlParams.get("member")

  if (memberParam && memberSelect) {
    // Try to find the member by the URL parameter
    const matchingOption = Array.from(memberSelect.options).find(
      (option) => option.value === memberParam || decodeURIComponent(option.value) === decodeURIComponent(memberParam),
    )

    if (matchingOption) {
      matchingOption.selected = true

      // Hide the member selection since it's pre-selected from URL
      const formGroup = memberSelect.closest(".member-select-container")
      if (formGroup) {
        formGroup.style.display = "none"
      }

      // Add a hidden input to ensure the member is still submitted with the form
      const hiddenInput = document.createElement("input")
      hiddenInput.type = "hidden"
      hiddenInput.name = "member"
      hiddenInput.value = matchingOption.value
      memberSelect.parentNode.appendChild(hiddenInput)

      // Add a visible message showing who is being credited
      const creditMessage = document.createElement("p")
      creditMessage.className = "credit-message"
      creditMessage.textContent = `Your donation will credit: ${matchingOption.textContent}`
      memberSelect.parentNode.appendChild(creditMessage)
    }
  }

  // Initialize Stripe
  let stripe
  let elements
  let card

  // Fetch the publishable key from our server
  fetch("/api/get-stripe-key")
    .then((response) => response.json())
    .then((data) => {
      const stripePublishableKey = data.publishableKey

      // Initialize Stripe with the publishable key
      stripe = Stripe(stripePublishableKey)
      elements = stripe.elements()

      // Create and mount the Card Element
      card = elements.create("card", {
        style: {
          base: {
            color: "#32325d",
            fontFamily: '"Alice", serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#aab7c4",
            },
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        },
      })

      card.mount("#card-element")

      // Handle real-time validation errors from the card Element
      card.on("change", (event) => {
        const displayError = document.getElementById("card-errors")
        if (event.error) {
          displayError.textContent = event.error.message
        } else {
          displayError.textContent = ""
        }
      })
    })
    .catch((error) => {
      console.error("Error fetching Stripe key:", error)
      document.getElementById("payment-message").textContent =
        "Could not initialize payment system. Please try again later."
      document.getElementById("payment-message").classList.remove("hidden")
    })

  // Handle form submission
  const form = document.getElementById("donation-form")
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault()

      // Validate form
      const donorName = document.getElementById("donor-name").value
      const donorEmail = document.getElementById("donor-email").value
      const memberSelected = document.getElementById("member-select").value
      const memberText =
        document.getElementById("member-select").options[document.getElementById("member-select").selectedIndex].text
      const amount = document.getElementById("amount").value

      if (!memberSelected) {
        alert("Please select a member to credit.")
        return
      }

      if (!amount || amount < 1) {
        alert("Please enter a valid donation amount.")
        return
      }

      // Disable the submit button to prevent multiple submissions
      setLoading(true)

      try {
        // Create a payment intent on the server
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            donorName: donorName,
            donorEmail: donorEmail,
            memberCredited: memberText,
            memberSlug: memberSelected,
          }),
        })

        const data = await response.json()

        if (data.error) {
          showMessage(data.error)
          setLoading(false)
          return
        }

        // Confirm the card payment
        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              name: donorName,
              email: donorEmail,
            },
          },
        })

        if (result.error) {
          // Show error to your customer
          showMessage(result.error.message)
        } else {
          // The payment succeeded!
          showMessage("Thank you for your donation! Your payment was successful.")
          form.reset()
        }
      } catch (error) {
        console.error("Error:", error)
        showMessage("An unexpected error occurred. Please try again later.")
      }

      setLoading(false)
    })
  }

  // Helper function to show a message
  function showMessage(messageText) {
    const messageElement = document.getElementById("payment-message")
    messageElement.textContent = messageText
    messageElement.classList.remove("hidden")

    setTimeout(() => {
      messageElement.classList.add("hidden")
    }, 10000)
  }

  // Helper function to set the loading state
  function setLoading(isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("#submit-button").disabled = true
      document.querySelector("#spinner").classList.remove("hidden")
      document.querySelector("#button-text").classList.add("hidden")
    } else {
      document.querySelector("#submit-button").disabled = false
      document.querySelector("#spinner").classList.add("hidden")
      document.querySelector("#button-text").classList.remove("hidden")
    }
  }

  // Add some wonderland magic - random floating elements
  function createWonderlandElement() {
    const elements = ["🍄", "🐇", "🎩", "🍵", "🗝️", "♠️", "♥️", "♦️", "♣️"]
    const element = document.createElement("div")
    element.textContent = elements[Math.floor(Math.random() * elements.length)]
    element.className = "floating-element"
    element.style.left = Math.random() * 100 + "vw"
    element.style.top = Math.random() * 100 + "vh"
    element.style.animationDuration = 15 + Math.random() * 10 + "s"
    element.style.opacity = 0.1 + Math.random() * 0.4
    element.style.fontSize = 20 + Math.random() * 30 + "px"

    document.body.appendChild(element)

    // Remove after animation completes
    setTimeout(() => {
      element.remove()
    }, 25000)
  }

  // Create a new element occasionally
  setInterval(createWonderlandElement, 3000)

  // Create a few elements on load
  for (let i = 0; i < 5; i++) {
    setTimeout(createWonderlandElement, i * 300)
  }
})

