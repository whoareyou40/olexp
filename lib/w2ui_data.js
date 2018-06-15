

    //  var Bmob = require('libs/Bmob-1.4.2.min.js');

    // 初始化
    Bmob.initialize("2465744a3e089f92acc7d6a25e4b7c85", "f2ab910ec0789f63f9cb1aba5fb00b35");



var jsonArray = [];
var selectUnit = "";

$(function () {

    var unit = Bmob.Object.extend("unit");
    var query = new Bmob.Query(unit);
    jsonArray = [];
    //  var query = Bmob.Query('unit');
    query.find({
        success: function (results) {
            //  console.info(results);
            //    alert("共查询到 " + results.length + " 条记录");
            // 循环处理查询到的数据
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                console.info(results[i].attributes);
                //        alert(object.id + ' - ' + object.get('playerName'));
                jsonArray[i] = results[i].attributes;
                console.info(jsonArray[i]["AreaType"]);
         //       jsonArray[i]["w2ui"] = { "style": "background-color: #98F5FF" };
                w2ui['myGrid'].add(results[i].attributes);
            }
        },
        error: function (error) {
            alert("查询失败: " + error.code + " " + error.message);
        }
    });
    var jsonArray2 = JSON.stringify(jsonArray);
    console.info(jsonArray);

    var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px;';
    var myLayout = $('#myLayout').w2layout({
        name: 'myLayout',
        panels: [
            { type: 'top', size: 50 },
            { type: 'left', size: 200, resizable: false },
            { type: 'right', size: 300, resizable: false },
            { type: 'main', content: 'main', style: pstyle }
        ]
    });

    var rightLayout = $('#rightLayout').w2layout({
        name: 'rightLayout',
        panels: [
            { type: 'top', size: 600 },
            { type: 'main', content: 'main', style: pstyle }
        ]
    });
    var leftLayout = $('#leftLayout').w2layout({
        name: 'leftLayout',
        panels: [
            { type: 'top', size: 500 },
            { type: 'main', content: 'main'}
        ]
    });

    var topLayout = $('#topLayout').w2layout({
        name: 'topLayout',
        panels: [
            { type: 'left', size: 600 },
            { type: 'right' }
        ]
    });
    //  w2ui['myGrid'].add({ "recid": "11", "UPNo": "SJM", "FNo": "01", "UNo": "100", "UnitType": "RT", "UnitTypeDesc": "Retail", "UnitStartDate": "01/01/18", "UnitEndDate": "12/31/55", "AreaType": "GFA", "AreaTypeDesc": "Gross Floor Area", "UnitArea": "990.00" })

    // set new content
    //   w2ui['myLayout'].content('main', 'HTML content');
    // set content as an object

    w2ui['myLayout'].content('right', w2ui['rightLayout']);
    w2ui['myLayout'].content('left', w2ui['leftLayout']);

    w2ui['myLayout'].content('top', w2ui['topLayout']);
    //w2ui['myLayout'].content('top', w2ui['toolbar']);

    w2ui['rightLayout'].content('top', w2ui['myGrid']);
   // w2ui['rightLayout'].content('main', w2ui['aGrid']);

    w2ui['leftLayout'].content('top', w2ui['leftSidebar']);
    w2ui['leftLayout'].content('main', w2ui['leftForm']);

    w2ui['topLayout'].content('left', w2ui['toolbar']);
    w2ui['topLayout'].content('right', w2ui['leftForm']);

    w2ui['myLayout'].load('main', 'map.html');

    // then define the sidebar
    /*
    w2ui['myLayout'].content('left', $().w2sidebar({
        name: 'sidebar',
        img: null,
        nodes: [
            {
                id: 'Building1', text: 'SJM', img: 'icon-folder', expanded: true, group: true,
                nodes: [{ id: '01', text: 'Floor 1', img: 'icon-page' },
                         { id: '02', text: 'Floor 2', img: 'icon-page' },
                         { id: '03', text: 'Floor 3', img: 'icon-page' }
                ]
            }
        ],
        onClick: function (event) {
            console.info(event.target);
            //     loadBlock(event.target);

        }
    }));*/
    //右数据菜单
    $('#myGrid').w2grid({
        name: 'myGrid',
        show: {
            toolbar: true,
        },
        columns: [
            { field: 'UNo', caption: 'Unit Number', size: '30%' },
            { field: 'UnitType', caption: 'Unit Type', size: '30%' },
            { field: 'UnitArea', caption: 'Unit Area', size: '40%' }
        ],
        records: jsonArray,
        onClick: function (event) {

            var record = this.get(event.recid);
            console.log(record.UNo);
            selectFeatureByID(record.UNo);
            //使详细按钮可用
            $('#showDetail').attr('disabled', false);

          //  w2ui[showDetail].
            selectUnit = record.UNo;
        }
    });

});

$('#leftForm').w2form({
    name: 'leftForm',
    width: 100,
    fields: [
        { name: 'As of Date', type: 'date' }
    ]
});

