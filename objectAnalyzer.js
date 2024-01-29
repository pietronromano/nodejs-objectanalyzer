const fs = require('fs')
const utils = require('./utils');

const PATH_SEPARATOR = "/";
const COLUMN_SEPARATOR = ",";
const COLUMN_REPLACER = "|";

/**
 * 
 * @param {*} outputArray 
 * @param {*} outputFilePath 
 * @param {*} sort 
 */
const writeToFile = (outputArray,outputFilePath, sort = false) =>{
    var content = "Id,Path,Level,Index,Property,Type,Value\n";
    //best not to sort, keeps order found in json file
    if(sort) {
        outputArray.sort((a, b) => {
            if (a.path < b.path) return -1;
            if (a.path > b.path) return 1;
            return 0;
        });
    }

    outputArray.forEach(element => {
      content = content + element.id + COLUMN_SEPARATOR  
                        + element.path + COLUMN_SEPARATOR
                        + element.level + COLUMN_SEPARATOR
                        + element.arrayIndex + COLUMN_SEPARATOR
                        + element.property + COLUMN_SEPARATOR
                        + element.propertyType  + COLUMN_SEPARATOR
                        + element.val + "\n"

    });
  
    try {
      fs.writeFileSync(outputFilePath, content);
      // file written successfully
    } catch (err) {
      console.error(err);
    }
}

/**
 * Add an item to the property list 
 * @param {*} outputArray 
 * @param {*} parentPath 
 * @param {*} property 
 * @param {*} val 
 * @returns 
*/
const addToList = (outputArray, path, property,val, propertyType,arrayIndex) => {
    const level = path.split(PATH_SEPARATOR).length -1;
    const id = outputArray.length + 1;
    if(!propertyType)
        propertyType = typeof val;

    if(!arrayIndex)
        arrayIndex = 1;
    //Remove unwanted characters
    val = utils.ensureValidColValue(val);

    var item = {
            id: id, 
            property: property, 
            val: val, 
            path: path,
            level: level,
            arrayIndex: arrayIndex,
            propertyType: propertyType};
    
    outputArray.push(item);
    return item;
}

/**
 * Analyzes all properties (including non-enumerable properties except for those which use Symbol) 
 * found directly in a given object.
  * @param {*} obj 
 * @param {*} path 
 */
const analyzeProperties = (outputArray,obj, parentPath = '',arrayIndex = 1)  =>{
    //Get the properties and sort them alphabetically
    const props = Object.getOwnPropertyNames(obj);
    //props.sort(); //best not to sort, keeps order found in json file

    let val;
    let path;
    props.forEach(p => {
        //Construct this property's path and add to list
        path = parentPath + PATH_SEPARATOR + p;
        val = obj[p];
        if (val instanceof Object) {
            if (val instanceof Array && val.length) {
                //See if it's an array of objects
                if (val[0] instanceof Object) {
                    addToList(outputArray,path, p, "[objects]","array",arrayIndex);
                    val.forEach((element, i) => {
                        let elementPath = path + "[" + (i+1) + "]";
                        //addToList(outputArray,elementPath, index, "object");
                        analyzeProperties(outputArray,element, elementPath,i+1);
                    });
                } else  { //array of values
                   let joinedValues = val.join(COLUMN_REPLACER);
                   addToList(outputArray,path, p, joinedValues,typeof val[0] + "s",1);
                }
            }
            else{ //Is object, but Not an array
                addToList(outputArray,path, p, "[object]","object",arrayIndex);
                analyzeProperties(outputArray,val, path,1);
            }
        } else { //it's a value
            addToList(outputArray,path, p, val,typeof val,arrayIndex);
        }
    });
}

	 
 module.exports = {
    analyzeProperties: analyzeProperties,
    writeToFile : writeToFile

 }