import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { buildApiUrl } from '../config/api.config';

export interface ProviderTask {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

export interface SaveProviderTaskInput {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

interface BackendTask {
  id: number;
  title: string;
  description: string;
  price: number | string;
}

interface CreateTaskDto {
  title: string;
  description: string;
  price: number;
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  price?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProviderTaskApiService {
  private http = inject(HttpClient);

  getProviderTasks$(): Observable<ProviderTask[]> {
    return this.http.get<BackendTask[]>(buildApiUrl('/task')).pipe(
      map((tasks) => tasks.map((task) => this.toProviderTask(task)))
    );
  }

  createProviderTask$(input: SaveProviderTaskInput): Observable<ProviderTask> {
    const payload: CreateTaskDto = {
      title: input.name.trim(),
      description: input.description.trim(),
      price: Number(input.price),
    };
    return this.http
      .post<BackendTask>(buildApiUrl('/task'), payload)
      .pipe(map((task) => this.toProviderTask(task, input.durationMinutes)));
  }

  updateProviderTask$(taskId: string, input: SaveProviderTaskInput): Observable<ProviderTask> {
    const payload: UpdateTaskDto = {
      title: input.name.trim(),
      description: input.description.trim(),
      price: Number(input.price),
    };
    return this.http
      .put<BackendTask>(buildApiUrl(`/task/${taskId}`), payload)
      .pipe(map((task) => this.toProviderTask(task, input.durationMinutes)));
  }

  deleteProviderTask$(taskId: string): Observable<void> {
    return this.http.delete<void>(buildApiUrl(`/task/${taskId}`));
  }

  private toProviderTask(task: BackendTask, fallbackDurationMinutes = 60): ProviderTask {
    return {
      id: String(task.id),
      name: task.title,
      description: task.description,
      durationMinutes: fallbackDurationMinutes,
      price: Number(task.price),
    };
  }
}
