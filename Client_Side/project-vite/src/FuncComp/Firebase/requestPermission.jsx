import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

const requestPermission = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: '' });
    if (currentToken) {
      console.log('Token received: ', currentToken);
    } else {
      console.log('No registration token available.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
};

export default requestPermission;
