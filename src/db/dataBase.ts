import { Artist } from 'src/artist/entities/artist.entity';
import { User } from 'src/user/entities/user.entity';

export const db = {
  users: [] as User[],
  albums: [],
  tracks: [],
  artists: [] as Artist[],
  favorites: {
    albums: [],
    artists: [],
    tracks: [],
  },
};
