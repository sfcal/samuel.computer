import { Buffer } from 'buffer';

// Set up Buffer polyfill immediately
(globalThis as any).Buffer = Buffer;
(window as any).Buffer = Buffer;