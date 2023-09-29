const accessToken = "admin_access_token";
const refreshToken = "admin_refresh_token";

export function hasStorageJwtToken() {
  return !!localStorage.getItem(accessToken);
}

export function removeStorageJwtToken() {
  localStorage.removeItem(accessToken);
}

export function setStorageJwtToken(token: string) {
  localStorage.setItem(accessToken, token);
}

export function getStorageJwtToken() {
  return localStorage.getItem(accessToken);
}
//

export function hasStorageRefreshToken() {
  return !!localStorage.getItem(refreshToken);
}

export function removeStorageRefreshToken() {
  localStorage.removeItem(refreshToken);
}

export function setStorageRefreshToken(token: string) {
  localStorage.setItem(refreshToken, token);
}

export function getStorageRefreshToken() {
  return localStorage.getItem(refreshToken);
}

//

export function removeStorageRememberMe() {
  localStorage.removeItem("isRemember");
}

export function setStorageRememberMe(isRemember: boolean) {
  localStorage.setItem("isRemember", isRemember.toString());
}

export function getStorageRememberMe() {
  return JSON.parse(localStorage.getItem("isRemember") || "false");
}

// cookie

export function getCookie(cname: string) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function setCookie(cname: string, cvalue: string, exdays = 365) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function removeCookie(cname: string) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function createSessionCookie(cname: string, cvalue: string) {
  document.cookie = cname + "=" + cvalue + ";path=/";
}
