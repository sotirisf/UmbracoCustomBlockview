angular.module("umbraco").controller("Umazel.Website.Blocks.CustomBlockController", function ($scope, $http, mediaResource, mediaHelper) {

    var vm = this;
    var blockAttrs;

    $http.get('/app_plugins/customblockview/config/config.json')
        .then(function success(response) {
            $scope.config = response.data;
            var docType = $scope.block.content.contentTypeAlias;

            blockAttrs = $scope.config.items.filter(function (el) { return el.name == docType })[0];
            if (blockAttrs === undefined) {
                blockAttrs = new Object();
                blockAttrs.titleAlias = $scope.config.defaultTitleAlias;
                blockAttrs.itemsAlias = $scope.config.defaultItemsAlias;
            } else {
                if (hasNoValue(blockAttrs.titleAlias)) {
                    blockAttrs.titleAlias = $scope.config.defaultTitleAlias;
                }
            }

            vm.childItemsCount = 0;
            Setup();

            vm.label = ($scope.block.label === '' || $scope.block.label === null) ? '(No title)' : $scope.block.label
        });

    $scope.$watch("block.data.disabled", function (newValue, oldValue) {
        if (newValue === oldValue) return;
        getIsDisabled();
    });

    function Setup() {
        getBlockName();
        getIsDisabled();
        if (vm.isDisabled === '0') {
            getMainImage();
            getChildItemsCount();
            getChildItemData();
        }
    }

    function hasNoValue(el) {
        return (el === undefined || el === "");
    }

    function getIsDisabled() {
        vm.isDisabled = $scope.block.data.disabled ?? false;
    }

    function getChildItemsCount() {

        if (hasNoValue(blockAttrs.itemsAlias)) {
            vm.childItemsCount = 0;
            return;
        }

        var subItems = $scope.block.data[blockAttrs.itemsAlias];

        // Check if 'items' is a multiple media picker rather than a nested block.
        if ((typeof subItems) === 'string') {
            vm.childItemsCount = (subItems !== undefined) ? (subItems.match(/umb:/g) || []).length : 0;
        } else {
            vm.childItemsCount = (subItems !== undefined) ? subItems.contentData.length : 0;
        }
    }

    function getMainImage() {
        if (hasNoValue(blockAttrs.mainImageAlias)) { return; }
        var mainImageVal = $scope.block.data[blockAttrs.mainImageAlias];
        loadImage(vm, mainImageVal, true);
    }

    function getChildItemData() {

        if (vm.childItemsCount === 0) { return; }

        var subItems = $scope.block.data[blockAttrs.itemsAlias];

        if (subItems === undefined || subItems.length === 0) {
            vm.subItems = null;
            vm.hasImages = null;
            return;
        }

        var subItemData;
        var hasImages = false;

        // Check if 'items' is a multiple media picker rather than a nested block.
        if ((typeof subItems) === 'string') {
            subItemData = (subItems !== undefined) ? (subItems.match(/umb:/g) || []) : 0;
        } else {
            subItemData = (subItems !== undefined) ? subItems.contentData : 0;
        }

        var subItems = [];

        for (var i = 0; i < subItemData.length; i++) {
            var subitem = new Object();
            var title = subItemData[i][blockAttrs.titleAlias];
            if (subItemData[i][blockAttrs.titleAlias] === undefined) { title = "(No title)"; }

            subitem.title = title;
            subitem.image = "";

            if (!hasNoValue(subItemData[i][blockAttrs.thumbsAlias])) {
                loadImage(subitem, subItemData[i][blockAttrs.thumbsAlias], false);
                hasImages = true;
            }

            subItems.push(subitem);
        }

        vm.subItems = subItems;
        vm.hasImages = hasImages;
    }

    function getBlockName() {
        var blockName = $scope.block.content.contentTypeName;
        vm.blockName = blockName;
    }

    function loadImage(it, propertyValue, isMain) {

        if (propertyValue === "") {
            if (isMain)
                it.mainImage = null;
            else
                it.image = null;
            return;
        }
        return mediaResource.getById(propertyValue)
            .then(function (ent) {
                var mediaPath = mediaHelper.resolveFile(ent, true);
                if (isMain)
                    it.mainImage = mediaPath;
                else
                    it.image = mediaPath;
            }, function () {
                if (isMain)
                    it.mainImage = null;
                else
                    it.image = null;
            });
    }

});
