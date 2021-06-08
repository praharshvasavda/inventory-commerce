import { LightningElement, track } from 'lwc';

export default class App extends LightningElement {

    @track listings = [];

    constructor(){
        super();
        this.fetchListings();
    }

    fetchListings(){
        fetch('/api/listing')
        .then((resp) => resp.json())
        .then((data)=> {
            console.log(data);
            this.listings = data.records;
            // this.listings = [
            //         {
            //             brand : 'Volkswagen',
            //             model : 'Golf 1.6 TDI',
            //             registrationDate : 1614417465600,
            //             power : 75,
            //             color : 'White',
            //             sku : '434122505',
            //             img : 'https://i.imgur.com/HarnXBx.jpg',
            //             stockType : 'Used',
            //             price : 12500,
            //             mileage : 266917

            //         }
            //     ]
        })
        .catch((error)=> {
        console.log(error);
        });
    }


    // listings = [
    //     {
    //         brand : 'Volkswagen',
    //         model : 'Golf 1.6 TDI',
    //         registrationDate : 1614417465600,
    //         power : 75,
    //         color : 'White',
    //         sku : '434122505',
    //         img : 'https://i.imgur.com/HarnXBx.jpg',
    //         stockType : 'Used',
    //         price : 12500,
    //         mileage : 266917

    //     }
    // ]

}
