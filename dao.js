require('dotenv').config();
const fs = require('fs');

exports.getAll = async(dataset) =>{

    return new Promise((resolve, reject) => {
        
        fs.readdir(process.env.DATABASE_PATH, (err, files) => {
    
            if(err){
                console.log(err);
                return reject(err);
            }
    
            if(files.includes(dataset+'.ds')){
                
                console.log('Entity <'+dataset+'> found.');
                fs.readFile(process.env.DATABASE_PATH+dataset+'.ds', function read(err, data) {
                    
                    if (err) {
                        console.log(err);                
                        return reject(err);
                    }
    
                    const file_content = data.toString();
    
                    if(file_content.indexOf('{')!=0){

                        instance = '';
                        instances = [];
                        
                        for(i=file_content.indexOf('{')+1;file_content.charAt(i)!='}';i++){
                            
                            if(file_content.charAt(i)!=',') instance += file_content.charAt(i);
                            
                            else{
                                
                                data = instance.split('!');
                                instance = '';
                                instances.push(data);
                                
                            }
                        }
                        if(instances.length==0){
                            console.log('Empty Data Set');
                        }
                            console.log('\n'+instances.length+' instances returned.');
                        }

                        return resolve(instances);

                });
            }
            else{

                console.log('No such Entity.');
                return reject();

            }
        
        });
    });
}

exports.getBy = async(query) => {
                    
    return new Promise((resolve, reject) => {
        
        fs.readdir(process.env.DATABASE_PATH, (err, files) => {
    
            if(err){
                console.log(err);
                return reject(err);
            }
    
            parameters = query.split(':');
            dataset = parameters[0];
            attributes = parameters[1].split('?');

            if(files.includes(dataset+'.ds')){
                
                console.log('Entity <'+dataset+'> found.');
                fs.readFile(process.env.DATABASE_PATH+dataset+'.ds', function read(err, data) {
                    
                    if (err) {
                        console.log(err);                
                        return reject(err);
                    }
    
                    const file_content = data.toString();
    
                    console.log('performing a projection based on the following attributes: '+attributes);

                    /*if(!file_content.includes(attributes)){
                        console.log('FATAL: verify the attributes specified in the query');
                        return reject(err);
                    }
                    else{*/

                        existing_attributes = file_content.split(')')[0].split('?').slice(1);

                        if(file_content.indexOf('{')!=0){

                            instance = '';
                            instances = [];
                            
                            for(i=file_content.indexOf('{')+1;file_content.charAt(i)!='}';i++){
                                
                                if(file_content.charAt(i)!=',') instance += file_content.charAt(i);
                                
                                else{
                                    
                                    data = instance.split('!');

                                    units = [];
                                    
                                    for(k = 0; k<attributes.length; k++){
                                        for(j = 0 ; j <data.length ; j++){
                                            if(existing_attributes[j]==attributes[k]){
                                                //console.log(attributes[j]+":"+data[j]);
                                                units.push(data[j]);
                                            }
                                        }
                                    }

                                    instance = '';
                                    instances.push(units);

                                }
                            }
                            if(instances.length==0){
                                console.log('Empty Data Set');
                            }
                                console.log('\n'+instances.length+' instances returned.');
                            }
    
                            return resolve(instances);

                    //}

                });
            }
            else{

                console.log('No such Entity.');
                return reject();

            }
        
        });
    });
}

