(function(){
    'use strict';
    angular.module('app').factory('StatusService', StatusService);

    StatusService.$inject = ['FlashService'];
    function StatusService(fs){
        
        return {
            failStatus : failStatus,
            isBlank : isBlank,
            isOkData : isOkData
        }

        function failStatus(status, data){
            let data = JSON.stringify(data);
            if (status == 204)
                fs.error("response: No content");
            else if (status == 400)
                fs.error("response: Bad Request (" + data + ")");
            else if (status == 404)
                fs.error("response: Not Found (" + data + ")");
            else
                fs.error("response: Other errors (" + status + ") [" + data + "]");
        }

        function isBlank(data){
            return typeof data === 'undefined' || data == null || data === "";
        }

        function isOkData(status){
            return status == 200;
        }
    }
})();