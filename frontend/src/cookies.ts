
//userId gets user id from profile

//user gets jwt token for searching up user data with it


//get cookie value with name
export function getCookie(cookieName: any) {
  let cookie: any = {};
  document.cookie.split(";").forEach(function (el) {
    let [key, value] = el.split("=");
    cookie[key.trim()] = value;
  });
  return cookie[cookieName];
}
