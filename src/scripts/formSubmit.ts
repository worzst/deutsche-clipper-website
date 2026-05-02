export function wireForm(
  formId: string,
  successId: string,
  errorId: string,
  labelId: string,
  defaultLabel: string,
): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;
  const success = document.getElementById(successId)!;
  const errorEl = document.getElementById(errorId) as HTMLElement;
  const label = document.getElementById(labelId)!;
  const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    label.textContent = 'Wird gesendet…';
    errorEl.classList.remove('show');

    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.style.display = 'none';
        success.style.display = 'block';
        window.dataLayer?.push({ event: 'form_submit_success' });
      } else {
        throw new Error('server');
      }
    } catch {
      btn.disabled = false;
      label.textContent = defaultLabel;
      errorEl.classList.add('show');
      window.turnstile?.reset();
    }
  });
}
