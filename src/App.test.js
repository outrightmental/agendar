// Copyright (C) 2020 Outright Mental

import {render, screen} from '@testing-library/react';
import App from './App';

test('renders login button', () => {
  render(<App/>);
  const loginButton = screen.getByText(/login with google/i);
  expect(loginButton).toBeInTheDocument();
});
