﻿
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
            //    console.info(results[i].attributes);
                //        alert(object.id + ' - ' + object.get('playerName'));
                jsonArray[i] = results[i].attributes;
       //         console.info(jsonArray[i]["AreaType"]);
         //       jsonArray[i]["w2ui"] = { "style": "background-color: #98F5FF" };
                w2ui['myGrid'].add(results[i].attributes);
            }
        },
        error: function (error) {
            alert("查询失败: " + error.code + " " + error.message);
        }
    });
    var jsonArray2 = JSON.stringify(jsonArray);
   // console.info(jsonArray);

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
         //   console.log(record.UNo);
            selectFeatureByID(record.UNo);
            //使详细按钮可用
            $('#showDetail').attr('disabled', false);

          //  w2ui[showDetail].
            selectUnit = record.UNo;
        }
    });


    w2ui['aGrid'].add([
          { recid: 0, name: 'Floor 1', area: 29027, units: 11 },

    ]);

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


// $("#datepicker").datepicker();



//右下菜单
$('#aGrid').w2grid({
    header: 'Analysis',
    show: { header: true, columnHeaders: true },
    name: 'aGrid',
    columns: [
           
        { field: 'name', caption: 'Category', size: '50%' },
        { field: 'area', caption: 'Area', size: '30%' },
        { field: 'units', caption: 'Units', size: '20%' }
    ]
});
var vancatUnits = [];
var activeUnits = [];
var futureUnits = [];
var currAnalysis = 0;


function showOccupancy() {
   
    //设置右边颜色
    currAnalysis = 1;
    w2ui['myGrid'].clear();
    var nVancatUnit = 0;
    var nActiveUnit = 0;
    var nFutureUnit = 0;
    var nVancatArea = 0;
    var nActiveArea = 0;
    var nFutureArea = 0;
    vancatUnits = [];
    activeUnits = [];
    futureUnits = [];

    var nAreas = 0;
    for (var i = 0; i < jsonArray.length; i++) {
        //    var object = results[i];
        //    console.info(results[i].attributes);
        //        alert(object.id + ' - ' + object.get('playerName'));
        //     jsonArray[i] = results[i].attributes;
        console.info(jsonArray[i]["LeaseStartDate"]);
        var leaseStartDate = new Date(jsonArray[i]["LeaseStartDate"]);
        var leaseEndDate = new Date(jsonArray[i]["LeaseEndDate"]);
        var area = jsonArray[i]["UnitArea"];
        var unid = jsonArray[i]["UNo"];
        console.info(unid);
        var asOfDate = new Date($("#asofdate").val());
        // var a = new Date('1/1/2016')
        //空置
        if ( asOfDate >= leaseEndDate) {
            jsonArray[i]["w2ui"] = { "style": "background-color: rgba(0, 0 , 255, 0.5)" };
            nVancatUnit = nVancatUnit + 1;
            nVancatArea = nVancatArea + area;
            vancatUnits.push(unid);
        }
      //活动
        else if (asOfDate < leaseEndDate && asOfDate >= leaseStartDate) {
            jsonArray[i]["w2ui"] = { "style": "background-color: rgba(255, 0 , 0, 0.5)" };
            nActiveUnit = nActiveUnit + 1;
            nActiveArea = nActiveArea + area;
            activeUnits.push(unid);
        }
         //未来
        else {
            jsonArray[i]["w2ui"] = { "style": "background-color: rgba(255, 255 , 0, 0.5)" };
            nFutureUnit = nFutureUnit + 1;
            nFutureArea = nFutureArea + area;
            futureUnits.push(unid);
        }
        w2ui['myGrid'].add(jsonArray[i]);
    }


    w2ui['aGrid'].clear();
    vectorLayer.setStyle(oLayerStyleFunction);
    //设置左下颜色
    w2ui['aGrid'].add([
              { recid: 0, name: 'Vancat', area: nVancatArea, units: nVancatUnit, "w2ui": { "style": "background-color: rgba(0, 0 , 255, 0.5)" } },
              { recid: 1, name: 'Active', area: nActiveArea, units: nActiveUnit, "w2ui": { "style": "background-color: rgba(255, 0 , 0, 0.5)" } },
              { recid: 2, name: 'Future', area: nFutureArea, units: nFutureUnit, "w2ui": { "style": "background-color: rgba(255, 255 , 0, 0.5)" } }

    ]);
  
}
var uVancatUnits = [];
var uUnits30 = [];
var uUnits3060 = [];
var uUnits6090 = [];
var uUnits90 = [];



