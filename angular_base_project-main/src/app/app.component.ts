import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EpisodeService } from './episode.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [EpisodeService]
})
export class AppComponent implements OnInit {
  episodes: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  selectedEpisode: any = null;
  characters: any[] = [];

  constructor(private episodeService: EpisodeService) {}

  ngOnInit() {
    this.loadEpisodes(); 
  }

  loadEpisodes() {
    this.episodeService.getEpisodes(this.currentPage).subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data); 
        this.episodes = data.results || []; 
        this.totalPages = data.info?.pages || 1;
      },
      error: (error) => {
        console.error('Error al cargar episodios:', error); 
        this.episodes = []; 
      }
    });
  }

  selectEpisode(episode: any) {
    this.selectedEpisode = episode;
    this.characters = [];
    if (episode && episode.characters) {
      episode.characters.forEach((characterUrl: string) => {
        this.episodeService.getCharacter(characterUrl).subscribe({
          next: (character) => {
            this.characters.push(character);
          },
          error: (error) => {
            console.error('Error al cargar personaje:', error);
          }
        });
      });
    }
  }

  prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadEpisodes();
    this.selectedEpisode = null;
    this.characters = [];
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.loadEpisodes();
    this.selectedEpisode = null;
    this.characters = [];
  }
}
}