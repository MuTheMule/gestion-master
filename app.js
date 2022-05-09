require('dotenv').config();
const produitDAO = require('./produit-dao.js');
const express = require(`express`);
const url = require(`url`);
const fs = require(`fs`);
const path = require('path');

let app = express();
app.use(express.json());

app.get('/home', (request, response) => {
    let p = path.join(__dirname, '/home.html');
    response.sendFile(p);
    console.log(`INFO: redirected to [${p}]...`);
});

app.get('/dev/:action', (request, response) => {

    const result = async () => {
        //const data = await produitDAO.execute(request.params.action);
        const data = await produitDAO.sql(request.params.action);
        return data;
    }

    result().then(data=>{
        if(typeof data !== 'undefined' && data)
            console.log(data);
        else
            console.log('Query Invalid!');
    });

    /*switch(request.params.action){
        case 'saveProduct' : {
            console.log('fetched successfully : '+request.query.prix+", "+request.query.designation+", "+request.query.codebar);
    
            const product = {
                prix: request.query.prix,
                designation: request.query.designation,
                codebar: request.query.codebar
            };

            const result = async () => {
                const data = await produitDAO.saveProduit(product);
                return data;
            }
            result().then(data => {
                if(typeof data !== 'undefined' && data){
                    console.log(data);
                }
                else{
                    console.log('Unable to save product!');
                }
            });
        }
            break;
        case 'scanProduct' : {
            console.log('fetched successfully : '+request.query.codebar);
            const result = async () => {
                const data = await produitDAO.getProduitByCodebar(request.query.codebar);
                return data;
            }
            
            result().then(data => {
                if(typeof data !== 'undefined' && data)
                    console.log(data);
                else
                    console.log('No such product!');
            });
        }
            break;
        default : console.log('FATAL: request denied. Possible mis-input');
            break;
    }*/

});

app.get('/saveProduct',(request,response) => {
    console.log('fetched successfully : '+request.query.prix+", "+request.query.designation+", "+request.query.codebar);
    
    const product = {
        prix: request.query.prix,
        designation: request.query.designation,
        codebar: request.query.codebar
    };

    const result = async () => {
        const data = await produitDAO.saveProduit(product);
        return data;
    }
    result().then(data => {
        if(typeof data !== 'undefined' && data){
            console.log(data);
        }
        else{
            console.log('Unable to save product!');
        }
    });
});

app.get('/scanProduct', (request, response) => {
    console.log('fetched successfully : '+request.query.codebar);
    const result = async () => {
        const data = await produitDAO.getProduitByCodebar(request.query.codebar);
        return data;
    }
    
    result().then(data => {
        if(typeof data !== 'undefined' && data)
            console.log(data);
        else
            console.log('No such product!');
    });
});

/*const result = async () => {
    const data = await dao.getAll('product');
    return data;
}

result().then(data => {
    console.log(data);
});*/

app.listen(process.env.port, () => {
    console.log(`listening at http://${process.env.host}:${process.env.port}...`);
});

/*fs.writeFile(
    "sample.txt",
    "Writing in to a file!",
    function (err) {
        if (err) {
            return console.error(err);
        }
        console.log(" Finished writing ");
    }
);*/

/*var stream = fs.createWriteStream("sample.txt", {flags:'a'});

stream.write("\n" + "new data" + "\n");
stream.end();*/

/*fs.readFile("sample.txt", function (err, data) {
    
    if (err) {
      return console.log(err);
    }

    console.log("Data read : " + data.toString());
      
});*/

/*fs.readFile('sample.txt', function read(err, data) {
    if (err) {
        console.log(err);
    }

    /*if(file_content.indexOf('#PRODUCT')>=0){
        console.log('Entity <PRODUCT> found.');
        if(file_content.indexOf('{')!=0){
            instance_count = 0;
            instance = '';
            for(i=file_content.indexOf('{')+1;file_content.charAt(i)!='}';i++){
                if(file_content.charAt(i)!=','){
                    instance += file_content.charAt(i);
                    data = instance.split('!');
                }
                else{
                    instance_count++;
                    console.log(data);
                    instance = '';
                }
            }
        if(instance_count==0){
            console.log('Empty Data Set');
        }
            console.log('\n'+instance_count+' instances returned.');
        }
    }
    else{
        console.log('No such Entity.');
    }

    var position = 5;
    var file_path = 'sample.txt';
    var new_text = 'abcde';

    file_content = file_content.substring(position);
    var file = fs.openSync(file_path,'r+');
    var bufferedText = new Buffer(new_text+file_content);
    fs.writeSync(file, bufferedText, 0, bufferedText.length, position);
    fs.close(file);
});*/