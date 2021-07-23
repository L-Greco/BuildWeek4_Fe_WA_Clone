import { io } from 'socket.io-client';
import {createContext} from "react";

export const SocketContext = createContext()

const ADDRESS = process.env.REACT_APP_BE_URL;
export const socket = io(ADDRESS, { transports: ['websocket'] });