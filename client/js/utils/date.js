angular.module('accountingShoulder')

//
.factory('dateUtils', function() {

    function getMonths() {
        return ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    } 

    var getEqualDates = function(item, searchDate, fields) {
        for (var i = 0; i < fields.length; i++) {
            var fieldValue = moment(new Date(getValue(item, fields[i])));
            fieldValue.startOf('days');
            if (fieldValue.isValid() && !searchDate.diff(fieldValue, "days"))
                return true;
        }
        return false;
    };

    function dateFilter(items, searchDate, fields) {
        if(!searchDate)
            return items;
        else {
            var filtered = [];
            angular.forEach(items, function(val, key) {
                if(getEqualDates(val, moment(searchDate), fields))
                    filtered.push(val);
            });
        }
        return filtered;
    }

    function monthFilter(items, searchMonth) {
        if(!searchMonth || !searchMonth.isValid()) {
            return items;
        }
        var filtered = [];
        angular.forEach(items, function(val) {
            if(val.date.isValid() && val.date.month() === searchMonth.month()) {
                filtered.push(val);
            }
        });
        return filtered;
    }

    function convertDatesToMoment(items, reverse) {
        for(var i = 0; i < items.length; i++) {
            if(reverse) {
                items[i].date = items[i].date.toDate();
            }
            else {
                items[i].date = moment(items[i].date);
            }
        }
    }

    function rangeFilter(items, toDate, fromDate) {
        if(!toDate.isValid() || !fromDate.isValid()) {
            return items;
        }
        var filtered = [];
        angular.forEach(items, function(val) {
            if(val.date.isValid() && val.date.isSameOrAfter(fromDate) && val.date.isSameOrBefore(toDate)) {
                filtered.push(val);
            }
        });
        return filtered;
    }

    function getMinDate(items) {
        var min = moment();
        angular.forEach(items, function(val) {
            if(min.isAfter(val.date)) {
                min = val.date.clone();
            }
        });
        return min;
    }

    function getMaxDate(items) {
        var max = moment();
        angular.forEach(items, function(val) {
            if(max.isBefore(val.date)) {
                max = val.date.clone();
            }
        });
        return max;
    }

    function createDatesRange(start, end) {
        var arr = [];
        while(start.isSameOrBefore(end)) {
            arr.push({
                month : start.month(),
                year : start.year()
            });
            start.add(1, 'month');
        }
        return arr;
    }

    function generateDatesPickList(items) {
        var arr = [];
        var minBillDate = this.getMinDate(items);
        var maxBillDate = this.getMaxDate(items);
        var datesRange = this.createDatesRange(minBillDate, maxBillDate);
        for(var i = 0; i < datesRange.length; i++) {
            arr.push({ 
                year : datesRange[i].year, 
                month : this.getMonths()[datesRange[i].month] 
            });
        }
        return arr;
    }

    function generateDatesRange(range) {
        var arr = [];
        var currentMonth = moment().month(moment().month() - range/2)
        for(var i = 0; i < range; i++) {
            arr.push( {date : currentMonth.clone()} );
            currentMonth.add(1, 'month');
        }
        return arr;
    }
    
    function convertStringToDate(dateToConvert) {
        if(dateToConvert) {
            return moment(new Date(parseInt(dateToConvert.substring(dateToConvert.length - 4, dateToConvert.length)), this.getMonths().indexOf(dateToConvert.substring(0, dateToConvert.length - 5))));
        }
    }

    function convertDateToString(dateToConvert) {
        if(dateToConvert) {
            return dateToConvert.month + ' ' + dateToConvert.year;
        }
    }

    return {

        getMonths : getMonths,
        dateFilter : dateFilter,
        monthFilter : monthFilter,
        rangeFilter : rangeFilter,
        getMinDate : getMinDate,
        getMaxDate : getMaxDate,
        generateDatesRange : generateDatesRange,
        createDatesRange : createDatesRange,
        convertStringToDate : convertStringToDate,
        convertDatesToMoment : convertDatesToMoment,
        convertDateToString : convertDateToString,
        generateDatesPickList : generateDatesPickList
        
    };


});