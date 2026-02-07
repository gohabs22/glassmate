import { getAuth, Auth } from 'firebase/auth';
import { firebaseApp } from './clientApp';

export const auth: Auth = getAuth(firebaseApp);
