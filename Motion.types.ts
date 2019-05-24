import { ReactNode } from 'react';

export type ArrayType = Array<any>;
export type ScrollType = number | void;
export type ReactNodeType = ReactNode

export type StyleType = { [key: string]: string | number | StyleType };

export type ClassNameType = { [key: string]: boolean };

export type TabsContentType = Array<{ header: string, content: ReactNodeType }>;
