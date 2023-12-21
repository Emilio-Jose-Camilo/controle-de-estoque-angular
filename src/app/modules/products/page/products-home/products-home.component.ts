import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/Products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/Products/response/GetAllProductsResponse'; 
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductFormComponent } from '../../components/product-table/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnDestroy, OnInit {

  private readonly destry$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {

  }
  ngOnInit(): void {
    this.getServiceProductsDatas();
  }
  getServiceProductsDatas() {
    const productsLodad = this.productsDtService.getProductsDatas();

    if (productsLodad.length > 0) {
      this.getServiceProductsDatas = productsLodad;
    } else this.getAPIProductsDatas();
  }

  getAPIProductsDatas() {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destry$)) 
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
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

  handleProductAction(event: EventAction): void {
     if(event) {
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event.action, 
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productsDatas: this.productsDatas,
        },
      });
      this.ref.onClose
      .pipe(takeUntil(this.destry$))
      .subscribe({
        next: () => {
          this.getAPIProductsDatas()
        }
      })
     }
  }

  handleDeleteProductAction(event: { product_id: string, productName: string }): void {
    if (event) {
      //console.log('DADOS RECEBIDOS DO EVENTO DE DELETAR PRODUTO', event);
      this.confirmationService.confirm({
        message: `Confirma a exclusão do produto: ${event?.productName}?`,
        header: 'Corfirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id),
      })
    }
  }
  deleteProduct(product_id: string) {
    if (product_id) {
      this.productsService.deleteProduct(product_id)
        .pipe(takeUntil(this.destry$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Suceso',
                detail: 'Produto removido com sucesso!',
                life: 2500,
              });
              this.getAPIProductsDatas();
            }
          }, error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Errp',
              detail: 'Erro ao remover produto!',
              life: 2500,
            })
          }

        })

    }
  }


  ngOnDestroy(): void {
    this.destry$.next();
    this.destry$.complete();
  }

}
