const form = document.getElementById("shorten-form");
const input = document.getElementById("url-input");
const errorText = document.getElementById("error");
const resultBox = document.getElementById("result");
const shortLink = document.getElementById("short-link");
const copyBtn = document.getElementById("copy-btn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorText.textContent = "";
  resultBox.classList.add("hidden");

  let value = input.value.trim();
  if (!/^https?:\/\//i.test(value)) {
    value = "https://" + value;
  }

  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: value }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorText.textContent = data.error;
      return;
    }

    shortLink.textContent = data.shortUrl;
    shortLink.href = data.shortUrl;
    resultBox.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    errorText.textContent = "Something went wrong. Check the console.";
  }
});

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(shortLink.textContent);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
});