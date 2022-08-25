import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { PopCalendarComponent } from '../pop-calendar/pop-calendar.component';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
Chart.register(...registerables);

@Component({
  selector: 'app-plant-report',
  templateUrl: './plant-report.page.html',
  styleUrls: ['./plant-report.page.scss'],
})
export class PlantReportPage implements OnInit {
  @ViewChild('temWeek', { static: false }) temWeek: ElementRef;
  @ViewChild('illuminWeek', { static: false }) illuminWeek: ElementRef;
  @ViewChild('waterWeek', { static: false }) waterWeek: ElementRef;
  @ViewChild('temMonth', { static: false }) temMonth: ElementRef;
  @ViewChild('illuminMonth', { static: false }) illuminMonth: ElementRef;
  @ViewChild('waterMonth', { static: false }) waterMonth: ElementRef;

  userId: string = localStorage.getItem('userId');
  selectedDate: string = '';
  plantData$: Observable<any>;
  weekPlants$: Observable<any>;
  monthPlants$: Observable<any>;

  // 차트의 값을 받을 변수
  week: any = {
    soil: '',
    light: '',
    temperature: '',
  };
  month: any = {
    soil: '',
    light: '',
    temperature: '',
  };

  // 차트 이름 변수
  weekTemperature: any;
  weekLight: any;
  weekSoil: any;
  monthTemperature: any;
  monthLight: any;
  monthSoil: any;

