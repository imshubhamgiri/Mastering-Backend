class Playlist implements IterableCollection<string> {
    private readonly songs: string[] = [];
 
    addSong(song: string): void {
        this.songs.push(song);
    }
 
    getSongAt(index: number): string {
        return this.songs[index];
    }
 
    getSize(): number {
        return this.songs.length;
    }
 
    createIterator(): Iterator<string> {
        return new PlaylistIterator(this);
    }
 }
 
 interface IterableCollection<T> {
    createIterator(): Iterator<T>;
 }