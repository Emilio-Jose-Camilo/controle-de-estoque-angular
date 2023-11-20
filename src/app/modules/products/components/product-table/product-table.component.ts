
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventAction } from 'src/app/models/interfaces/Products/event/EventAction';
import { DeleteProductAction } from 'src/app/models/interfaces/Products/event/deleteProductAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/Products/response/GetAllProductsResponse';
import { ProductEvent } from 'src/app/models/interfaces/enums/products/productEvent';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: []
})
export class ProductTableComponent {
  @Input() products: Array<GetAllProductsResponse> = [];
  @Output() ProductEvent = new EventEmitter<EventAction>();
  @Output()deleteProductEvent = new EventEmitter<DeleteProductAction>();

  public productSelected!: GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string): void {
    if(action && action !== '') {
      const productEventData = id && id !== '' ? {action, id} : {action};
      this.ProductEvent.emit(productEventData)
    }
  }

  handleDeleteProduct(product_id: string, productName: string): void {
    if(product_id !== '' && productName !== '') {
      this.deleteProductEvent.emit({
        product_id,
        productName,
      })
    }
  }
}
