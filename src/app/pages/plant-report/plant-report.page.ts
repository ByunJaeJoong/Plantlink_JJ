import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-plant-report',
  templateUrl: './plant-report.page.html',
  styleUrls: ['./plant-report.page.scss'],
})
export class PlantReportPage implements OnInit {
  @ViewChild('temWeek', { static: false }) temWeek;
  @ViewChild('illuminWeek', { static: false }) illuminWeek;
  @ViewChild('waterWeek', { static: false }) waterWeek;
  @ViewChild('temMonth', { static: false }) temMonth;
  @ViewChild('illuminMonth', { static: false }) illuminMonth;
  @ViewChild('waterMonth', { static: false }) waterMonth;

  bar: any;

  label = [
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

  weekLabel = ['월', '화', '수', '목', '금', '토', '일'];
  data = [65, 59, 90, 81, 56, 55, 40, 65, 59, 90, 81, 56, 55, 40, 65, 59, 90, 81, 56, 55, 40, 65, 59, 90, 81, 56, 55, 40, 65, 59, 90];

  resultSelect = '월간';
  segment = '주간';
  constructor() {}

  ngOnInit() {}
  changeSegment() {
    setTimeout(() => {
      if (this.segment == '주간') {
        this.weekTem();
        this.weekIllumin();
        this.weekWaterChart();
      } else {
        this.monthTem();
        this.monthIllumin();
        this.monthWater();
      }
    }, 10);
  }

  ionViewDidEnter() {
    this.weekTem();
    this.weekIllumin();
    this.weekWaterChart();
    this.monthTem();
    this.monthIllumin();
    this.monthWater();
  }

  // 차트
  //주간 온도 차트
  weekTem() {
    const that = this;

    this.bar = new Chart(this.temWeek.nativeElement, {
      type: 'bar',
      data: {
        labels: this.weekLabel,
        datasets: [
          {
            label: '온도',
            data: this.data,
            backgroundColor: '#EDC3C9',
            borderColor: '#DB7F8C',
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
            },

            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '월') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '화') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '수') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '목') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '금') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '토') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '일') {
                  return '40';
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
            max: 200,

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

  //주간 조도 차트
  weekIllumin() {
    const that = this;

    this.bar = new Chart(this.illuminWeek.nativeElement, {
      type: 'bar',
      data: {
        labels: this.weekLabel,
        datasets: [
          {
            label: '온도',
            data: this.data,
            backgroundColor: '#FFF9D5',
            borderColor: '#FFDC30',
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
            },
            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '월') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '화') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '수') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '목') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '금') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '토') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '일') {
                  return '40';
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
            max: 200,

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

  //주간 토양수분 차트
  weekWaterChart() {
    const that = this;

    this.bar = new Chart(this.waterWeek.nativeElement, {
      type: 'bar',
      data: {
        labels: this.weekLabel,
        datasets: [
          {
            label: '온도',
            data: this.data,
            backgroundColor: '#5483EF',
            borderColor: '#ACDBFF',
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
            },

            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '월') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '화') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '수') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '목') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '금') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '토') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '일') {
                  return '40';
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
            max: 200,

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
  //월간 온도 차트
  monthTem() {
    const that = this;

    this.bar = new Chart(this.temMonth.nativeElement, {
      type: 'bar',
      data: {
        labels: this.label,
        datasets: [
          {
            label: '온도',
            data: this.data,
            backgroundColor: '#EDC3C9',
            borderColor: '#DB7F8C',
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
            },

            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '1') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '2') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '3') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '4') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '5') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '6') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '7') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '8') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '9') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '10') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '11') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '12') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '13') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '14') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '15') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '16') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '17') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '18') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '19') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '20') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '21') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '22') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '23') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '24') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '25') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '26') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '27') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '28') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '29') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '30') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '31') {
                  return '90';
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
            max: 200,

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
    const that = this;

    this.bar = new Chart(this.illuminMonth.nativeElement, {
      type: 'bar',
      data: {
        labels: this.label,
        datasets: [
          {
            label: '온도',
            data: this.data,
            backgroundColor: '#FFF9D5',
            borderColor: '#FFDC30',
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
            },

            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '1') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '2') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '3') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '4') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '5') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '6') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '7') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '8') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '9') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '10') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '11') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '12') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '13') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '14') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '15') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '16') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '17') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '18') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '19') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '20') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '21') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '22') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '23') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '24') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '25') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '26') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '27') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '28') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '29') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '30') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '31') {
                  return '90';
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
            max: 200,

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
    const that = this;

    this.bar = new Chart(this.waterMonth.nativeElement, {
      type: 'bar',
      data: {
        labels: this.label,
        datasets: [
          {
            label: '온도',
            data: this.data,
            backgroundColor: '#5483EF',
            borderColor: '#ACDBFF',
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
            },

            ticks: {
              font: { size: 8 },
              autoSkip: false,
              crossAlign: 'center',
              maxRotation: 0,

              callback: function (value: number) {
                if (this.getLabelForValue(value) == '1') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '2') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '3') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '4') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '5') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '6') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '7') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '8') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '9') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '10') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '11') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '12') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '13') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '14') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '15') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '16') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '17') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '18') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '19') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '20') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '21') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '22') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '23') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '24') {
                  return '90';
                }
                if (this.getLabelForValue(value) == '25') {
                  return '81';
                }
                if (this.getLabelForValue(value) == '26') {
                  return '56';
                }
                if (this.getLabelForValue(value) == '27') {
                  return '55';
                }
                if (this.getLabelForValue(value) == '28') {
                  return '40';
                }
                if (this.getLabelForValue(value) == '29') {
                  return '65';
                }
                if (this.getLabelForValue(value) == '30') {
                  return '59';
                }
                if (this.getLabelForValue(value) == '31') {
                  return '90';
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
            max: 200,

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
}
