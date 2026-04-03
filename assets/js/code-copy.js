(function () {
  function copyWithFallback(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        var ok = document.execCommand("copy");
        if (ok) {
          resolve();
        } else {
          reject(new Error("copy command failed"));
        }
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  function setButtonStatus(button, text, className) {
    var originalText = button.dataset.originalText || "Copy";
    button.textContent = text;
    button.classList.remove("is-copied", "is-failed");
    if (className) {
      button.classList.add(className);
    }

    window.setTimeout(function () {
      button.textContent = originalText;
      button.classList.remove("is-copied", "is-failed");
    }, 1400);
  }

  function attachCopyButtons() {
    var blocks = document.querySelectorAll("div.highlighter-rouge, figure.highlight");
    blocks.forEach(function (block) {
      if (block.querySelector(".code-copy-button")) {
        return;
      }

      var code = block.querySelector("pre code");
      if (!code) {
        return;
      }

      var button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy-button";
      button.dataset.originalText = "Copy";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code to clipboard");

      button.addEventListener("click", function () {
        copyWithFallback(code.innerText)
          .then(function () {
            setButtonStatus(button, "Copied", "is-copied");
          })
          .catch(function () {
            setButtonStatus(button, "Failed", "is-failed");
          });
      });

      block.classList.add("has-copy-button");
      block.appendChild(button);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachCopyButtons);
  } else {
    attachCopyButtons();
  }
})();
