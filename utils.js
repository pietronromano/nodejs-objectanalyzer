const COLUMN_REPLACER = "|";
const LINE_REPLACER  = " ";
const COLUMN_SEPARATOR = ",";
const regExCol = new RegExp(COLUMN_SEPARATOR,"g");
const regExNL = new RegExp("\n","g");

const ensureValidColValue = (val) => {
    if (val == undefined)
    {
        return "";
    }
    else {
        //Remove unwanted characters
        if(typeof val === "string") {
            if(val.search(COLUMN_SEPARATOR)) 
                val = val.replace(regExCol,COLUMN_REPLACER);
            if(val.search("\n"))
                val = val.replace(regExNL,LINE_REPLACER);
        }
        return val;
    }
}

module.exports = {
    ensureValidColValue: ensureValidColValue
 }