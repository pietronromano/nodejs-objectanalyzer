const fs = require('fs')
const utils = require('./utils');

const COLUMN_SEPARATOR = ",";

/**
 * 
 * @param {*} outputArray 
 * @param {*} outputFilePath 
 * @param {*} sort 
 */
const writeToFile = (outputArray,outputFilePath) =>{
    var content = "Id,Diagram,c4Application,c4Name,c4Description,c4Container,c4Technology,c4Type\n";
    outputArray.forEach(element => {
      content = content + element.id + COLUMN_SEPARATOR  
                        + element.diagram + COLUMN_SEPARATOR
                        + utils.ensureValidColValue(element.c4Application) + COLUMN_SEPARATOR
                        + utils.ensureValidColValue(element.c4Name) + COLUMN_SEPARATOR
                        + utils.ensureValidColValue(element.c4Container) + COLUMN_SEPARATOR
                        + utils.ensureValidColValue(element.c4Technology) + COLUMN_SEPARATOR
                        + utils.ensureValidColValue(element.c4Type) + COLUMN_SEPARATOR 
                        + utils.ensureValidColValue(element.c4Description) + "\n"
    });
  
    try {
      fs.writeFileSync(outputFilePath, content);
      // file written successfully
    } catch (err) {
      console.error(err);
    }
}

/**
 * Analyzes all properties (including non-enumerable properties except for those which use Symbol) 
 * found directly in a given object.
  * @param {*} obj 
  * obj.mxfile.diagram[1].mxGraphModel[0].root[0].object[1].$.c4Type
 * @param {*} path 
 */
const analyzeProperties = (outputArray,obj)  =>{

    const diagrams = obj.mxfile.diagram;

    diagrams.forEach (d => {
        var elements = d.mxGraphModel[0].root[0].object;
        if(elements) {
            elements.forEach (e => {
                if(e.$.c4Type) {
                    var c4Element = {
                        diagram:  d.$.name,
                        id: e.$.id,
                        c4Name: e.$.c4Name, 
                        c4Application: e.$.c4Application, 
                        c4Container: e.$.c4Container,
                        c4Description: e.$.c4Description, 
                        c4Technology: e.$.c4Technology, 
                        c4Type: e.$.c4Type 
                    };
                    outputArray.push(c4Element);
                }

            });
        }
   });

}

	 
 module.exports = {
    analyzeProperties: analyzeProperties,
    writeToFile : writeToFile

 }