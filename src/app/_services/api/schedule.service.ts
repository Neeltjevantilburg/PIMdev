import { Injectable } from '@angular/core';
import { Json } from '../../shared/model/json';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  schedules: Json[] = [
    {id: "sched40", naam: "Rooster 40 uur"},
    {id: "sched32", naam: "Rooster 32 uur"},
    {id: "sched24", naam: "Rooster 24 uur"}
  ];

  constructor( ) { }

  getSchedule(id?: string) {
    let obj: Json;
    let schedule = this.schedules.find(schedule => schedule.id === id);

    if (!schedule) {   
      return {error: `schedule with id ${id} not found`};
    };
    
    obj = schedule;
    return obj;
  }

  getAllEmployeesSchedules() {
    return this.schedules;
  }

}