exports.getOnly = async(query) => {
                    
    return new Promise((resolve, reject) => {
        
        fs.readdir(process.env.DATABASE_PATH, (err, files) => {
    
            if(err){
                console.log(err);
                return reject(err);
            }
    
            parameters = query.split(':');
            dataset = parameters[0];
            attributes = parameters[1].split('?');
            expressions = [];
            
            for(i = 0; i < attributes.length; i++){
                if(attributes[i].includes('=')){
                    expressions.push({left:attributes[i].split('=')[0],right:attributes[i].split('=')[1]});
                    attributes[i] = attributes[i].split('=')[0];
                }
            }
            
            /*expressions.forEach(ex=>{
                console.log('# : '+ex.left + ' = '+ex.right);
            });
            console.log('attributes : '+attributes);*/
            
            if(files.includes(dataset+'.ds')){
                
                console.log('Entity <'+dataset+'> found.');
                fs.readFile(process.env.DATABASE_PATH+dataset+'.ds', function read(err, data) {
                    
                    if (err) {
                        console.log(err);                
                        return reject(err);
                    }
    
                    const file_content = data.toString();
    
                    console.log('performing a projection based on the following attributes: '+attributes);

                    /*if(!file_content.includes(attributes)){
                        console.log('FATAL: verify the attributes specified in the query');
                        return reject(err);
                    }
                    else{*/

                        existing_attributes = file_content.split(')')[0].split('?').slice(1);

                        if(file_content.indexOf('{')!=0){

                            instance = '';
                            instances = [];
                            
                            for(i=file_content.indexOf('{')+1;file_content.charAt(i)!='}';i++){
                                
                                if(file_content.charAt(i)!=',') instance += file_content.charAt(i);
                                
                                else{
                                    
                                    data = instance.split('!');

                                    units = [];
                                    criteria_satisfied = [];

                                    for(j = 0 ; j < expressions.length ; j++){
                                        for(k = 0 ; k < attributes.length; k++){
                                            if(attributes[k]==expressions[j].left){
                                                for(o = 0 ; o < data.length ; o++){
                                                    if(expressions[k].right==data[o]){
                                                        criteria_satisfied.push(true);
                                                        console.log('criteria is satisfied for : '+expressions[k].right+'=='+data[o]);
                                                    }
                                                    else{
                                                        criteria_satisfied.push(false);
                                                        console.log('criteria is not satisfied for : '+expressions[k].right+'=='+data[o]);
                                                    }
                                                    //units.push(data[o]);
                                                }
                                            }
                                        }

                                            for(k = 0; k<criteria_satisfied.length; k++){
                                                if(criteria_satisfied[k]){
                                                    for(o = 0 ; o < data.length ; o++){
                                                        units.push(data[o]);
                                                    }
                                                }
                                            }
                                    }

                                    /*for(k = 0; k<attributes.length; k++){
                                        for(j = 0 ; j <data.length ; j++){
                                            if(existing_attributes[j]==attributes[k]){
                                                for(o = 0 ; o < expressions.length; o++){
                                                    if(expressions[o].left==attributes[k]){
                                                        if(expressions[o].right==data[j])
                                                        {
                                                            units.push(data[j]);
                                                            criteria_satisfied.push(true);
                                                            console.log('criteria satisfied: '+expressions[o].left+'=='+attributes[k]+' AND '+expressions[o].right+'=='+data[j]);
                                                        }
                                                        else
                                                        {
                                                            criteria_satisfied.push(false);
                                                            console.log('criteria not satisfied: '+expressions[o].left+'=='+attributes[k]+' AND '+expressions[o].right+'=='+data[j]);
                                                        }
                                                    }
                                                    else{
                                                        if(criteria_satisfied)
                                                            units.push(data[j]);
                                                    }
                                                }
                                                console.log(criteria_satisfied);
                                                if(criteria_satisfied[j])
                                                    units.push(data[j]);
                                            }
                                        }
                                    }*/

                                    instance = '';
                                    instances.push(units);

                                }
                            }

                            if(instances.length==0){
                                console.log('Empty Data Set');
                            }
                                console.log('\n'+instances.length+' instances returned.');
                            }
    
                            return resolve(instances);

                    //}

                });
            }
            else{

                console.log('No such Entity.');
                return reject();

            }
        
        });
    });
}

    exports.showAll = async() => {
        fs.readdir(process.env.DATABASE_PATH, (err, files) => {
    
            if(err){
                console.log(err);
                return;
            }
    
            datasets = [];

            files.forEach(file=>{
                datasets.push(file.substring(0,file.indexOf('.')));
            });

            return datasets;
        });
    }