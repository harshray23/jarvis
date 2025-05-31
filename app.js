const btn = document.querySelector(".talk");
const content = document.querySelector(".content");

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.volume = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function wishMe() {
  const hour = new Date().getHours();
  let greet = "";

  if (hour < 12) greet = "Good Morning!";
  else if (hour < 17) greet = "Good Afternoon!";
  else greet = "Good Evening!";

  speak(`Initializing JARVIS... ${greet}`);
}

window.addEventListener("load", wishMe);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  content.textContent = transcript;
  takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
  content.textContent = "Listening...";
  recognition.start();
});

function takeCommand(message) {
  if (message.includes("hello") || message.includes("hey")) {
    speak("Hello, how can I help you?");
  } else if (message.includes("how are you")) {
    speak("I am fine, thank you.");
  } else if (message.includes("what is the time")) {
    const time = new Date().toLocaleTimeString();
    speak("The time is " + time);
  } else if (message.includes("what is the date")) {
    const date = new Date().toDateString();
    speak("Today's date is " + date);
  } else if (message.includes("weather")) {
    getWeather();
  } else if (message.includes("play")) {
    const searchTerm = message.replace("play", "").trim();
    const url = `https://www.youtube.com/results?search_query=${searchTerm}`;
    speak("Playing " + searchTerm + " on YouTube.");
    window.open(url, "_blank");
  } else if (message.startsWith("search for")) {
    const query = message.replace("search for", "").trim();
    speak("Searching Google for " + query);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  } else if (
    message.includes("who is") ||
    message.includes("what is") ||
    message.includes("tell me about") ||
    message.includes("define")
  ) {
    getAIAnswer(message);
  } else {
    speak("Sorry, I didn't understand. You can say: tell me about India, play music, or ask weather.");
  }
}

// 🔍 Smart Answer with Web Search (But Voice Only)
function getAIAnswer(query) {
  fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`)
    .then((res) => res.json())
    .then((data) => {
      if (data.AbstractText) {
        speak(data.AbstractText);
      } else {
        speak("I found this on the internet.");
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
      }
    })
    .catch(() => {
      speak("Sorry, I couldn't find any information.");
    });
}

// ☁️ Weather Feature (OpenWeatherMap API)
function getWeather() {
  const apiKey = "your_api_key_here"; // Replace with your actual API key
  const city = "Kolkata"; // Or dynamically fetch via voice
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === 200) {
        const temp = data.main.temp;
        const desc = data.weather[0].description;
        speak(`The weather in ${city} is ${desc} with a temperature of ${temp} degrees Celsius.`);
      } else {
        speak("I could not get the weather data.");
      }
    })
    .catch(() => {
      speak("Sorry, I couldn't fetch the weather.");
    });
}
