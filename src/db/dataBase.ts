import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/user/entities/user.entity';

export const db = {
  users: [] as User[],
  albums: [] as Album[],
  tracks: [] as Track[],
  artists: [] as Artist[],
  favorites: {
    albums: [] as string[],
    artists: [] as string[],
    tracks: [] as string[],
  } as Favorite,
};
