(function (root, factory) {
  var checklist = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = checklist;
  } else {
    root.ChecklistProgress = checklist;
    checklist.init();
  }
})(typeof window !== "undefined" ? window : this, function () {
  var HASH_PREFIX = "#checklist=";

  function taskId(label) {
    var normalized = label.trim().replace(/\s+/g, " ");
    var hash = 2166136261;

    for (var index = 0; index < normalized.length; index += 1) {
      hash ^= normalized.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(36);
  }

  function encodeState(ids) {
    return HASH_PREFIX + ids.join(".");
  }

  function decodeState(hash) {
    if (hash.indexOf(HASH_PREFIX) !== 0) {
      return null;
    }

    var value = hash.slice(HASH_PREFIX.length);
    if (value && !/^[a-z0-9]+(?:\.[a-z0-9]+)*$/.test(value)) {
      return null;
    }
    return value ? value.split(".") : [];
  }

  function init() {
    var container = document.getElementById("graduate-checklist-progress");
    var inputs = Array.prototype.slice.call(
      document.querySelectorAll(".page__content .task-list-item input[type='checkbox']")
    );

    if (!container || !inputs.length) {
      return;
    }

    var storageKey = "checklist-progress:" + window.location.pathname;

    inputs.forEach(function (input) {
      var item = input.parentElement;
      input.disabled = false;
      input.dataset.checklistId = taskId(item.textContent);
      input.style.width = "1.2em";
      input.style.height = "1.2em";
      item.style.cursor = "pointer";

      item.addEventListener("click", function (event) {
        if (event.target === input || event.target.closest("a, button")) {
          return;
        }
        input.checked = !input.checked;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });

    function readLocalState() {
      try {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
      } catch (error) {
        return [];
      }
    }

    function checkedIds() {
      return inputs.filter(function (input) {
        return input.checked;
      }).map(function (input) {
        return input.dataset.checklistId;
      });
    }

    function save() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(checkedIds()));
      } catch (error) {
        // The checklist remains usable when browser storage is unavailable.
      }
      updateProgress();
    }

    var sharedState = decodeState(window.location.hash);
    var savedState = sharedState === null ? readLocalState() : sharedState;

    inputs.forEach(function (input) {
      input.checked = savedState.indexOf(input.dataset.checklistId) !== -1;
      input.addEventListener("change", save);
    });

    var progress = document.createElement("strong");
    var shareButton = document.createElement("button");
    var resetButton = document.createElement("button");

    container.className = "notice";
    container.style.display = "flex";
    container.style.gap = ".5rem";
    container.style.alignItems = "center";
    container.style.flexWrap = "wrap";
    progress.style.marginRight = "auto";
    progress.setAttribute("aria-live", "polite");
    shareButton.type = "button";
    shareButton.textContent = "复制进度链接";
    resetButton.type = "button";
    resetButton.textContent = "重置进度";
    container.appendChild(progress);
    container.appendChild(shareButton);
    container.appendChild(resetButton);

    function updateProgress() {
      progress.textContent = "已完成 " + checkedIds().length + " / " + inputs.length;
    }

    function showCopyFallback(url) {
      window.prompt("复制此进度链接：", url);
    }

    shareButton.addEventListener("click", function () {
      var url = window.location.href.split("#")[0] + encodeState(checkedIds());

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          shareButton.textContent = "已复制";
          window.setTimeout(function () {
            shareButton.textContent = "复制进度链接";
          }, 1500);
        }).catch(function () {
          showCopyFallback(url);
        });
      } else {
        showCopyFallback(url);
      }
    });

    resetButton.addEventListener("click", function () {
      if (!window.confirm("确定清空所有已完成项吗？")) {
        return;
      }
      inputs.forEach(function (input) {
        input.checked = false;
      });
      save();
    });

    if (sharedState !== null) {
      save();
    } else {
      updateProgress();
    }
  }

  return {
    decodeState: decodeState,
    encodeState: encodeState,
    init: init,
    taskId: taskId,
  };
});