$('#leftSidebar').w2sidebar({
    name: 'leftSidebar',
    img: null,
    nodes: [
        {
            id: 'Building1', text: 'SJM', img: 'icon-folder', expanded: true, group: true,
            nodes: [{ id: '01', text: 'Floor 1', img: 'icon-page' },
                     { id: '02', text: 'Floor 2', img: 'icon-page' },
                     { id: '03', text: 'Floor 3', img: 'icon-page' }
            ]
        }
    ],
    onClick: function (event) {
        console.info(event.target);
        //     loadBlock(event.target);

    }
});

//菜单栏
$('#toolbar').w2toolbar({
    name: 'toolbar',
    width:600,
    items: [

        { type: 'break', id: 'break0' },
        {
            type: 'check', id: 'Occupancy', caption: 'Occupancy', icon: 'icon-add',
            onClick: function (event) {
                console.log('item ' + event.target + ' is clicked.');
                showOccupancy();
            }
        },
        {
            type: 'button', id: 'showDetail', text: 'Show Detail', img: 'icon-page', disabled: true, style: "padding: 4px; border: 1px solid #dfdfdf; border-radius: 3px",
            onClick: function (event) {
 
                popupFunction();
            }
        },
                    {
                        type: 'button', id: 'date', text: 'As of Date', img: 'icon-page',  style: "padding: 4px; border: 1px solid #dfdfdf; border-radius: 3px",
                        onClick: function (event) {
 
                            w2popup.open({
                                title: 'Popup Title',
                                body: '<div class="w2ui-centered"><input name="dob" type="us-date"></div>'
                            });
                        }
                    },

       { type: 'html',  id: 'item5',
           html: function (item) {
               var html =
                  '<input id ="datepicker" name="us-date" type="us-date">';

               return html;
           }
       }
           
    ],
    onRender: function (event) {
        $('input[type=us-date]').w2field('date');
    }
});
// $("#datepicker").datepicker();



//右下菜单
$('#aGrid').w2grid({
    header: 'Analysis',
    show: { header: true, columnHeaders: true },
    name: 'aGrid',
    columns: [
           
        { field: 'name', caption: 'Category', size: '100px' },
        { field: 'area', caption: 'Area', size: '30%' },
        { field: 'units', caption: 'Units', size: '30%' }
    ]
});


function showOccupancy() {
    w2ui['aGrid'].clear();
    vectorLayer.setStyle(oLayerStyleFunction);
    //设置左下颜色
    w2ui['aGrid'].add([
              { recid: 0, name: 'Vancat', area: 50, units: 1, "w2ui": { "style": "background-color: rgba(0, 0 , 255, 0.5)" } },
              { recid: 1, name: 'Active', area: 200, units: 1, "w2ui": { "style": "background-color: rgba(255, 0 , 0, 0.5)" }},
              { recid: 2, name: 'Future', area: 300 , units: 9 , "w2ui": { "style": "background-color: rgba(255, 255 , 0, 0.5)" }}

    ]);
    //设置右边颜色
    w2ui['myGrid'].clear();
    for (var i = 0; i < jsonArray.length; i++) {
        //    var object = results[i];
        //    console.info(results[i].attributes);
        //        alert(object.id + ' - ' + object.get('playerName'));
        //     jsonArray[i] = results[i].attributes;
        console.info(jsonArray[i]["UNo"]);
        if (jsonArray[i]["UNo"] == "152") {
            jsonArray[i]["w2ui"] = { "style": "background-color: rgba(0, 0 , 255, 0.5)" };
        }
        else if (jsonArray[i]["UNo"] == "201") {
            jsonArray[i]["w2ui"] = { "style": "background-color: rgba(255, 0 , 0, 0.5)" };
        }
        else {
            jsonArray[i]["w2ui"] = { "style": "background-color: rgba(255, 255 , 0, 0.5)" };
        }
        w2ui['myGrid'].add(jsonArray[i]);
    }
}



