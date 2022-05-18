const dbops = require('./dbops.js');

var statement = '';

var values = [];
var tables = [];

var projectionAttributes = [];

var selectionConnectors = [];
var selectionCriteria = [];

const equationOperators = ['=','<','>','~'];
const valueMarkers = ['!','?'];
const logicalConnectors = ['and','or'];
const projectionKeywords = ['including','excluding','along'];

is = (expression,nature) => {
  for(i = 0 ; i < nature.length ; i++){
    if(expression == nature[i]){
      return true;
    }
  }
  return false;
}

projection = (attributes) => {

  for(i = 0 ; i < attributes.length ; i++){
    projectionAttributes.push(attributes[i]);
  }
    
  return;

}

selection = (expressions) => {

  projectionKeywordFound = false;

  for(i; typeof expressions[i] != 'undefined' && expressions[i] != 'including' && !projectionKeywordFound;i++){

    var attribute = '';
    var operator = '';
    var value = '';

    var j = i;

    for(j; typeof expressions[j] != 'undefined' && expressions[j] != 'and';j++){

        if(expressions[j]==('=')){
          operator = expressions[j];
          console.log('[operator] = '+expressions[j]);
        }
        else if(expressions[j].charAt(0)==('!')){
          value = expressions[j].split('!')[0];
          values.push(value);
          console.log('[value] = '+expressions[j].split('!')[1]);
        }
        else if(expressions[j]=='including'){
          projectionKeywordFound = true;
          break;
        }
        else{
          attribute = expressions[j];
          projectionAttributes.push(attribute);
          console.log('[attribute] = '+expressions[j]);
        }

    }

    selectionConnectors.push(expressions[j]);
    selectionCriteria.push({operator:operator,value:value,attribute:attribute});
    i = j;

  }


/*for(i = 0 ; i < expressions.length && !is(expressions[i],projectionKeywords) && !projectionKeywordFound; i++){

  console.log('loop start i : '+i);

  var operator;
  var value;
  var attribute;

  var j = i;

  for(j; !is(expressions[j],logicalConnectors) ;j++){

    console.log('loop start j : '+j);

    if(is(expressions[j],equationOperators)){
      operator = expressions[j];
      console.log('[operator] = '+expressions[j]);
    }
    else if(is(expressions[j].charAt(0),valueMarkers)){
      value = expressions[j].split('!')[1];
      values.push(value);
      console.log('[value] = '+expressions[j].split('!')[1]);
    }
    else if(is(expressions[j],projectionKeywords)){
      projectionKeywordFound = true;
      break;
    }
    else{
      attribute = expressions[j];
      projectionAttributes.push(attribute);
      console.log('[attribute] = '+expressions[j]);
    }

  }

  selectionConnectors.push(expressions[j]);
  selectionCriteria.push({operator:operator,value:value,attribute:attribute});
  
  i = j;
    
  console.log('loop end i : '+i);

}*/

  return;

}

buildQuery = () => {

  statement = 'SELECT ';

  for(i = 0 ; i <projectionAttributes.length-1; i++){
    statement += projectionAttributes[i] + ', ';
  }

  statement += projectionAttributes[projectionAttributes.length] + ' FROM ';

  for(i = 0 ; i <tables.length-1; i++){
    statement += tables[i] + ', ';
  }

  statement += tables[tables.length] + ' WHERE ';

  for(i = 0 ; i <selectionConnectors.length; i++){
    statement += selectionCriteria[i].attribute + selectionCriteria[i].operator + selectionCriteria[i].value + ' ' + selectionConnectors[i] + ' ';
  }

  statement += selectionCriteria[i] + ';';

  return statement;

}

exports.analysis = (raw) => {
  
  const keywords = raw.split(' ');
  values = [];
  tables = [];

  switch (keywords[0]){
    case 'find' :

      console.log(keywords.splice(i,keywords.length-i));

      for(i = 0; i<keywords.length; i++){
        if(keywords[i]=='by')
          selection(keywords.splice(i,keywords.length-i));
        if(keywords[i]=='including')
          projection(keywords.splice(i,keywords.length-i));
        tables.push(keywords[i]);
      }

      break;
    case 'save' :
      break;
    default : console.log('query invalid');
      break;
  }

  console.log(buildQuery());

  // find product receipt by id = !5 and barcode ?lait or name = !600 including price timestamp

}

