import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { environment } from '@environments/environment';
import { lastValueFrom } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GameData, GameTicketPrizeData, PrizeLn } from '@interfaces/game.interface';
import { GameCodes } from '@enums/global.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiGame = `${environment.api.host}${'/game'}`;

  constructor(
    private readonly apiSrv: ApiService,
    private readonly router: Router
  ) {}

  public async getAllGamesByCodeOnlyWithPrizes(code: GameCodes, limit = 10, offset = 0, minDays = 0, maxDays = 0): Promise<GameData[] | []> {
    try {
      const games$ = this.apiSrv.get<GameData[]>(`${this.apiGame}?limit=${limit}&offset=${offset}&code=${code}&onlyWithPrizes=true&minDays=${minDays}&maxDays=${maxDays}`);
      const games: GameData[] = await lastValueFrom(games$);
      return games;
    } catch (error) {
      return [];
    }
  }

  public async getAllTicketsPrizesByUser(limit = 10, offset = 0): Promise<GameTicketPrizeData[] | []> {
    try {
      const userTicketsPrizeData$ = this.apiSrv.get<GameTicketPrizeData[]>(`${this.apiGame}/ticket/all?limit=${limit}&offset=${offset}`);
      const userTicketsPrizeData: GameTicketPrizeData[] = await lastValueFrom(userTicketsPrizeData$)
      return userTicketsPrizeData;
    } catch (error) {
      return [];
    }
  };

  public async getTicketPrizeByTicketId(ticketId: string): Promise<GameTicketPrizeData | null> {
    try {
      const ticketPrizeData$ = this.apiSrv.get<GameTicketPrizeData>(`${this.apiGame}/ticket/${ticketId}`);
      const ticketPrizeData: GameTicketPrizeData = await lastValueFrom(ticketPrizeData$);
      return ticketPrizeData;
    } catch (error) {
      throw error;
    }
  }

  public openGame(game: GameData, number: string = ''): void {
    if (game.data.info.prizes.length) {
      this.router.navigate(['/main/', 'game-detail-' + game.code], {
        state: {
          game,
          number
        },
      });
    }
  }

  /*
  LN
  */
  public async checkPrizeByNumberLN(gameId: string, number: string): Promise<PrizeLn[]> {
    try {
      const prizeLn$ = this.apiSrv.get<PrizeLn[]>(`${this.apiGame}/ln/${gameId}/${number}`);
      const prizeLn: PrizeLn[] = await lastValueFrom(prizeLn$);
      return prizeLn;
    } catch (error) {
      throw error;
    }
  }
}
