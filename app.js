import { loadAuth, login, logout } from './src/auth'


window.login = login;
window.logout = logout;
window.onload = loadAuth;

