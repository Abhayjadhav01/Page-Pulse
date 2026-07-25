(function () {
  'use strict';

  const form = document.getElementById('auditForm');
  const urlInput = document.getElementById('urlInput');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  const errorBox = document.getElementById('errorBox');
  const errorMessage = document.getElementById('errorMessage');
  const reportSection = document.getElementById('reportSection');

  // Stat elements
  const statStatus = document.getElementById('statStatus');
  const statResponseTime = document.getElementById('statResponseTime');
  const statWordCount = document.getElementById('statWordCount');
  const statH1Count = document.getElementById('statH1Count');

  // Detail elements
  const reportUrl = document.getElementById('reportUrl');
  const detailTitle = document.getElementById('detailTitle');
  const detailMetaDesc = document.getElementById('detailMetaDesc');
  const detailMissingAlt = document.getElementById('detailMissingAlt');
  const missingAltCount = document.getElementById('missingAltCount');

  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      btnText.hidden = true;
      btnLoader.hidden = false;
    } else {
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnLoader.hidden = true;
    }
  }

  function showError(message) {
    errorBox.hidden = false;
    errorMessage.textContent = message;
    reportSection.hidden = true;
  }

  function hideError() {
    errorBox.hidden = true;
    errorMessage.textContent = '';
  }

  function getStatusClass(status) {
    if (status >= 200 && status < 300) return 'status-success';
    if (status >= 300 && status < 400) return 'status-warning';
    return 'status-error';
  }

  function renderReport(data) {
    hideError();
    reportSection.hidden = false;

    // Update URL
    reportUrl.textContent = data.url;

    // Stats
    statStatus.textContent = data.status;
    statStatus.className = 'stat-value ' + getStatusClass(data.status);

    statResponseTime.textContent = data.responseTime + 'ms';
    statWordCount.textContent = data.wordCount.toLocaleString();
    statH1Count.textContent = data.h1Count;

    // Details
    detailTitle.textContent = data.title || '(No title tag found)';
    if (!data.title) {
      detailTitle.style.color = 'var(--text-muted)';
      detailTitle.style.fontStyle = 'italic';
    } else {
      detailTitle.style.color = '';
      detailTitle.style.fontStyle = '';
    }

    detailMetaDesc.textContent = data.metaDescription || '(No meta description found)';
    if (!data.metaDescription) {
      detailMetaDesc.style.color = 'var(--text-muted)';
      detailMetaDesc.style.fontStyle = 'italic';
    } else {
      detailMetaDesc.style.color = '';
      detailMetaDesc.style.fontStyle = '';
    }

    // Images missing alt text
    missingAltCount.textContent = data.imagesMissingAltCount;
    if (data.imagesMissingAltCount > 0) {
      missingAltCount.className = 'badge warning';
    } else {
      missingAltCount.className = 'badge';
    }

    if (data.imagesMissingAlt.length > 0) {
      const list = document.createElement('ul');
      data.imagesMissingAlt.forEach(src => {
        const li = document.createElement('li');
        li.textContent = src;
        list.appendChild(li);
      });
      detailMissingAlt.innerHTML = '';
      detailMissingAlt.appendChild(list);
    } else {
      detailMissingAlt.innerHTML = '<em>None — all images have alt text.</em>';
    }
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Reset all previous state before any new request (requirement #4)
    hideError();
    reportSection.hidden = true;

    const rawUrl = urlInput.value.trim();
    if (!rawUrl) {
      showError('Please enter a URL.');
      urlInput.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: rawUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Server returned an error response
        showError(data.error || 'An unknown error occurred.');
        return;
      }

      renderReport(data);
    } catch (err) {
      showError('Network error: Could not reach the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  });

  // Allow Enter key to submit (already default form behavior)
  // Focus input on load
  urlInput.focus();
})();

