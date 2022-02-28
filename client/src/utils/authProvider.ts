/**
 * This represents some generic auth provider API, like Firebase.
 */
const authProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    authProvider.isAuthenticated = true;
    return new Promise((resolve) => {
      setTimeout(callback, 200);
      resolve(this.isAuthenticated);
    })
  },
  signout(callback: VoidFunction) {
    authProvider.isAuthenticated = false;
    setTimeout(callback, 200);
  }
};

export { authProvider };