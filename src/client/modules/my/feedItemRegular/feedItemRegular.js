import { LightningElement, api, track } from 'lwc';
import '@lwc/synthetic-shadow';

/**
 * @author Damien Fleminks
 * 18-10-2019
 */
export default class FeedItemRegular extends LightningElement {
    

    @api vehicle = {}
    @track stock;
    @track noStock = false;
    @track isOrdered = false;
    @track orderNumber;

    @track showForm = false;

    get image(){
        return `background: url(${this.vehicle.Image_url__c});background-size:cover`;;
    }


    // Format the registration date
    get sourceDate(){
        let date = new Date(this.vehicle.First_Registration__c);
        return `${date.getMonth()}/${date.getFullYear()}`;
    }

    isRendered = false;

    renderedCallback(){
        if(!this.isRendered){
            //console.log('Testing SKU:' + this.vehicle.SKU__c);
            this.getStock(this.vehicle.SKU__c);
        }
    }

    toggleForm(){
        this.showForm = !this.showForm;
        if(this.showForm && !this.isOrdered){
            fetch('/api/oci/reserve/'+this.vehicle.SKU__c)
                .then((resp) => resp.json())
                .then((data)=> {
                    console.log(data);
                })
                .catch((error)=> {
                console.log(error);
                });
        }
    }


    order(){
        fetch('/api/order/'+this.vehicle.Id)
            .then((resp) => resp.json())
            .then((data)=> {
                console.log(data);
                this.isOrdered = true;
                this.orderNumber = data.order;
            })
            .catch((error)=> {
            console.log(error);
            });
    }


    getStock(sku){
        fetch('/api/oci/available/'+sku)
        .then((resp) => resp.json())
        .then((data)=> {
            console.log(data);
            this.stock = data.locations[0].inventoryRecords[0].availableToFulfill;
            if(this.stock === 0){
                this.noStock = true;
            }
            if(this.stock > 0){
                this.noStock = false;
            }
        })
        .catch((error)=> {
        console.log(error);
        });
    }


    


}