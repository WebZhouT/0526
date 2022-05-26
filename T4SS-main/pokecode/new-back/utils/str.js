module.exports = {

    isNotEmpty(s){
        return s != null && String(s).trim() != '' && s != undefined;
    },
}