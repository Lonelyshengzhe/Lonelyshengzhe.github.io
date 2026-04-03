---
permalink: /notes/
title: "Notes"
excerpt: "Reading notes and technical write-ups"
author_profile: false
---

{% assign sorted_posts = site.posts | sort: "date" | reverse %}

## Notes

{% if sorted_posts and sorted_posts.size > 0 %}
{% capture all_tags_blob %}
{% for post in sorted_posts %}
  {% if post.tags %}
    {% for tag in post.tags %}
{{ tag | strip | downcase }}|||
    {% endfor %}
  {% endif %}
{% endfor %}
{% endcapture %}
{% assign all_tags = all_tags_blob | split: '|||' | sort | uniq %}

<div class="notes-filter" id="notes-filter">
  <label class="notes-search-label" for="notes-search">Search notes</label>
  <div class="notes-search-row">
    <input id="notes-search" class="notes-search-input" type="search" placeholder="Search by title or excerpt...">
    <button id="notes-clear-btn" class="notes-clear-btn" type="button">Clear</button>
  </div>
  <div class="notes-tags" id="notes-tags">
    <button class="notes-tag-btn is-active" type="button" data-tag="all">All</button>
    {% for tag in all_tags %}
      {% assign clean_tag = tag | strip %}
      {% if clean_tag != "" %}
        <button class="notes-tag-btn" type="button" data-tag="{{ clean_tag }}">{{ clean_tag }}</button>
      {% endif %}
    {% endfor %}
  </div>
</div>

<p class="notes-empty-result" id="notes-empty-result" hidden>No notes match your search or selected tag.</p>

<div class="notes-grid" id="notes-grid">
  {% for post in sorted_posts %}
    {% assign note_link = post.url | relative_url %}
    {% assign raw_excerpt = post.excerpt | default: post.content %}
    {% assign preview_text = raw_excerpt | strip_html | strip_newlines | truncatewords: 30 %}
    {% assign note_tags = "" %}
    {% if post.tags %}
      {% assign note_tags = post.tags | join: "|" | downcase %}
    {% endif %}
    {% assign thumbnail_src = "" %}
    {% if post.thumbnail %}
      {% if post.thumbnail contains '://' %}
        {% assign thumbnail_src = post.thumbnail %}
      {% else %}
        {% assign thumbnail_src = post.thumbnail | relative_url %}
      {% endif %}
    {% endif %}
    <article class="note-card{% if post.thumbnail %} note-card--with-cover{% endif %}" data-title="{{ post.title | downcase | escape }}" data-excerpt="{{ preview_text | downcase | escape }}" data-tags="{{ note_tags | escape }}">
      {% if post.thumbnail %}
        <a class="note-card-image" href="{{ note_link }}">
          <img src="{{ thumbnail_src }}" alt="{{ post.title }} cover">
        </a>
      {% endif %}
      <div class="note-card-body">
        <h3 class="note-title">
          <a href="{{ note_link }}">{{ post.title }}</a>
        </h3>
        <p class="note-meta">{{ post.date | date: "%Y-%m-%d" }}</p>
        {% if post.tags %}
          <p class="note-tags">
            {% for tag in post.tags %}
              <span class="note-tag">{{ tag }}</span>
            {% endfor %}
          </p>
        {% endif %}
        <p class="note-excerpt">{{ preview_text }}</p>
        <a class="note-readmore" href="{{ note_link }}">Read more</a>
      </div>
    </article>
  {% endfor %}
</div>

<script>
  (function () {
    var searchInput = document.getElementById("notes-search");
    var clearBtn = document.getElementById("notes-clear-btn");
    var tagsWrap = document.getElementById("notes-tags");
    var emptyHint = document.getElementById("notes-empty-result");
    var cards = Array.prototype.slice.call(document.querySelectorAll("#notes-grid .note-card"));

    if (!searchInput || !tagsWrap || cards.length === 0) {
      return;
    }

    var activeTag = "all";

    function normalize(text) {
      return (text || "").toLowerCase().trim();
    }

    function applyFilters() {
      var query = normalize(searchInput.value);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var title = normalize(card.getAttribute("data-title"));
        var excerpt = normalize(card.getAttribute("data-excerpt"));
        var tagsRaw = normalize(card.getAttribute("data-tags"));
        var tags = tagsRaw ? tagsRaw.split("|") : [];

        var matchesSearch = !query || (title + " " + excerpt).indexOf(query) !== -1;
        var matchesTag = activeTag === "all" || tags.indexOf(activeTag) !== -1;
        var show = matchesSearch && matchesTag;

        card.classList.toggle("note-card--hidden", !show);
        card.setAttribute("aria-hidden", String(!show));
        if (show) {
          visibleCount += 1;
        }
      });

      if (emptyHint) {
        emptyHint.classList.toggle("notes-empty-result--hidden", visibleCount !== 0);
      }
    }

    tagsWrap.addEventListener("click", function (event) {
      var target = event.target ? event.target.closest(".notes-tag-btn") : null;
      if (!target) {
        return;
      }

      activeTag = normalize(target.getAttribute("data-tag")) || "all";

      var buttons = tagsWrap.querySelectorAll(".notes-tag-btn");
      buttons.forEach(function (btn) {
        btn.classList.toggle("is-active", btn === target);
      });

      applyFilters();
    });

    searchInput.addEventListener("input", applyFilters);

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        searchInput.value = "";
        activeTag = "all";

        var buttons = tagsWrap.querySelectorAll(".notes-tag-btn");
        buttons.forEach(function (btn) {
          btn.classList.toggle("is-active", normalize(btn.getAttribute("data-tag")) === "all");
        });

        applyFilters();
        searchInput.focus();
      });
    }

    applyFilters();
  })();
</script>
{% else %}
No notes yet. Add a markdown file to `_posts/` to publish your first note.
{% endif %}
