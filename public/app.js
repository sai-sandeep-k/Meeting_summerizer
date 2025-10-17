document.addEventListener('DOMContentLoaded', () => {
  const uploadInput = document.getElementById('audio-upload');
  const summarizeBtn = document.getElementById('summarize-btn');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const errorEl = document.getElementById('error');
  const errorMessageEl = document.getElementById('error-message');
  const summaryOutput = document.getElementById('summary-output');
  const transcriptOutput = document.getElementById('transcript-output');

  summarizeBtn.addEventListener('click', async () => {
    const file = uploadInput.files[0];

    if (!file) {
      showError('Please select an audio file first.');
      return;
    }

    loading.classList.remove('hidden');
    results.classList.add('hidden');
    errorEl.classList.add('hidden');
    summarizeBtn.disabled = true;

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Something went wrong');
      }

      const data = await response.json();

      transcriptOutput.textContent = data.transcript;
      renderSummary(data.summary);

      results.classList.remove('hidden');
    } catch (error) {
      console.error('Fetch error:', error);
      showError(error.message);
    } finally {
      loading.classList.add('hidden');
      summarizeBtn.disabled = false;
    }
  });

  function renderSummary(summary) {
    summaryOutput.innerHTML = '';

    if (summary.key_decisions && summary.key_decisions.length > 0) {
      const decisionsTitle = document.createElement('h3');
      decisionsTitle.textContent = 'Key Decisions';
      summaryOutput.appendChild(decisionsTitle);

      const decisionsList = document.createElement('ul');
      summary.key_decisions.forEach(decision => {
        const li = document.createElement('li');
        li.textContent = decision;
        decisionsList.appendChild(li);
      });
      summaryOutput.appendChild(decisionsList);
    }

    if (summary.action_items && summary.action_items.length > 0) {
      const actionsTitle = document.createElement('h3');
      actionsTitle.textContent = 'Action Items';
      summaryOutput.appendChild(actionsTitle);

      const actionsList = document.createElement('ul');
      summary.action_items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.owner}:</strong> ${item.task}`;
        actionsList.appendChild(li);
      });
      summaryOutput.appendChild(actionsList);
    }
  }

  function showError(message) {
    errorMessageEl.textContent = message;
    errorEl.classList.remove('hidden');
  }
});

