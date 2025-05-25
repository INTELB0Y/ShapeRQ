export function getXsrfToken() {
  const cookieToken = "csrftoken";
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieToken) {
      return decodeURIComponent(value);
    }
  }
  return null;
}