//租约到期
function showLeaseExpiration() {

    uVancatUnits = [];
    uUnits30 = [];
    uUnits3060 = [];
    uUnits6090 = [];
    uUnits90 = [];

    //设置右边颜色
    currAnalysis = 2;
    w2ui['myGrid'].clear();
    var nVancatUnit = 0;
    var nUnit30 = 0;
    var nUnit3060 = 0;
    var nUnit6090 = 0;
    var nUnit90 = 0;
    var nVancatArea = 0;
    var nArea30 = 0;
    var nArea3060 = 0;
    var nArea6090 = 0;
    var nArea90 = 0;


    var nAreas = 0;
    for (var i = 0; i < jsonArray.length; i++) {
        //    var object = results[i];
        //    console.info(results[i].attributes);
        //        alert(object.id + ' - ' + object.get('playerName'));
        //     jsonArray[i] = results[i].attributes;
        console.info(jsonArray[i]["LeaseStartDate"]);
        var leaseStartDate = new Date(jsonArray[i]["LeaseStartDate"]);
        var leaseEndDate = new Date(jsonArray[i]["LeaseEndDate"]);
        var area = jsonArray[i]["UnitArea"];
        var unid = jsonArray[i]["UNo"];
       // console.info(unid);
        var asOfDate = new Date($("#asofdate").val());
        // var a = new Date('1/1/2016')
        var difference = (leaseEndDate - asOfDate) / 86400000;
    //    console.info(difference);
        //空置
        if (difference <0) {
            jsonArray[i]["w2ui"] = { "style": "background-color: #FFCCCC" };
            nVancatUnit = nVancatUnit + 1;
            nVancatArea = nVancatArea + area;
            uVancatUnits.push(unid);
        }
         //<30
        else if (difference < 30 && difference >= 0) {
            jsonArray[i]["w2ui"] = { "style": "background-color: #99CCFF" };
            nUnit30 = nUnit30 + 1;
            nArea30 = nArea30 + area;
            uUnits30.push(unid);
        }
        //30-60
        else if (difference < 60 && difference >= 30) {
            jsonArray[i]["w2ui"] = { "style": "background-color: #FFCC00" };
            nUnit3060 = nUnit3060 + 1;
            nArea3060 = nArea3060 + area;
            uUnits3060.push(unid);
        }
            //60-90
        else if (difference < 90 & difference >=60) {
            jsonArray[i]["w2ui"] = { "style": "background-color: #66CC00" };
            nUnit6090 = nUnit6090 + 1;
            nArea6090 = nArea6090 + area;
            uUnits6090.push(unid);
        }
            //90
        else if (difference >= 90) {
            jsonArray[i]["w2ui"] = { "style": "background-color: #FFFF99" };
            nUnit90 = nUnit90 + 1;
            nArea90 = nArea90 + area;
            uUnits90.push(unid);
        }
        else {
            jsonArray[i]["w2ui"] = { "style": "background-color: #FFFF99" };
        }

      
        w2ui['myGrid'].add(jsonArray[i]);
    }
    console.info(uVancatUnits);
    console.info(uUnits30);
    console.info(uUnits3060);
    console.info(uUnits6090);
    console.info(uUnits90);



    w2ui['aGrid'].clear();
    console.info(eLayerStyleFunction);
    vectorLayer.setStyle(eLayerStyleFunction);
    //设置左下颜色
    w2ui['aGrid'].add([
              { recid: 0, name: 'Vancat', area: nVancatArea, units: nVancatUnit, "w2ui": { "style": "background-color: #FFCCCC" } },
              { recid: 1, name: 'Within 30 days', area: nArea30, units: nUnit30, "w2ui": { "style": "background-color: #99CCFF" } },
              { recid: 2, name: 'Within 31-60 days', area: nArea3060, units: nUnit3060, "w2ui": { "style": "background-color: #FFCC00" } },
              { recid: 3, name: 'Within 61-90 days', area: nArea6090, units: nUnit6090, "w2ui": { "style": "background-color: #66CC00" } },
              { recid: 4, name: 'Over 90 days', area: nArea90, units: nUnit90, "w2ui": { "style": "background-color: #FFFF99" } }

    ]);
  









}

var NAUnits = [];
var BNKUnits = [];
var FASUnits = [];
var FNBUnits = [];
var WATUnits = [];


