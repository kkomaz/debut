import { toast } from 'react-toastify';
const toggleNotification = (type, message) => {
  return toast[type](message);
}

export default toggleNotification
