import { TestBed } from '@angular/core/testing';

import { TimeDialogService } from './time-dialog.service';

describe('TimeDialogService', () => {
  let service: TimeDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