//弹出详细信息
function popupFunction() {
    // w2popup.clear();
    //   $("#detailLayout").empty();
    if (w2ui['detailLayout']) w2ui['detailLayout'].destroy();
    if (w2ui['gridD1']) w2ui['gridD1'].clear();
    if (w2ui['gridD0']) w2ui['gridD0'].clear();
    if (w2ui['gridD2']) w2ui['gridD2'].clear();
    w2popup.open({
        title: 'Detail',
        body: '<div id="detailLayout" style="width: 100%; height: 100%;"></div>',
        showMax: true,
        width: 800,
        height: 600,
        onOpen: function (event) {
            event.onComplete = function () {
                //         $('#w2ui-popup #detailLayout').w2render('detailLayout');
                w2ui['detailLayout'].content('top', w2ui['gridD0']);
                w2ui['detailLayout'].content('left', w2ui['gridD1']);
                w2ui['detailLayout'].content('main', w2ui['gridD2']);
            };
        },
        onToggle: function (event) {
            event.onComplete = function () {
                w2ui.layout.resize();
            }
        }
    });

    $(function () {

        var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
        if (!(w2ui['detailLayout'])) {
            $('#detailLayout').w2layout({
                name: 'detailLayout',
                panels: [
                    { type: 'top', size: 200, style: pstyle, content: 'top' },
                    { type: 'left', size: 300, style: pstyle, content: 'left' },
                    { type: 'main', style: pstyle, content: 'main' }
                ]
            });
        }

        if (!(w2ui['gridD0'])) {
            $('#gridD0').w2grid({
                name: 'gridD0',
                header: 'Detail',
                show: { header: true },
                columns: [
                    { field: 'UPNo', caption: 'Property Code', size: '100px', sortable: true, attr: 'align=center' },
                    { field: 'FNo', caption: 'Floor Number', size: '30%', sortable: true },
                    { field: 'UNo', caption: 'Unit Code', size: '40%' },
                    { field: 'ULNo', caption: 'Lease Number', size: '120px' },
                    { field: 'LeaseStartDate', caption: 'Lease Start Date', size: '120px' },
                    { field: 'LeaseEndDate', caption: 'Lease End Date', size: '120px' }
                ],
                onClick: function (event) {
                    w2ui['gridD2'].clear();
                    var record = this.get(event.recid);
                    w2ui['gridD2'].add([
                        { recid: 0, name: 'Tennat ID', value: record.TenantID },
                        { recid: 1, name: 'LegalName', value: record.LegalName },
                        { recid: 2, name: 'Sales Category Code', value: record.SalesCategoryCode },
                        { recid: 3, name: 'Sales Category Description', value: record.SalesCategoryDesc },
                        { recid: 4, name: 'Lease Start Date', value: record.LeaseStartDate.substring(0,10) },
                        { recid: 5, name: 'Lease End Date', value: record.LeaseEndDate.substring(0, 10) },
                        { recid: 6, name: 'Charge Amount', value: record.ChargeAmount },
                        { recid: 7, name: 'Charge Frequency', value: record.ChargeFrequency },
                        { recid: 8, name: 'Charge Frequency Description', value: record.ChargeFrequencyDescription }
                    ]);

                    w2ui['gridD1'].clear();
                    var record = this.get(event.recid);
                    w2ui['gridD1'].add([
                        { recid: 0, name: 'Property Code', value: record.GroupingValue },
                        { recid: 1, name: 'Property Name', value: record.GroupingType },
                        { recid: 2, name: 'Country', value: record.Country },
                        { recid: 3, name: 'City', value: record.City },
                        { recid: 4, name: 'Address', value: record.Address }
                    ]);

                }
            });

            $('#gridD2').w2grid({
                header: '',
                show: { header: true, columnHeaders: false },
                name: 'gridD2',
                columns: [
                    { field: 'name', caption: 'Name', size: '200px', style: 'background-color: #efefef; border-bottom: 1px solid white; padding-right: 5px;', attr: "align=right" },
                    { field: 'value', caption: 'Value', size: '100%' }
                ]
            });


            $('#gridD1').w2grid({
                header: '',
                show: { header: true, columnHeaders: false },
                name: 'gridD1',
                columns: [
                    { field: 'name', caption: 'Name', size: '200px', style: 'background-color: #efefef; border-bottom: 1px solid white; padding-right: 5px;', attr: "align=left" },
                    { field: 'value', caption: 'Value', size: '100%' }
                ]
            });
        }

        //取得所有租约
        var leases = Bmob.Object.extend("full");
        var query = new Bmob.Query(leases);
        query.equalTo("UNo", selectUnit);
        //  var query = Bmob.Query('unit');
        query.limit(1);
        query.find({
            success: function (results) {
                //  console.info(results);
                //    alert("共查询到 " + results.length + " 条记录");
                // 循环处理查询到的数据
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    console.info(results[i].attributes);
                    //        alert(object.id + ' - ' + object.get('playerName'));
                    jsonArray[i] = results[i].attributes;
                    jsonArray[i]["LeaseStartDate"] = jsonArray[i]["LeaseStartDate"].substring(0, 10);
                    jsonArray[i]["LeaseEndDate"] = jsonArray[i]["LeaseEndDate"].substring(0, 10);
                    //     jsonArray[i]["w2ui"] = { "style": "background-color: #98F5FF" };
                    w2ui['gridD0'].add(jsonArray[i]);
                }
            },
            error: function (error) {
                alert("查询失败: " + error.code + " " + error.message);
            }
        });


        w2ui['gridD1'].add([
            { recid: 0, name: 'Property Code', value: '' },
            { recid: 1, name: 'Property Name', value: '' },
            { recid: 2, name: 'Country:', value: '' },
            { recid: 3, name: 'City', value: '' },
            { recid: 4, name: 'Address', value: "" }
        ]);

        w2ui['gridD2'].add([
                    { recid: 0, name: 'Tennat ID' },
                    { recid: 1, name: 'LegalName' },
                    { recid: 2, name: 'Sales Category Code' },
                    { recid: 3, name: 'Sales Category Description' },
                    { recid: 4, name: 'Lease Start Date' },
                    { recid: 5, name: 'Lease End Date' },
                    { recid: 6, name: 'Charge Amount' },
                    { recid: 7, name: 'Charge Frequency' },
                    { recid: 8, name: 'Charge Frequency Description' }
        ]);

    });


}