exports.sql = (raw) => {

  var statement = '';
  var values = [];

  const keywords = raw.split(' ');

  console.log(keywords);

  switch(keywords[0]){
    case 'find' :

      tablesOfReference = [];
      var i = 1;

    for(i; i<keywords.length; i++){
      tablesOfReference.push(keywords[i])
    }

    /*if(raw.indexOf('by')!=0){
      */
      for(i; keywords[i]!='by' && i < keywords.length; i++){
        tablesOfReference.push(keywords[i]);
      }

    /*}*/

      by = keywords[i];
      i++;

      selectionConnectives = [];
      selectionCriteria = [];

      /*for(i; typeof keywords[i] != 'undefined' && keywords[i] != 'including' ; i++){
        console.log(keywords[i]);
      }*/

      //

      var includingFound = false;

      for(i; typeof keywords[i] != 'undefined' && keywords[i] != 'including' && !includingFound;i++){

        var attributeOfReference = '';
        var operator = '';
        var value = '';

        var j = i;

        for(j; typeof keywords[j] != 'undefined' && keywords[j] != 'and';j++){

            if(keywords[j]==('=')||keywords[j]==('>')||keywords[j]==('<')){
              operator = keywords[j];
              console.log('keyword '+j+':[operator] = '+keywords[j]);
            }
            else if(keywords[j].charAt(0)==('!')){
              value = keywords[j].split('!')[0];
              console.log('keyword '+j+':[value] = '+keywords[j].split('!')[1]);
            }
            else if(keywords[j]=='including'){
              includingFound = true;
              break;
            }
            else{
              attributeOfReference = keywords[j];
              console.log('keyword '+j+':[attribute] = '+keywords[j]);
            }

        }

        //find product by id = !5 and price = !100 including name

        //find_produit_by_id_=_[1]_and_codebar_>_[10]_including_name

        selectionConnectives.push(keywords[j]);
        selectionCriteria.push({operator:operator,value:value,attributeOfReference:attributeOfReference});
        i = j;

      }

        var projectionAttributes = [];
        
        for(i; typeof keywords[i] !== 'undefined' && keywords[i]; i++){
          console.log('projection Attribute ' + i + ' : ' + keywords[i]);
          projectionAttributes.push(keywords[i]);
        }

        statement += 'SELECT ';

        for(i = 0; i<projectionAttributes.length; i++){
          if(i!=0) statement += ' , ';
          statement += projectionAttributes[i];
        }

        for(i = 0; i<selectionCriteria.length; i++){
          if(typeof selectionConnectives[i]!= 'undefined' && selectionConnectives[i]){
            if(i!=0&&projectionAttributes.length!=0) statement += ' , ';
            statement += ' ' + selectionCriteria[i].attributeOfReference;
          }
        }

        statement += ' FROM ';

        for(i = 0; i<tablesOfReference.length; i++){
          if(i!=0) statement += ' , ';
          statement += ' ' + tablesOfReference[i];
        }

        statement += ' WHERE ';

        for(i = 0; i<selectionCriteria.length; i++){
          if(typeof selectionConnectives[i]!= 'undefined' && selectionConnectives[i])
            statement += ' ' + selectionCriteria[i].attributeOfReference + selectionCriteria[i].operator + selectionCriteria.value + ' ' + selectionConnectives[i] + ' ';
        }

      /*const query = {
        subject: keywords[1],
        by: keywords[2],
        operator: keywords[4],
        projection: keywords[5]
      };*/

      /*if(query.property=='all') query.property = '*';
      statement += 'SELECT '+query.property+' FROM '+query.subject;*/

    break;
    
    case 'save' : 
    break;

    default : console.log('query invalid');
    break;
  }

  console.log(statement);

  //return preparedQuery = {script:statement, values:values};

}

exports.execute = (raw) => {

  const preparedQuery = sql(raw);

  const query = {
    name: raw,
    text: preparedQuery.script,
    values: preparedQuery.values
  };

  console.log(query);

  return dbops.query(query);
};

