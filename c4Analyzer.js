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
    var content = "Id,Diagram,c4Application,c4Name,c4Container,c4Parent,c4Technology,c4Type,c4Description\n";
    outputArray.forEach(element => {
      content = content + element.id + COLUMN_SEPARATOR  
            + element.diagram + COLUMN_SEPARATOR
            + utils.ensureValidColValue(element.c4Application) + COLUMN_SEPARATOR
            + utils.ensureValidColValue(element.c4Name) + COLUMN_SEPARATOR
            + utils.ensureValidColValue(element.c4Container) + COLUMN_SEPARATOR
            + utils.ensureValidColValue(element.c4Parent) + COLUMN_SEPARATOR
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
                        parentId: "",
                        parentElement: undefined,
                        childElements: [],
                        c4Name: e.$.c4Name, 
                        c4Application: e.$.c4Application, 
                        c4Container: e.$.c4Container,
                        c4Parent: e.$.c4Parent,
                        c4Description: e.$.c4Description, 
                        c4Technology: e.$.c4Technology, 
                        c4Type: e.$.c4Type 
                    };

                    var geometry = e.mxCell[0].mxGeometry[0].$;
                    c4Element.x = parseInt(geometry.x); 
                    c4Element.y= parseInt(geometry.y);  
                    c4Element.width= parseInt(geometry.width);  
                    c4Element.height= parseInt(geometry.height); 
                    outputArray.push(c4Element);
                }

            });
        }
   });

   //Links the parents
   linkParents(outputArray);
}

const linkParents = (outputArray) =>{
    outputArray.forEach(element => {
        for (let i = 0; i < outputArray.length; i++) {
            const child = outputArray[i];
            isEl2InsideEl1(element,child);
        }
    });
      
}

const isEl2InsideEl1 = (el1, el2) => {
    if ((el1.x < el2.x) && ((el1.x + el1.width) > el2.x )) {
        if ((el1.y < el2.y) && ((el1.y + el1.height) > el2.y )) {
            el2.parentElement = el1;
            el1.childElements.push(el2);
            if ((el1.c4Name && el2.c4Name))
                console.log(el1.c4Name + " is parent of " + el2.c4Name)
            return true;
        }
    }
}
	 
 module.exports = {
    analyzeProperties: analyzeProperties,
    linkParents: linkParents,
    writeToFile : writeToFile

 }