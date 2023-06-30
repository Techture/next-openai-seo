import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../pages/index';
import '@testing-library/jest-dom';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);

    const headingText =
      /An AI-powered SAAS solution that generates SEO-optimized blog posts in minutes/i;
    const heading = screen.getByText(headingText);

    expect(heading).toBeInTheDocument();
  });
});
