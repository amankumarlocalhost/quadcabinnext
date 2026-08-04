const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://quadcabinbackend.vercel.app').replace(/\/$/, '');

export async function submitQuoteForm(form, sourcePage) {
  const data = new FormData(form);
  const response = await fetch(`${API_BASE}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.get('name'),
      phone: data.get('phone'),
      email: data.get('email'),
      product: data.get('product'),
      message: data.get('message') || '',
      sourcePage,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Your request could not be sent. Please try again.');
  return payload;
}