exports.getProduitById = (id)=> {

    const query = {
        name: 'fetch-produit-by-id',
        text: 'SELECT * FROM produit WHERE id=$1',
        values: [id]
      };
    
    return dbops.query(query);
}

exports.getProduitByCodebar = (codebar)=> {

    const query = {
        name: 'fetch-produit-by-codebar',
        text: 'select id,designation,property,stock_price,unit_price,quantity from product,unit where barcode = $1 and product.id = unit.product_id',
        values: [codebar]
      };
    
    return dbops.query(query);
}

exports.getCreditTotal = ()=> {

  const query = {
      name: 'fetch-total-debt',
      text: 'select sum(debt) from receipt',
      values: []
    };
  
  return dbops.query(query);
}

exports.getRetourTotal = ()=> {

  const query = {
      name: 'fetch-total-return',
      text: "select sum(transaction.unit_price * transaction.quantity) as retour from product,unit,transaction where product.id = unit.product_id and transaction.unit_code = unit.barcode and transaction.status = 'f'",
      values: []
    };
  
  return dbops.query(query);
}

exports.getCreditDuJour = ()=> {

  const query = {
      name: 'fetch-today-credit',
      text: 'select sum(debt) from receipt where timestamp::date = current_date',
      values: []
    };
  
  return dbops.query(query);
}

exports.getMeilleurProduit = ()=> {

  const query = {
      name: 'fetch-best-product',
      text: 'select designation,property from unit,product where unit.product_id = product.id and unit.barcode = (select unit_code from transaction,unit,product where unit.product_id = product.id and transaction.unit_code = unit.barcode group by unit_code order by sum(transaction.quantity) desc limit 1)',
      values: []
    };
  
  return dbops.query(query);
}

exports.getMeilleurProduitDuJour = ()=> {

  const query = {
      name: 'fetch-daily-best-product',
      text: 'select designation,property from unit,product where unit.product_id = product.id and unit.barcode = (select unit_code from transaction,unit,product,receipt where unit.product_id = product.id and transaction.unit_code = unit.barcode and transaction.receipt_id = receipt.id and receipt.timestamp::date = current_date group by unit_code order by sum(transaction.quantity) desc limit 1)',
      values: []
    };
  
  return dbops.query(query);
}

exports.getMauvaisProduit = ()=> {

  const query = {
      name: 'fetch-worst-product',
      text: 'select designation,property from unit,product where unit.product_id = product.id and unit.barcode = (select unit_code from transaction,unit,product where unit.product_id = product.id and transaction.unit_code = unit.barcode group by unit_code order by sum(transaction.quantity) asc limit 1)',
      values: []
    };
  
  return dbops.query(query);
}

exports.getMauvaisProduitDuJour = ()=> {

  const query = {
      name: 'fetch-daily-worst-product',
      text: 'select designation,property from unit,product where unit.product_id = product.id and unit.barcode = (select unit_code from transaction,unit,product,receipt where unit.product_id = product.id and transaction.unit_code = unit.barcode and transaction.receipt_id = receipt.id and receipt.timestamp::date = current_date group by unit_code order by sum(transaction.quantity) asc limit 1)',
      values: []
    };
  
  return dbops.query(query);
}

exports.getMeuilleurRecette = ()=> {

  const query = {
      name: 'fetch-best-recipe',
      text: 'select receipt.timestamp::date,sum(transaction.unit_price*transaction.quantity) from transaction,unit,product,receipt where transaction.unit_code = unit.barcode and receipt.id = transaction.receipt_id and unit.product_id = product.id group by receipt.timestamp::date order by sum desc limit 1',
      values: []
    };
  
  return dbops.query(query);
}

exports.getMauvaiseRecette = ()=> {

  const query = {
      name: 'fetch-worst-recipe',
      text: 'select receipt.timestamp::date,sum(transaction.unit_price*transaction.quantity) from transaction,unit,product,receipt where transaction.unit_code = unit.barcode and receipt.id = transaction.receipt_id and unit.product_id = product.id group by receipt.timestamp::date order by sum asc limit 1',
      values: []
    };
  
  return dbops.query(query);
}

