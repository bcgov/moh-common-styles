import { Injectable } from '@angular/core';

@Injectable()
export abstract class AbstractPgCheckService {

  public abstract canBypassGuards(): boolean;
  public abstract isPageComplete( url: string ): boolean;
  public abstract isStartPageVisited(): boolean;
  public abstract isPrerequisiteComplete(): boolean;
  public abstract getStartUrl(): string;
}