  label: Array<string> = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
  ];

  weekLabel: Array<string> = ['월', '화', '수', '목', '금', '토', '일'];

  segment: string = '주간';

  constructor(
    private dialog: MatDialog,
    private navController: NavController,
    private route: ActivatedRoute,
    private db: DbService,
    private common: CommonService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params.selectedDate) {
        this.selectedDate = params.selectedDate;
      } else {
        this.selectedDate = this.common.formatDate(new Date());
      }
      this.getData();
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.weekTem();
      this.weekIllumin();
      this.weekWaterChart();
      this.monthTem();
      this.monthIllumin();
      this.monthWater();
    }, 10);
  }

  getData() {
    this.plantData$ = this.db.collection$(`plantData`, ref => ref.where('userId', '==', this.userId));

    // 그 주의 월요일부터 일요일까지의 값을 가져온다.
    this.weekPlants$ = this.plantData$.pipe(
      map((dates: any) => {
        const startDate: string = this.getMondayDate(this.selectedDate);
        const endDate: string = this.getSundayDate(startDate);

        return dates.filter((ele: any) => {
          const plantDate: string = this.common.formatDate(ele.dateCreated);
          return plantDate >= startDate && plantDate <= endDate;
        });
      })
    );

    this.weekPlants$.subscribe(weekPlants => {
      console.log('weekPlants', weekPlants);

      if (weekPlants.length == 0) {
        this.week.soil = '';
        this.week.temperature = '';
        this.week.light = '';
      } else {
        weekPlants.forEach((data: any) => {
          this.week.soil = data.soil;
          this.week.temperature = data.temperature;
          this.week.light = data.light;
        });
      }
      if (this.weekTemperature) {
        this.addData(this.weekTemperature, this.week.temperature);
      }

      if (this.weekLight) {
        this.addData(this.weekLight, this.week.light);
      }

      if (this.weekSoil) {
        this.addData(this.weekSoil, this.week.soil);
      }
    });

    // 그 값의 한달 전체 값을 가져온다
    this.monthPlants$ = this.plantData$.pipe(
      map((dates: any) => {
        const startDate: string = this.getMonthFirstDate(this.selectedDate);
        const endDate: string = this.getMonthLastDate(this.selectedDate);

        return dates.filter((ele: any) => {
          const plantDate: string = this.common.formatDate(ele.dateCreated);
          return plantDate >= startDate && plantDate <= endDate;
        });
      })
    );

    this.monthPlants$.subscribe(monthPlants => {
      console.log('monthPlants', monthPlants);
      if (monthPlants.length == 0) {
        this.month.soil = '';
        this.month.temperature = '';
        this.month.light = '';
      } else {
        monthPlants.forEach((data: any) => {
          this.month.soil = data.soil;
          this.month.temperature = data.temperature;
          this.month.light = data.light;
        });
      }

      if (this.monthTemperature) {
        this.addData(this.monthTemperature, this.month.temperature);
      }

      if (this.monthLight) {
        this.addData(this.monthLight, this.month.light);
      }

      if (this.monthSoil) {
        this.addData(this.monthSoil, this.month.soil);
      }
    });
  }

  // 날짜 변경없이 주간 월간만 변경되어도 데이터를 받아서 처리
  segmentChange() {
    if (this.segment == '주간') {
      this.weekPlants$.subscribe(weekPlants => {
        console.log('weekPlants', weekPlants);

        if (weekPlants.length == 0) {
          this.week.soil = '';
          this.week.temperature = '';
          this.week.light = '';
        } else {
          weekPlants.forEach((data: any) => {
            this.week.soil = data.soil;
            this.week.temperature = data.temperature;
            this.week.light = data.light;
          });
        }

        if (this.weekTemperature) {
          this.addData(this.weekTemperature, this.week.temperature);
        }

        if (this.weekLight) {
          this.addData(this.weekLight, this.week.light);
        }

        if (this.weekSoil) {
          this.addData(this.weekSoil, this.week.soil);
        }
      });
    }
    if (this.segment == '월간') {
      this.monthPlants$.subscribe(monthPlants => {
        console.log('monthPlants', monthPlants);
        if (monthPlants.length == 0) {
          this.month.soil = '';
          this.month.temperature = '';
          this.month.light = '';
        } else {
          monthPlants.forEach((data: any) => {
            this.month.soil = data.soil;
            this.month.temperature = data.temperature;
            this.month.light = data.light;
          });
        }

        if (this.monthTemperature) {
          this.addData(this.monthTemperature, this.month.temperature);
        }

        if (this.monthLight) {
          this.addData(this.monthLight, this.month.light);
        }

        if (this.monthSoil) {
          this.addData(this.monthSoil, this.month.soil);
        }
      });
    }
  }

  // 보고서의 달력의 날이 변할때 마다 차트를 업데이트 하기위해서 사용
  addData(chart: any, data: string) {
    if (this.segment == '주간') {
      chart.options.scales.x1.ticks.callback = function (value: number) {
        if (this.getLabelForValue(value) == '월') {
          return `${data[0] ? data[0] : ''}`;
        }
        if (this.getLabelForValue(value) == '화') {
          return `${data[1] ? data[1] : ''}`;
        }
        if (this.getLabelForValue(value) == '수') {
          return `${data[2] ? data[2] : ''}`;
        }
        if (this.getLabelForValue(value) == '목') {
          return `${data[3] ? data[3] : ''}`;
        }
        if (this.getLabelForValue(value) == '금') {
          return `${data[4] ? data[4] : ''}`;
        }
        if (this.getLabelForValue(value) == '토') {
          return `${data[5] ? data[5] : ''}`;
        }
        if (this.getLabelForValue(value) == '일') {
          return `${data[6] ? data[6] : ''}`;
        } else {
          return this.getLabelForValue(value);
        }
      };
    } else {
      // 월간
      chart.options.scales.x1.ticks.callback = function (value: number) {
        for (let i = 0; i < 32; i++) {
          if (this.getLabelForValue(value) == i) {
            return `${data[i - 1] ? data[i - 1] : ''}`;
          }
        }
      };
    }

    chart.data.datasets.forEach((dataset: any) => {
      dataset.data = data;
    });

    chart.update();
  }

  // 특정일자(yyyy-mm-dd)에 해당하는 주차의 월요일 구하기
  getMondayDate(d: string) {
    const paramDate = new Date(d);
    const day = paramDate.getDay();
    const diff = paramDate.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(paramDate.setDate(diff)).toISOString().substring(0, 10);
  }

  // 월요일 기준으로 해당 일요일 구하기
  getSundayDate(d: string) {
    const newDate = new Date(d);
    newDate.setDate(newDate.getDate() + 6);
    return this.common.formatDate(newDate);
  }

  // 선택된 달의 첫날 구하기
  getMonthFirstDate(d: string) {
    const newDate = new Date(d);
    const firstDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    return this.common.formatDate(firstDate);
  }

  // 선택된 달의 마지막날 구하기
  getMonthLastDate(d: string) {
    const newDate = new Date(d);
    const lastDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    return this.common.formatDate(lastDate);
  }

  //주간 온도 차트
  weekTem() {
    this.weekTemperature = new Chart(this.temWeek.nativeElement, {
      type: 'bar',
      data: {
        labels: this.weekLabel,
        datasets: [
          {
            label: '온도',
            data: this.week.temperature,
            backgroundColor: '#EDC3C9',
            borderColor: '#DB7F8C',
            maxBarThickness: 45,
            barPercentage: 1.2,
          },
        ],
      },
      options: {
        responsive: true,

        elements: {
          point: {
            pointStyle: 'rectRot',
          },
          bar: {
            borderWidth: {
              top: 3,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: false,
          },

          title: {
            display: false,
          },
        },

        scales: {
          x: {
            title: { display: true, align: 'start', text: '(℃)', font: { size: 8 }, padding: 0 },

            grid: {
              display: false,
              borderWidth: 0,
            },

            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,
            },
          },

          x1: {
            position: 'top',
            grid: {
              display: false,
              borderWidth: 0,
            },

            ticks: {
              font: { size: 8 },
              color: '#161616',
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '월') {
                  return '';
                }
                if (this.getLabelForValue(value) == '화') {
                  return '';
                }
                if (this.getLabelForValue(value) == '수') {
                  return '';
                }
                if (this.getLabelForValue(value) == '목') {
                  return '';
                }
                if (this.getLabelForValue(value) == '금') {
                  return '';
                }
                if (this.getLabelForValue(value) == '토') {
                  return '';
                }
                if (this.getLabelForValue(value) == '일') {
                  return '';
                } else {
                  return this.getLabelForValue(value);
                }
              },
            },
          },

          y: {
            type: 'linear',
            display: false,
            position: 'left',
            min: 0,
            max: 100,

            ticks: { display: false, stepSize: 100 },

            grid: {
              drawTicks: false,
              drawBorder: false,
              drawOnChartArea: false,
            },
          },
        },
      },
    });
  }

  //주간 조도 차트
  weekIllumin() {
    this.weekLight = new Chart(this.illuminWeek.nativeElement, {
      type: 'bar',
      data: {
        labels: this.weekLabel,
        datasets: [
          {
            label: '조도',
            data: this.week.light,
            backgroundColor: '#FFF9D5',
            borderColor: '#FFDC30',
            maxBarThickness: 45,
            barPercentage: 1.2,
          },
        ],
      },
      options: {
        responsive: true,

        elements: {
          point: {
            pointStyle: 'rectRot',
          },
          bar: {
            borderWidth: {
              top: 3,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: false,
          },

          title: {
            display: false,
          },
        },

        scales: {
          x: {
            title: { display: true, align: 'start', text: '(℃)', font: { size: 8 }, padding: 0 },

            grid: {
              display: false,
              borderWidth: 0,
            },

            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,
            },
          },
          x1: {
            position: 'top',
            grid: {
              display: false,
              borderWidth: 0,
            },
            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,
              color: '#161616',

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '월') {
                  return '';
                }
                if (this.getLabelForValue(value) == '화') {
                  return '';
                }
                if (this.getLabelForValue(value) == '수') {
                  return '';
                }
                if (this.getLabelForValue(value) == '목') {
                  return '';
                }
                if (this.getLabelForValue(value) == '금') {
                  return '';
                }
                if (this.getLabelForValue(value) == '토') {
                  return '';
                }
                if (this.getLabelForValue(value) == '일') {
                  return '';
                } else {
                  return this.getLabelForValue(value);
                }
              },
            },
          },

          y: {
            type: 'linear',
            display: false,
            position: 'left',
            min: 0,
            max: 100,

            ticks: { display: false, stepSize: 100 },

            grid: {
              drawTicks: false,
              drawBorder: false,
              drawOnChartArea: false,
            },
          },
        },
      },
    });
  }

  //주간 토양수분 차트
  weekWaterChart() {
    this.weekSoil = new Chart(this.waterWeek.nativeElement, {
      type: 'bar',
      data: {
        labels: this.weekLabel,
        datasets: [
          {
            label: '토양수분',
            data: this.week.soil,
            backgroundColor: '#5483EF',
            borderColor: '#ACDBFF',
            maxBarThickness: 45,
            barPercentage: 1.2,
          },
        ],
      },
      options: {
        responsive: true,

        elements: {
          point: {
            pointStyle: 'rectRot',
          },
          bar: {
            borderWidth: {
              top: 3,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: false,
          },

          title: {
            display: false,
          },
        },

        scales: {
          x: {
            title: { display: true, align: 'start', text: '(℃)', font: { size: 8 }, padding: 0 },

            grid: {
              display: false,
              borderWidth: 0,
            },

            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,
            },
          },
          x1: {
            position: 'top',
            grid: {
              display: false,
              borderWidth: 0,
            },

            ticks: {
              color: '#161616',
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '월') {
                  return '';
                }
                if (this.getLabelForValue(value) == '화') {
                  return '';
                }
                if (this.getLabelForValue(value) == '수') {
                  return '';
                }
                if (this.getLabelForValue(value) == '목') {
                  return '';
                }
                if (this.getLabelForValue(value) == '금') {
                  return '';
                }
                if (this.getLabelForValue(value) == '토') {
                  return '';
                }
                if (this.getLabelForValue(value) == '일') {
                  return '';
                } else {
                  return this.getLabelForValue(value);
                }
              },
            },
          },

          y: {
            type: 'linear',
            display: false,
            position: 'left',
            min: 0,
            max: 200,

            ticks: { display: false, stepSize: 50 },

            grid: {
              drawTicks: false,
              drawBorder: false,
              drawOnChartArea: false,
            },
          },
        },
      },
    });
  }

  //월간 온도 차트
  monthTem() {
    this.monthTemperature = new Chart(this.temMonth.nativeElement, {
      type: 'bar',
      data: {
        labels: this.label,
        datasets: [
          {
            label: '온도',
            data: this.month.temperature,
            backgroundColor: '#EDC3C9',
            borderColor: '#DB7F8C',
            barThickness: 6,
          },
        ],
      },
      options: {
        responsive: true,

        elements: {
          point: {
            pointStyle: 'rectRot',
          },
          bar: {
            borderWidth: {
              top: 3,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: false,
          },

          title: {
            display: false,
          },
        },

        scales: {
          x: {
            title: { display: true, align: 'start', font: { size: 8 }, padding: 0 },

            grid: {
              display: false,
              borderWidth: 0,
            },

            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,
            },
          },
          x1: {
            position: 'top',
            grid: {
              display: false,
              borderWidth: 0,
            },

            ticks: {
              font: { size: 7 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,
              color: '#161616',

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '1') {
                  return '';
                }
                if (this.getLabelForValue(value) == '2') {
                  return '';
                }
                if (this.getLabelForValue(value) == '3') {
                  return '';
                }
                if (this.getLabelForValue(value) == '4') {
                  return '';
                }
                if (this.getLabelForValue(value) == '5') {
                  return '';
                }
                if (this.getLabelForValue(value) == '6') {
                  return '';
                }
                if (this.getLabelForValue(value) == '7') {
                  return '';
                }
                if (this.getLabelForValue(value) == '8') {
                  return '';
                }
                if (this.getLabelForValue(value) == '9') {
                  return '';
                }
                if (this.getLabelForValue(value) == '10') {
                  return '';
                }
                if (this.getLabelForValue(value) == '11') {
                  return '';
                }
                if (this.getLabelForValue(value) == '12') {
                  return '';
                }
                if (this.getLabelForValue(value) == '13') {
                  return '';
                }
                if (this.getLabelForValue(value) == '14') {
                  return '';
                }
                if (this.getLabelForValue(value) == '15') {
                  return '';
                }
                if (this.getLabelForValue(value) == '16') {
                  return '';
                }
                if (this.getLabelForValue(value) == '17') {
                  return '';
                }
                if (this.getLabelForValue(value) == '18') {
                  return '';
                }
                if (this.getLabelForValue(value) == '19') {
                  return '';
                }
                if (this.getLabelForValue(value) == '20') {
                  return '';
                }
                if (this.getLabelForValue(value) == '21') {
                  return '';
                }
                if (this.getLabelForValue(value) == '22') {
                  return '';
                }
                if (this.getLabelForValue(value) == '23') {
                  return '';
                }
                if (this.getLabelForValue(value) == '24') {
                  return '';
                }
                if (this.getLabelForValue(value) == '25') {
                  return '';
                }
                if (this.getLabelForValue(value) == '26') {
                  return '';
                }
                if (this.getLabelForValue(value) == '27') {
                  return '';
                }
                if (this.getLabelForValue(value) == '28') {
                  return '';
                }
                if (this.getLabelForValue(value) == '29') {
                  return '';
                }
                if (this.getLabelForValue(value) == '30') {
                  return '';
                }
                if (this.getLabelForValue(value) == '31') {
                  return '';
                } else {
                  return this.getLabelForValue(value);
                }
              },
            },
          },

          y: {
            type: 'linear',
            display: true,
            position: 'left',

            min: 0,
            max: 100,

            ticks: { display: false, stepSize: 50 },

            grid: {
              drawTicks: false,
              drawBorder: false,
              drawOnChartArea: true,
            },
          },
        },
      },
    });
  }

  //월간 조도 차트
  monthIllumin() {
    this.monthLight = new Chart(this.illuminMonth.nativeElement, {
      type: 'bar',
      data: {
        labels: this.label,
        datasets: [
          {
            label: '조도',
            data: this.month.light,
            backgroundColor: '#FFF9D5',
            borderColor: '#FFDC30',
            barThickness: 6,
          },
        ],
      },
      options: {
        responsive: true,

        elements: {
          point: {
            pointStyle: 'rectRot',
          },
          bar: {
            borderWidth: {
              top: 3,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: false,
          },

          title: {
            display: false,
          },
        },

        scales: {
          x: {
            title: { display: true, align: 'start', font: { size: 8 }, padding: 0 },

            grid: {
              borderWidth: 0,
              display: false,
            },

            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,
            },
          },
          x1: {
            position: 'top',
            grid: {
              borderWidth: 0,
              display: false,
            },

            ticks: {
              font: { size: 7 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,
              color: '#161616',

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '1') {
                  return '';
                }
                if (this.getLabelForValue(value) == '2') {
                  return '';
                }
                if (this.getLabelForValue(value) == '3') {
                  return '';
                }
                if (this.getLabelForValue(value) == '4') {
                  return '';
                }
                if (this.getLabelForValue(value) == '5') {
                  return '';
                }
                if (this.getLabelForValue(value) == '6') {
                  return '';
                }
                if (this.getLabelForValue(value) == '7') {
                  return '';
                }
                if (this.getLabelForValue(value) == '8') {
                  return '';
                }
                if (this.getLabelForValue(value) == '9') {
                  return '';
                }
                if (this.getLabelForValue(value) == '10') {
                  return '';
                }
                if (this.getLabelForValue(value) == '11') {
                  return '';
                }
                if (this.getLabelForValue(value) == '12') {
                  return '';
                }
                if (this.getLabelForValue(value) == '13') {
                  return '';
                }
                if (this.getLabelForValue(value) == '14') {
                  return '';
                }
                if (this.getLabelForValue(value) == '15') {
                  return '';
                }
                if (this.getLabelForValue(value) == '16') {
                  return '';
                }
                if (this.getLabelForValue(value) == '17') {
                  return '';
                }
                if (this.getLabelForValue(value) == '18') {
                  return '';
                }
                if (this.getLabelForValue(value) == '19') {
                  return '';
                }
                if (this.getLabelForValue(value) == '20') {
                  return '';
                }
                if (this.getLabelForValue(value) == '21') {
                  return '';
                }
                if (this.getLabelForValue(value) == '22') {
                  return '';
                }
                if (this.getLabelForValue(value) == '23') {
                  return '';
                }
                if (this.getLabelForValue(value) == '24') {
                  return '';
                }
                if (this.getLabelForValue(value) == '25') {
                  return '';
                }
                if (this.getLabelForValue(value) == '26') {
                  return '';
                }
                if (this.getLabelForValue(value) == '27') {
                  return '';
                }
                if (this.getLabelForValue(value) == '28') {
                  return '';
                }
                if (this.getLabelForValue(value) == '29') {
                  return '';
                }
                if (this.getLabelForValue(value) == '30') {
                  return '';
                }
                if (this.getLabelForValue(value) == '31') {
                  return '';
                } else {
                  return this.getLabelForValue(value);
                }
              },
            },
          },

          y: {
            type: 'linear',
            display: true,
            position: 'left',

            min: 0,
            max: 100,

            ticks: { display: false, stepSize: 50 },

            grid: {
              drawTicks: false,
              drawBorder: false,
              drawOnChartArea: true,
            },
          },
        },
      },
    });
  }

  //월간 토양수분 차트
  monthWater() {
    this.monthSoil = new Chart(this.waterMonth.nativeElement, {
      type: 'bar',
      data: {
        labels: this.label,
        datasets: [
          {
            label: '토양수분',
            data: this.month.soil,
            backgroundColor: '#5483EF',
            borderColor: '#ACDBFF',
            barThickness: 6,
          },
        ],
      },
      options: {
        responsive: true,
        elements: {
          point: {
            pointStyle: 'rectRot',
          },
          bar: {
            borderWidth: {
              top: 3,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: false,
          },

          title: {
            display: false,
          },
        },

        scales: {
          x: {
            title: { display: true, align: 'start', font: { size: 8 }, padding: 0 },

            grid: {
              display: false,
              borderWidth: 0,
            },

            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,
            },
          },
          x1: {
            position: 'top',
            grid: {
              display: false,
              borderWidth: 0,
            },

            ticks: {
              font: { size: 7 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,
              color: '#161616',

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '1') {
                  return '';
                }
                if (this.getLabelForValue(value) == '2') {
                  return '';
                }
                if (this.getLabelForValue(value) == '3') {
                  return '';
                }
                if (this.getLabelForValue(value) == '4') {
                  return '';
                }
                if (this.getLabelForValue(value) == '5') {
                  return '';
                }
                if (this.getLabelForValue(value) == '6') {
                  return '';
                }
                if (this.getLabelForValue(value) == '7') {
                  return '';
                }
                if (this.getLabelForValue(value) == '8') {
                  return '';
                }
                if (this.getLabelForValue(value) == '9') {
                  return '';
                }
                if (this.getLabelForValue(value) == '10') {
                  return '';
                }
                if (this.getLabelForValue(value) == '11') {
                  return '';
                }
                if (this.getLabelForValue(value) == '12') {
                  return '';
                }
                if (this.getLabelForValue(value) == '13') {
                  return '';
                }
                if (this.getLabelForValue(value) == '14') {
                  return '';
                }
                if (this.getLabelForValue(value) == '15') {
                  return '';
                }
                if (this.getLabelForValue(value) == '16') {
                  return '';
                }
                if (this.getLabelForValue(value) == '17') {
                  return '';
                }
                if (this.getLabelForValue(value) == '18') {
                  return '';
                }
                if (this.getLabelForValue(value) == '19') {
                  return '';
                }
                if (this.getLabelForValue(value) == '20') {
                  return '';
                }
                if (this.getLabelForValue(value) == '21') {
                  return '';
                }
                if (this.getLabelForValue(value) == '22') {
                  return '';
                }
                if (this.getLabelForValue(value) == '23') {
                  return '';
                }
                if (this.getLabelForValue(value) == '24') {
                  return '';
                }
                if (this.getLabelForValue(value) == '25') {
                  return '';
                }
                if (this.getLabelForValue(value) == '26') {
                  return '';
                }
                if (this.getLabelForValue(value) == '27') {
                  return '';
                }
                if (this.getLabelForValue(value) == '28') {
                  return '';
                }
                if (this.getLabelForValue(value) == '29') {
                  return '';
                }
                if (this.getLabelForValue(value) == '30') {
                  return '';
                }
                if (this.getLabelForValue(value) == '31') {
                  return '';
                } else {
                  return this.getLabelForValue(value);
                }
              },
            },
          },

          y: {
            type: 'linear',
            display: true,
            position: 'left',

            min: 0,
            max: 100,

            ticks: { display: false, stepSize: 50 },

            grid: {
              drawTicks: false,
              drawBorder: false,
              drawOnChartArea: true,
            },
          },
        },
      },
    });
  }

  // 날짜 클릭시 달력 생성
  openPopCalendar() {
    this.dialog.open(PopCalendarComponent, {
      width: '273px',
      height: '274px',
    });
  }

  headerBackSwitch = false;

  //헤더 스크롤 할 때 색 변하게
  logScrolling(event: any) {
    let scroll = event.detail.scrollTop;

    if (scroll > 46) {
      this.headerBackSwitch = true;
    } else {
      this.headerBackSwitch = false;
    }
  }

  //홈화면으로
  goHome() {
    this.navController.navigateBack(['/tabs/home']);
  }
}
