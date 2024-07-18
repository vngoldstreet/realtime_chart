import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  WatermarkOptions,
  HorzScaleOptions,
} from 'lightweight-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  private chart!: IChartApi;
  private candleSeries!: ISeriesApi<'Candlestick'>;
  wtoption: WatermarkOptions = {
    color: 'rgba(255,231,76,0.3)',
    visible: true,
    text: 'by Golden Fund',
    fontSize: 200,
    fontFamily: 'Bai Jamjuree, sans-serif',
    fontStyle: '',
    horzAlign: 'center',
    vertAlign: 'center',
  };

  timeOption: HorzScaleOptions = {
    rightOffset: 10,
    barSpacing: 10,
    minBarSpacing: 0.5,
    fixLeftEdge: false,
    fixRightEdge: false,
    lockVisibleTimeRangeOnResize: false,
    rightBarStaysOnScroll: false,
    borderVisible: true,
    borderColor: '#2B2B43',
    visible: true,
    timeVisible: true,
    secondsVisible: true,
    shiftVisibleRangeOnNewBar: true,
    allowShiftVisibleRangeOnWhitespaceReplacement: false,
    ticksVisible: false,
    uniformDistribution: false,
    minimumHeight: 0,
    allowBoldLabels: true,
  };
  period: number = 5;
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeChart();
    this.generateRandomData();

    setInterval(() => {
      this.updateData();
      this.period--;
      if (this.period < 0) {
        let data = this.candleSeries.data() as CandlestickData[];
        let lastData = data[data.length - 1];
        let lastTime = Math.round((lastData.time as number) / 1000) * 1000;
        const open = lastData.close;
        const close = open + Math.random() * 10 - 5;
        let high = lastData.close;
        let low = lastData.close;
        if (high < close) {
          high = close;
        }
        if (low > close) {
          low = close;
        }
        data.push({
          time: lastTime as Time,
          open: open,
          high: high,
          low: low,
          close: close,
        });
        this.candleSeries.setData(data);
        this.period = 5;
      }
    }, 1000); // Cập nhật dữ liệu mỗi giây
  }

  initializeChart() {
    this.chart = createChart(this.chartContainer.nativeElement, {
      width: this.chartContainer.nativeElement.clientWidth,
      height: 500,
      watermark: this.wtoption,
      timeScale: this.timeOption,
    });

    this.candleSeries = this.chart.addCandlestickSeries();
    this.candleSeries.setData([]);
  }

  generateRandomData() {
    const data: CandlestickData[] = [];
    let lastClose = 100;

    const currentTime = Math.round(new Date().getTime() / 1000);
    const timeOffset = 240 * 60 * 60;
    const pastTime = new Date(currentTime - timeOffset);

    let lastTime = pastTime.getTime();

    for (let i = 0; i < 240; i++) {
      const open = lastClose;
      const close = open + Math.random() * 10 - 5;
      const high = Math.max(open, close) + Math.random() * 5;
      const low = Math.min(open, close) - Math.random() * 5;
      data.push({
        time: lastTime as Time,
        open: open,
        high: high,
        low: low,
        close: close,
      });

      lastClose = close;
      lastTime += this.period; // Di chuyển đến thời điểm của cây nến tiếp theo
    }

    // data.push({
    //   time: (currentTime * 1000) as Time,
    //   open: lastClose,
    //   high: lastClose,
    //   low: lastClose,
    //   close: lastClose,
    // });
    this.candleSeries.setData(data);
  }

  updateData() {
    let data = this.candleSeries.data() as CandlestickData[];
    let lastData = data[data.length - 1];
    // let lastTime = Math.round((lastData.time as number) / 1000) * 1000;
    // let currentTime = Math.round(new Date().getTime() / 1000) * 1000;

    // if (currentTime > lastTime + this.period) {
    //   let time = currentTime as Time;
    //   let close = lastData.close;
    //   let open = lastData.close;
    //   let high = lastData.close;
    //   let low = lastData.close;

    //   let curent = lastData.time as number;
    //   console.log(curent, new Date(curent), time);

    //   data.push({
    //     time: time,
    //     open: open,
    //     high: high,
    //     low: low,
    //     close: close,
    //   });
    //   this.candleSeries.setData(data);
    //   return;
    // }

    let open = lastData.open;
    let high = lastData.high;
    let low = lastData.low;

    let close = lastData.close + Math.random() * 10 - 5;

    if (high < close) {
      high = close;
    }
    if (low > close) {
      low = close;
    }

    this.candleSeries.update({
      time: lastData.time,
      open: open,
      high: high,
      low: low,
      close: close,
    });
  }
}
