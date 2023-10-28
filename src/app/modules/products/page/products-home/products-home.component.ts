import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/Products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnDestroy, OnInit{

  private readonly destry$: Subject<void> = new Subject();
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService
  ) {

  }
  ngOnInit(): void {
    this.getServiceProductsDatas();
  }
  getServiceProductsDatas() {
    const productsLodad = this.productsDtService.getProductsDatas();

    if(productsLodad.length > 0) {
      this.getServiceProductsDatas = productsLodad;
    } else this.getAPIProductsDatas();
  }

  getAPIProductsDatas() {
    this.productsService
    .getAllProducts()
    .pipe(takeUntil(this.destry$))
    .subscribe({
      next: (response) => {
        if(response.length > 0) {
          this.productsDatas = response;
        }
        console.log('Dados do produto', this.productsDatas)
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos',
          life: 2500
        })
        this.router.navigate(['/dasboard']);
      }
     })
  }

  ngOnDestroy(): void {
    this.destry$.next();
    this.destry$.complete();
  }

}
