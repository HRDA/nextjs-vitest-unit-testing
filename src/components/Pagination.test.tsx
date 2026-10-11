import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Pagination from '@/components/Pagination';

describe('Pagination', () => {
  it('shows disabled state on the first page and active navigation on the next page', () => {
    const { rerender } = render(<Pagination currentPage={1} totalPages={5} />);

    expect(screen.getByText(/Page 1 of 5/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Next/i })).toHaveAttribute('href', '/?page=2');
    expect(screen.getByText(/Previous/i).tagName).toBe('SPAN');

    rerender(<Pagination currentPage={2} totalPages={5} />);

    expect(screen.getByRole('link', { name: /Previous/i })).toHaveAttribute('href', '/?page=1');
    expect(screen.getByRole('link', { name: /Next/i })).toHaveAttribute('href', '/?page=3');
  });

  it('disables the next link on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} />);

    expect(screen.getByRole('link', { name: /Previous/i })).toHaveAttribute('href', '/?page=4');
    expect(screen.getByText(/Next/i).tagName).toBe('SPAN');
  });
});
