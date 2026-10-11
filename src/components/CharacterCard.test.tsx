import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CharacterCard from '@/components/CharacterCard';
import type { Character } from '@/types/rickandmorty';

describe('CharacterCard', () => {
  const character: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
    location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/32' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1'],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z',
  };

  it('renders the character details and links to the detail page', () => {
    render(<CharacterCard character={character} />);

    expect(screen.getByRole('link', { name: /Rick Sanchez/i })).toHaveAttribute('href', '/character/1');
    expect(screen.getByText(/Alive - Human/i)).toBeInTheDocument();
    expect(screen.getByText(/Citadel of Ricks/i)).toBeInTheDocument();
    expect(screen.getByAltText('Rick Sanchez')).toHaveAttribute('src', character.image);
  });

  it('falls back to the gray status badge for unknown statuses', () => {
    render(<CharacterCard character={{ ...character, status: 'unknown' }} />);

    expect(screen.getByText(/unknown - Human/i)).toBeInTheDocument();
  });
});
