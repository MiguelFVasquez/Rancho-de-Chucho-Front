import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../dto/message';
import { kindDishRead } from '../dto/category-dish/categoryReadDto';
import { MessageDTO } from '../dto/messageDto';

@Injectable({
  providedIn: 'root'
})
export class TipoPlatoService {
  private apiURL = 'http://localhost:8086/api/tipoPlato';  
  
  
  constructor(private http:HttpClient) { }

  //Method to get all kind of dishses
  getAllKindDishs():Observable<MessageDTO<kindDishRead[]>>{
      return this.http.get<MessageDTO<kindDishRead[]>>(`${this.apiURL}/getAll`);
  }
    


}
