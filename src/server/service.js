module.exports = function(app){

    var jsforce = require('jsforce');
    var conn = new jsforce.Connection();
    conn.login('extern.praharsh.vasavda@vwfs.io.assetcld.prod.uat', 'Germany@2021', function(err, res) {
    if (err) { 
        return console.error(err); }
    
    });

    
    /*app.get('/api/listings', (req, res) => {
        conn.query('SELECT Id, Color__c, mileage__c, First_Registration__c, Image_url__c, Make__c, Model__c, Power_HP__c, Price__c, SKU__c, Stock_type__c, VIN__c  FROM AssetListing__c WHERE Active__c = true', function(err, res2) {
            if (err) { return console.error(err); }
            res.json(res2);
        });
        
    });*/

    app.get('/api/listing', (req, res) => {
        conn.query('SELECT Id, DU_Color__c  FROM Listing__c', function(err, res2) {
            if (err) { 
                console.log('token:::',conn.accessToken);
                console.log('URL:::',conn.instanceUrl);
                return console.error(err); }
            res.json(res2);
        });
        
    });

    app.get('/api/order/:id', (req, res) => {
        console.log('ListingID:' + req.params.id);
        let order = {
            AccountId : '00109000003Ds76AAC',
            Purchased_Listing__c : `${req.params.id}`,
            EffectiveDate : Date.now(),
            Status : 'Draft'
        };
        
        conn.sobject("Order").create(order, function(err, ret) {
            if (err || !ret.success) { return console.error(err, ret); }
            console.log("Created record id : " + ret.id);
            conn.sobject("Order").retrieve(ret.id, function(err, order) {
                if (err) { return console.error(err); }
                console.log("Order Number : " + order.Name);

                const _request2 = {
                    url: '/services/data/v51.0/actions/custom/flow/OMS_Master_Flow_2',
                    method: 'post',
                    body: '{"inputs":[{"orderID":"'+order.Id+'"}]}',
                    headers : {
                            "Content-Type" : "application/json"
                        }
                  };
                  console.log(_request2);
                  conn.request(_request2, function(err, res2) {
                    // console.log(res2);
                     console.log(res2);
                 });

                res.json({order : order.OrderNumber});

              });
            
          });

       
        
    });

    app.get('/api/oci/reserve/:sku', (req, res) => {

            let uuid = Date.now();
            const _request = {
                url: '/services/data/v51.0/commerce/oci/reservation/actions/reservations',
            method: 'post',
            body: `{"actionRequestId":"${uuid}","allowPartialReservations":false,"createRecords":[{"locationIdentifier":"DE-P001-ParkingLot","quantity": 1.0,"stockKeepingUnit":"${req.params.sku}"}]}`,
            headers : {
                    "Content-Type" : "application/json"
                }
          };
          // body: `{"actionRequestId":"${uuid}","createRecords":[{"locationIdentifier":"DE-P001-ParkingLot","quantity": 1.0,"stockKeepingUnit":"${req.params.sku}"}]}`,
          console.log(_request);

        conn.request(_request, function(err, res2) {
           console.log(res2);
            res.json(res2);
        });
        
    });

    app.get('/api/oci/available/:sku', (req, res) => {


        const _request = {
            url: '/services/data/v51.0/commerce/oci/availability/availability-records/actions/get-availability',
            method: 'post',
            body: '{"locationIdentifiers":["DE-P001-ParkingLot"], "stockKeepingUnits":["'+req.params.sku+'"],"useCache":false}',
            headers : {
                    "Content-Type" : "application/json"
                }
          };
          
          //console.log(_request);

        conn.request(_request, function(err, res2) {
           // console.log(res2);
            res.json(res2);
        });
        
    });


}
