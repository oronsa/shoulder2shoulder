angular.module('accountingShoulder')

//
.factory('filterUtils', function() {

    var objContainsInFields = function(item, search, fields){
        search = search.toLowerCase();
        for (var i = 0; i < fields.length; i++) {
            var fieldValue = getValue(item, fields[i]);
            if (fieldValue && fieldValue.toLowerCase().indexOf(search) >= 0)
                return true;
        }
        return false;
    };

    var getValue = function(item, fieldPath) {
        var obj = item;
        var pathArray = fieldPath.split('.');
        for (var i=0; i<pathArray.length; i++) {
            f = pathArray[i];
            if (obj[f])
                obj = obj[f];
            else
                return null;
        }
        return obj;
    };

    function fields(items, search, fields) {
        if(!search.length)
            return items;
        else{
            var filtered = [];
            for(var i = 0; i < search.length; i++) {
                angular.forEach(items, function(val) {
                   
                        if(objContainsInFields(val, search[i].toString(), fields))
                            filtered.push(val);
                });
            }
            return filtered;
        }
    }

    return {
        fields : fields
    };


});