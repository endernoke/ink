import {createContext} from 'react';
import type Ink from '../ink.js';

export const InkContext = createContext<Ink | undefined>(undefined);