function showSalesCategory() {

    //设置右边颜色
    currAnalysis = 3;
    w2ui['myGrid'].clear();

    var nVancatUnit = 0;
    var nBNKUnit = 0;
    var nFASUnit = 0;
    var nFNBUnit = 0;
    var nWATUnit = 0;
    var nVancatArea = 0;
    var nBNKArea = 0;
    var nFASArea = 0;
    var nFNBArea = 0;
    var nWATArea = 0;

    NAUnits = [];
    BNKUnits = [];
    FASUnits = [];
    FNBUnits = [];
    WATUnits = [];

    var nAreas = 0;
    for (var i = 0; i < jsonArray.length; i++) {
        //    var object = results[i];
        //    console.info(results[i].attributes);
        //        alert(object.id + ' - ' + object.get('playerName'));
        //     jsonArray[i] = results[i].attributes;
     //   console.info(jsonArray[i]["LeaseStartDate"]);
        var leaseStartDate = new Date(jsonArray[i]["LeaseStartDate"]);
        var leaseEndDate = new Date(jsonArray[i]["LeaseEndDate"]);
        var SalesCategoryCode = jsonArray[i]["SalesCategoryCode"];
        var SalesCategoryDesc = jsonArray[i]["SalesCategoryDesc"];
        var area = jsonArray[i]["UnitArea"];
        var unid = jsonArray[i]["UNo"];
       // console.info(unid);
        var asOfDate = new Date($("#asofdate").val());
        // var a = new Date('1/1/2016')
        //空置
        if (asOfDate > leaseEndDate || asOfDate < leaseStartDate) {
            jsonArray[i]["w2ui"] = { "style": "background-color: #999966" };
            nVancatUnit = nVancatUnit + 1;
            nVancatArea = nVancatArea + area;
            NAUnits.push(unid);
        }
            //活动
        else if (SalesCategoryCode == "BNK") {

            jsonArray[i]["w2ui"] = { "style": "background-color: #FF9966" };
            nBNKUnit = nBNKUnit + 1;
            nBNKArea = nBNKArea + area;
            BNKUnits.push(unid);
        }
        else if (SalesCategoryCode == "FAS") {

            jsonArray[i]["w2ui"] = { "style": "background-color: #99CC99" };
            nFASUnit = nFASUnit + 1;
            nFASArea = nFASArea + area;
            FASUnits.push(unid);
        }
        else if (SalesCategoryCode == "FNB") {

            jsonArray[i]["w2ui"] = { "style": "background-color: #FFFF00" };
            nFNBUnit = nFNBUnit + 1;
            nFNBArea = nFNBArea + area;
            FNBUnits.push(unid);
        }
        else if (SalesCategoryCode == "WAT") {

            jsonArray[i]["w2ui"] = { "style": "background-color: #FFCC99" };
            nWATUnit = nWATUnit + 1;
            nWATArea = nWATArea + area;
            WATUnits.push(unid);
        }
        w2ui['myGrid'].add(jsonArray[i]);
    }


    w2ui['aGrid'].clear();
    vectorLayer.setStyle(cLayerStyleFunction);
    //设置左下颜色
    w2ui['aGrid'].add([
              { recid: 0, name: 'N/A', area: nVancatArea, units: nVancatUnit, "w2ui": { "style": "background-color: #999966" } },
              { recid: 1, name: 'Bank', area: nBNKArea, units: nBNKUnit, "w2ui": { "style": "background-color: #FF9966" } },
              { recid: 2, name: 'Fashion', area: nFASArea, units: nFASUnit, "w2ui": { "style": "background-color: #99CC99" } },
              { recid: 3, name: 'Food & Beverage', area: nFNBArea, units: nFNBUnit, "w2ui": { "style": "background-color: #FFFF00" } },
              { recid: 4, name: 'Watches', area: nWATArea, units: nWATUnit, "w2ui": { "style": "background-color: #FFCC99" } },

    ]);

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
 
  //  $(function () {

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
        var fulljsonArray = [];
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
                 //   console.info(results[i].attributes);
                    //        alert(object.id + ' - ' + object.get('playerName'));
                    fulljsonArray[i] = results[i].attributes;
                    fulljsonArray[i]["LeaseStartDate"] = jsonArray[i]["LeaseStartDate"].substring(0, 10);
                    fulljsonArray[i]["LeaseEndDate"] = jsonArray[i]["LeaseEndDate"].substring(0, 10);
                    //     jsonArray[i]["w2ui"] = { "style": "background-color: #98F5FF" };
                    w2ui['gridD0'].add(fulljsonArray[i]);
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

 //   });


}