// src/setupTests.js
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = require('stream/web').ReadableStream;

const customRender = (ui, options) =>
  render(<BrowserRouter>{ui}</BrowserRouter>, options);

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };


