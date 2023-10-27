import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { GetAllProductsResponse } from './../../../../models/interfaces/Products/response/GetAllProductsResponse';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductsService } from '../../../../services/products/products.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public productList: Array<GetAllProductsResponse> = [];

  public productsChartsDatas!: ChartData;
  public productsChartsOptions!: ChartOptions

  constructor(
    private productService: ProductsService,
    private messageService: MessageService,
    private productsDtService: ProductsDataTransferService
  ) { }

  ngOnInit(): void {
    this.getProductDatas();
  }
  getProductDatas(): void {
    this.productService.getAllProducts()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productList = response;
            this.productsDtService.setProductsDatas(this.productList);
            this.setProductsChartConfig();
          }
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produto!',
            life: 2500,
          })
        }
      })
  }

  setProductsChartConfig(): void {

    if (this.productList.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.productsChartsDatas = {
        labels: this.productList.map((element) => element.name),
        datasets: [
          {
            label: 'Quantidade',
            backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
            borderColor: documentStyle.getPropertyValue('--indigo-400'),
            hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
            data: this.productList.map((element) => element.amount)
          },
        ],
      };

      this.productsChartsOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },

        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: '500'
              },
            },

            grid: {
              color: surfaceBorder
            }
          },

          y: {
            ticks: {
              color: textColorSecondary
            },

            grid: {
              color: surfaceBorder
            }
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
