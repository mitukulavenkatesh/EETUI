import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { PaymentsService } from './payments.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  name: string = '';
  cardNumber: string = '';
  expiry: string = '';
  cvv: string = '';
  datas: any[] = [];
  constructor(private paymentsService: PaymentsService) { }
  ngOnInit() {
    this.getPipData();
  }

  getPipData() {
    this.paymentsService.getData().subscribe({
      next: (data: any) => {
        this.datas = data;
        this.updateChartWithData(this.datas);
      },
      error: (err: any) => {
        console.error('Error fetching data:', err);
      }
    });
  }
  submit() {
    let client = {
      "name": this.name,
      "card": this.cardNumber,
      "expiry": this.expiry,
      "cvv": this.cvv
    }

    this.paymentsService.savePayment(client).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (err: any) => {
        console.error(err);
      }
    });

  }
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    title: {
      text: 'Payment Analytics'
    },
    chart: {
      type: 'column'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'Amount (INR)'
      }
    },
    series: [{
      name: 'Payments',
      type: 'column',
      data: []
    }]
  };

  updateChartWithData(val: any) {
    this.chartOptions = {
      ...this.chartOptions,
      xAxis: {
        categories: val.months
      },
      series: [{
        name: 'Payments',
        type: 'column',
        data: val.amounts
      }]
    };
  }
}
