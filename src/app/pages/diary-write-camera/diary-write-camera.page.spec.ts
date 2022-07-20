import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiaryWriteCameraPage } from './diary-write-camera.page';

describe('DiaryWriteCameraPage', () => {
  let component: DiaryWriteCameraPage;
  let fixture: ComponentFixture<DiaryWriteCameraPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiaryWriteCameraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiaryWriteCameraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
