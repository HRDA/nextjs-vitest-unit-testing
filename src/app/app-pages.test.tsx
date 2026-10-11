import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorUI from '@/app/error';
import RootLayout from '@/app/layout';
import Loading from '@/app/loading';
import CharacterPage from '@/app/character/[id]/page';
import Home from '@/app/page';
import { getCharacter, getCharacters, getEpisodes } from '@/lib/api';
import type { Character } from '@/types/rickandmorty';

vi.mock('@/lib/api', () => ({
  getCharacters: vi.fn(),
  getCharacter: vi.fn(),
  getEpisodes: vi.fn(),
}));

describe('Application pages', () => {
  const mockCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
    location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/32' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1', 'https://rickandmortyapi.com/api/episode/2'],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z',
  };

  beforeEach(() => {
    vi.mocked(getCharacters).mockResolvedValue({
      info: { count: 2, pages: 2, next: null, prev: null },
      results: [mockCharacter],
    });
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(getEpisodes).mockResolvedValue([
      { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01', characters: [], url: '', created: '2017-11-04T18:48:46.250Z' },
      { id: 2, name: 'Lawnmower Dog', air_date: 'December 9, 2013', episode: 'S01E02', characters: [], url: '', created: '2017-11-04T18:48:46.250Z' },
    ]);
  });

  it('renders the home page with metadata and character cards', async () => {
    const ui = await Home({ searchParams: Promise.resolve({ page: '1' }) });

    render(ui);

    expect(screen.getByRole('heading', { name: /Rick and Morty Characters/i })).toBeInTheDocument();
    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
    expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
  });

  it('uses page 1 when searchParams does not include a page value', async () => {
    const ui = await Home({ searchParams: Promise.resolve({}) });

    render(ui);

    expect(vi.mocked(getCharacters)).toHaveBeenLastCalledWith(1);
  });

  it('renders the character detail page with episode badges', async () => {
    const ui = await CharacterPage({ params: Promise.resolve({ id: '1' }) });

    render(ui);

    expect(screen.getByRole('link', { name: /Back to Characters/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('heading', { name: /Rick Sanchez/i })).toBeInTheDocument();
    expect(screen.getByText(/Alive - Human/i)).toBeInTheDocument();
    expect(screen.getByText(/S01E01/i)).toBeInTheDocument();
    expect(screen.getByText(/S01E02/i)).toBeInTheDocument();
  });

  it('renders the loading state shell', () => {
    const { container } = render(<Loading />);

    expect(container.firstChild).not.toBeNull();
  });

  it('renders the error state and calls reset', () => {
    const reset = vi.fn();

    render(<ErrorUI error={new Error('Boom')} reset={reset} />);

    expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('renders the application layout shell', () => {
    render(
      <RootLayout>
        <div>Child content</div>
      </RootLayout>,
    );

    expect(screen.getByRole('link', { name: /Rick & Morty App/i })).toHaveAttribute('href', '/');
    expect(screen.getByText(/Data provided by/i)).toBeInTheDocument();
    expect(screen.getByText(/Child content/i)).toBeInTheDocument();
  });
});
