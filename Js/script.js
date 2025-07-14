const form = document.getElementById('feedbackForm');
const output = document.getElementById('output');
const message = document.getElementById('message');
const charCount = document.getElementById('charCount');

// Live character counter using DOM
message.addEventListener('input', () => {
  charCount.textContent = message.value.length;
});

// Submission Manager Object
const SubmissionManager = {
  submissions: [],
  saveToLocalStorage() {
    localStorage.setItem('feedbacks', JSON.stringify(this.submissions));
  },
  loadFromLocalStorage() {
    const data = localStorage.getItem('feedbacks');
    if (data) this.submissions = JSON.parse(data);
  },
  add(submission) {
    this.submissions.push(submission);
    this.saveToLocalStorage();
  }
};

// Load existing data
SubmissionManager.loadFromLocalStorage();

// Event Listener on form
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const msg = form.message.value.trim();

  // Validation using loop
  for (const field of [name, email, msg]) {
    if (field.length === 0) {
      alert('All fields are required!');
      return;
    }
  }

  // Email format check
  if (!email.includes('@')) {
    alert('Invalid email format.');
    return;
  }

  const newFeedback = { name, email, message: msg };

  // Simulate async saving
  await fakeSaveAsync(newFeedback);

  // Save to localStorage
  SubmissionManager.add(newFeedback);

  // Clear form
  form.reset();
  charCount.textContent = '0';

  showMessage("Feedback submitted successfully!");
});

// Async function simulation
const fakeSaveAsync = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saved:', data);
      resolve();
    }, 500); // simulate delay
  });
};

// Arrow function to show output
const showMessage = (msg) => {
  output.textContent = msg;
};
