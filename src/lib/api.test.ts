import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCharacter, getCharacters, getEpisodes } from '@/lib/api';

describe('API utilities', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches the character list for a given page', async () => {
    const payload = {
      info: { count: 2, pages: 2, next: null, prev: null },
      results: [{ id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human' }],
    };

    mockFetch.mockResolvedValue({ ok: true, json: async () => payload });

    await expect(getCharacters(2)).resolves.toEqual(payload);
    expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=2');
  });

  it('throws when the character list request fails', async () => {
    mockFetch.mockResolvedValue({ ok: false });

    await expect(getCharacters()).rejects.toThrow('Failed to fetch characters');
  });

  it('fetches a single character by id', async () => {
    const payload = {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      episode: ['https://rickandmortyapi.com/api/episode/1'],
    };

    mockFetch.mockResolvedValue({ ok: true, json: async () => payload });

    await expect(getCharacter('1')).resolves.toEqual(payload);
    expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1');
  });

  it('throws when a single character request fails', async () => {
    mockFetch.mockResolvedValue({ ok: false });

    await expect(getCharacter('99')).rejects.toThrow('Failed to fetch character details');
  });

  it('returns an empty array when no episode ids are passed', async () => {
    await expect(getEpisodes([])).resolves.toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('normalizes a single episode response into an array', async () => {
    const episode = { id: 1, name: 'Pilot', air_date: 'Dec 2 2013', episode: 'S01E01' };
    mockFetch.mockResolvedValue({ ok: true, json: async () => episode });

    await expect(getEpisodes(['1'])).resolves.toEqual([episode]);
    expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1');
  });

  it('returns multiple episode entries when the API returns an array', async () => {
    const episodes = [
      { id: 1, name: 'Pilot', air_date: 'Dec 2 2013', episode: 'S01E01' },
      { id: 2, name: 'Lawnmower Dog', air_date: 'Dec 9 2013', episode: 'S01E02' },
    ];

    mockFetch.mockResolvedValue({ ok: true, json: async () => episodes });

    await expect(getEpisodes(['1', '2'])).resolves.toEqual(episodes);
  });

  it('throws when the episode request fails', async () => {
    mockFetch.mockResolvedValue({ ok: false });

    await expect(getEpisodes(['1'])).rejects.toThrow('Failed to fetch episodes');
  });
});