exports.getNombreDeProduits = () => {

  const query = {
      name: 'fetch-number-of-products',
      text: 'select count(*) from product',
      values: []
    };
  
  return dbops.query(query);
}

exports.getToutProduits = () => {

  const query = {
      name: 'fetch-all-products',
      text: 'select barcode,designation, stock_price, unit_price, property, quantity from product, unit where unit.product_id = product.id',
      values: []
    };
  
  return dbops.query(query);
}

exports.getToutFactures = () => {

  const query = {
      name: 'fetch-all-receipts',
      text: 'select receipt_id, unit_code, quantity from transaction, receipt where receipt.id = transaction.receipt_id',
      values: []
    };
  
  return dbops.query(query);
}

exports.getGainsTotalDeJour = (date) => {

  const query = {
      name: 'fetch-daily-gains',
      text: 'select sum(transaction.unit_price*transaction.quantity) from transaction, product, unit, receipt where transaction.unit_code = unit.barcode and unit.product_id = product.id and transaction.receipt_id = receipt.id and receipt.timestamp::date = $1',
      values: [date]
    };
  
  return dbops.query(query);
}

exports.getFondsTotalDeJour = (date) => {

  const query = {
      name: 'fetch-daily-funds',
      text: 'select sum(stock_price*quantity) from transaction,receipt where transaction.receipt_id = receipt.id and receipt.timestamp::date = $1',
      values: [date]
    };
  
  return dbops.query(query);
}

exports.getTransactionsAvecCredit = (person) => {

  const query = {
    name: 'fetch-transactions-with-debt-per-person',
    text: 'select sum(select * from transaction where receipt_id in (select id from receipt where person = $1 and debt <> 0)',
    values: [person]
  };

  return dbops.query(query);

}

exports.getCreditParPersonne = () => {

  const query = {
    name: 'fetch-debt-per-person',
    text: 'select person, sum(debt) from receipt where debt <> 0 group by person;',
    values: []
  };

  return dbops.query(query);

}

exports.saveProduit = (product) => {

  const query = {
    name: 'save-product',
    text: 'INSERT INTO product(designation, stock_price, unit_price, timestamp) VALUES($1, $2, $3, $4) RETURNING *',
    values: [product.designation, product.stock_price, product.unit_price, currentTime()]
  };

  return dbops.query(query);

}

exports.saveUnit = (unit) => {

  const query = {
    name: 'save-unit',
    text: 'INSERT INTO unit(barcode, product_id, property, quantity, timestamp) VALUES($1, $2, $3, $4, $5) RETURNING *',
    values: [unit.barcode, unit.product_id, unit.property, unit.quantity, currentTime()]
  };

  return dbops.query(query);

}

exports.saveTransaction = (transaction) => {

  const query = {
    name: 'save-transaction',
    text: 'INSERT INTO transaction(unit_code, receipt_id, quantity, status, stock_price, unit_price) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
    values: [transaction.unit_code, transaction.receipt_id, transaction.quantity, transaction.status, transaction.stock_price, transaction.unit_price]
  };

  return dbops.query(query);

}

exports.saveReceipt = (receipt) => {

  const query = {
    name: 'save-receipt',
    text: 'INSERT INTO receipt(person, debt, timestamp) VALUES($1, $2, $3) RETURNING *',
    values: [receipt.person, receipt.debt, currentTime()]
  };

  return dbops.query(query);

}
exports.updateStockQuantity = (barcode,quantity) => {

  var query = {
    name: 'update-stock-quantity',
    text: 'update unit set quantity = quantity - $1 where barcode = $2 returning *',
    values : [quantity,barcode]
  };

  return dbops.query(query);

}

exports.updateStockPrice = (id,stockPrice) => {

  var query = {
    name: 'update-stock-price',
    text: 'update product set stock_price = $1 where id = $2 returning *',
    values : [stockPrice,id]
  };

  return dbops.query(query);

}

currentTime = () => {

  date = new Date();
  date = date.getUTCFullYear() + '-' +
      ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
      ('00' + date.getUTCDate()).slice(-2) + ' ' + 
      ('00' + date.getUTCHours()).slice(-2) + ':' + 
      ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
      ('00' + date.getUTCSeconds()).slice(-2);
  
  return date;

}