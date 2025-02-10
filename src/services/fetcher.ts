export const fetcher = (endpoint: string) =>
  fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
    method: 'GET',
    credentials: 'include'
  }).then((res) => res.json());

export const postFetcher = (endpoint: string, body: any) =>
  fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then((res) => {
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  });
