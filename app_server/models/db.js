var mongoose = require('mongoose'); // bu sınıf veri tabanı baglantısını sağlıyor.

mongoose.Promise = require('bluebird');

var mongoDB = 'mongodb://localhost/testApp';

mongoose.connect(mongoDB, function(err,err){
    if(err){
      console.log('veri tabanına bağlanıldı');

    }
    else{
      console.log('veri tabanı bağlantı hatası');
        
    }
})

