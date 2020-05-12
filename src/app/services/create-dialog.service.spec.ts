import { TestBed } from '@angular/core/testing';

import { CreateDialogService } from './create-dialog.service';

describe('CreateDialogService', () => {
  let service: CreateDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
