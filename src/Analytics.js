import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-PRTJMJPE00'); 
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};