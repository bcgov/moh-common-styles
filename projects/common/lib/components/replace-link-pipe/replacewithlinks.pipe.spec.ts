import { ReplacewithlinksPipe } from './replacewithlinks.pipe';
import {Pipe, PipeTransform} from '@angular/core';

describe('ReplacewithlinksPipe', () => {
  it('create an instance', () => {
    const pipe = new ReplacewithlinksPipe();
    expect(pipe).toBeTruthy();
  });
});
