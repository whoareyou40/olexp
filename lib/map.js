

//增加弹出图层
//map.addOverlay(overlay);
//vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([5e6, 7e6], 1e6))); //添加单个几何要素

var hintKey;
//设置地块样式
var blockStyles = {
    'Polygon': [new ol.style.Style({
        stroke: new ol.style.Stroke({  //区的边界样式
            color: '#0099ff',
            width: 1
        }),
        fill: new ol.style.Fill({  //区的填充样式
            color: 'rgba(255, 255, 255, 0.5)'
        })
    })]
};
/*开始专题图样式*/
/**
* 创建文本样式函数
* @param {ol.Feature} feature 要素
* @param  dom 要素样式html对象
*/
var createTypeTextStyle = function (feature) {


    //返回实例化的文本样式对象（ol.style.Text）
    return new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: 'line',
        text: feature.get("name"),
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3
        })
    })
};



/***结束专题图样式***/

/*开始正常模式样式*/
/**
 * 创建文本样式函数
 * @param {ol.Feature} feature 要素
 * @param  dom 要素样式html对象
 */
var createTextStyle = function (feature) {


    //返回实例化的文本样式对象（ol.style.Text）
    return new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: 'line',
        text: feature.get("id"),
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3
        })
    })
};

// 创建layer使用的style function，根据feature的自定义type，返回不同的样式
var layerStyleFunction = function (feature, resolution) {
    var id = feature.get('id');
    var style = null;


    if (id < 0) {
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({  //区的边界样式
                color: 'black',
                width: 0.5
            }),
            fill: new ol.style.Fill({  //区的填充样式
                color: 'rgba(255, 255, 255, 1)'
            })

        });
    }
    else if (id == 0) {
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({  //区的边界样式
                color: '#black',
                width: 0.5
            }),
            fill: new ol.style.Fill({  //区的填充样式
                color: 'rgba(220, 220 ,220, 1)'
            })
        });
    }
    else { // 其他形状
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({  //区的边界样式
                color: 'black',
                width: 0.5
            }),
            fill: new ol.style.Fill({  //区的填充样式
                color: 'rgba(152, 245, 255, 0.5)'
            }),
            text: createTextStyle(feature)
        });
    }





    // 返回 style 数组
    return [style];
};

// 创建layer使用的style function，根据feature的自定义type，返回不同的样式
var oLayerStyleFunction = function (feature, resolution) {
    var id = feature.get('id');
    var style = null;


    if (id < 0) {
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({  //区的边界样式
                color: 'black',
                width: 0.5
            }),
            fill: new ol.style.Fill({  //区的填充样式
                color: 'rgba(255, 255, 255, 1)'
            })

        });
    }
    else if (id == 0) {
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({  //区的边界样式
                color: '#black',
                width: 0.5
            }),
            fill: new ol.style.Fill({  //区的填充样式
                color: 'rgba(220, 220 ,220, 1)'
            })
        });
    }
    else if (id == 152) { // 其他形状
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({  //区的边界样式
                color: 'black',
                width: 0.5
            }),
            fill: new ol.style.Fill({  //区的填充样式
                color: 'rgba(0, 0 , 255, 0.5)'
            }),
            text: createTextStyle(feature)
        });
    }
    else if (id == 201) { // 其他形状
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({  //区的边界样式
                color: 'black',
                width: 0.5
            }),
            fill: new ol.style.Fill({  //区的填充样式
                color: 'rgba(255, 0 , 0, 0.5)'
            }),
            text: createTextStyle(feature)
        });
    }
    else { // 其他形状
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({  //区的边界样式
                color: 'black',
                width: 0.5
            }),
            fill: new ol.style.Fill({  //区的填充样式
                color: 'rgba(255, 255 ,0, 0.5)'
            }),
            text: createTextStyle(feature)
        });
    }

    // 返回 style 数组
    return [style];
};

/***结束专题图样式***/

var blockStyleFunction = function (feature, resolution) {
    return blockStyles[feature.getGeometry().getType()]; //根据要素类型设置几何要素的样式
};
var vectorSource = new ol.source.Vector({
    url: "geojson/floor1_4326.geojson",
    format: new ol.format.GeoJSON()
});
var vectorLayer = new ol.layer.Vector({
    source: vectorSource, //矢量数据源
    style: layerStyleFunction,  //样式设置               
});
function loadBlock(fid) {
    //增加地块
    if (fid == "01") {
        map.addLayer(vectorLayer); //将矢量图层加载到地图中  
    }
    else {
        map.removeLayer(vectorLayer);
    }
}

//loadBlock("01");
//根据id选择地块
function selectFeatureByID(UNo) {


    var features = vectorLayer.getSource().getFeatures();
    console.info(features);
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        //   console.info(feature);


        if (feature.get('id') == UNo) {
            var coordinates = feature.getGeometry().getCoordinates();
            var polygon = turf.polygon(coordinates);//将坐标转换为多边形对象
            var pt = turf.toWgs84(polygon);
            console.info(pt.geometry.coordinates);
            myMap.zoomToFeature(pt.geometry.coordinates);
        }


    }

};
//取消高亮
function cleanHighlight() {
    myMap.cleanHighlightPolygon();
}

function stopHint() {
    map.unByKey(hintKey);
}

//点击跳转
function clickZoom() {
    myMap.selectFeature();
    //选择多边形事件
    myMap.selectClick.on('select', function (event) {
        //  var pixel = map.getEventPixel(event.originalEvent);
        //   var hit = map.hasFeatureAtPixel(pixel);
        if (event.selected[0] != null) {
            //      myMap.selectClick.getFeatures().clear();


            console.info(event.selected[0]);
            var a = event.selected[0].getGeometry().getCoordinates();



            console.info(a);
            var polygon = turf.polygon(a);
            var pt = turf.toWgs84(polygon);
            //       myMap.zoomToFeature(pt.geometry.coordinates);
            w2popup.load({
                url: 'detail.html',
                showMax: true,
                width: 800,
                height: 600,
                onClose: function (event) { console.info("清除"); w2popup.clear(); },
            })

        }
    });
}

//  clickZoom();

//地块提示
function startHint() {
    stopHint();
    hintKey = map.on('pointermove', function (evt) {
        var pixel = map.getEventPixel(evt.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';//改变鼠标光标状态
        if (hit) {
            //当前鼠标位置选中要素
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function (feature, layer) {
                    return feature;
                });
            //如果当前存在热区要素   
            //   console.info(feature);
            if (feature) {
                if (feature.get('id') <= 0) {
                    popup.style.display = "none"; //销毁popup
                }
                else {
                    console.info(feature);
                    var geo = feature.getGeometry(); //获取要素的几何信息
                    var coordinates = geo.getCoordinates(); //获取几何坐标
                    //       console.info(coordinates);
                    /*
                    var polygon = turf.polygon(coordinates);//将几何坐标拼接为字符串
                    var pt = turf.toWgs84(polygon);
                    var area = turf.area(pt);
                    //    alert("绘制的面积是：" + area);
                   
                    area = area.toFixed(2);
                      */
                    popup.style.display = ""
                    var coordinate = evt.coordinate;

                    content.innerHTML = '<p>id:' + feature.get('id') + '</p>' + '<p>Area：' + feature.get('area') + ' Sqft</p>';
                    overlay.setPosition(coordinate);
                }
            }
            else {
                //隐藏弹出窗口
                popup.style.display = "none"; //销毁popup

            }
        }
        else {
            popup.style.display = "none"; //销毁popup

        }
    });
}

