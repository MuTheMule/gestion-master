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

for(i = 0 ; i < expressions.length && !is(expressions[i],projectionKeywords) && !projectionKeywordFound; i++){

  var operator;
  var value;
  var attribute;

  var j = i;

  for(j; !is(expressions[j],logicalConnectors) ;j++){

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
    
}

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
        //text: 'SELECT * FROM produit WHERE codebar=$1',
        text: 'select id,designation,property,stock_price,unit_price,quantity from product,unit where barcode = $1 and product.id = unit.product_id',
        values: [codebar]
      };
    
    return dbops.query(query);
}

exports.saveProduit = (produit)=> {

  const query = {
    name: 'save-produit',
    text: 'INSERT INTO produit(prix, designation, codebar) VALUES($1, $2, $3) RETURNING *',
    values: [produit.prix, produit.designation, produit.codebar]
  };

  return dbops.query(query);

}