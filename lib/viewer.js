function DMap() {
   
    //定义线图层
    var lineSource = new ol.source.Vector();
    //
    var styleFunction = function(feature) {
        var geometry = feature.getGeometry();
        var styles = [
          // linestring
          new ol.style.Style({
              stroke: new ol.style.Stroke({
                  color: '#ffcc33',
                  width: 2
              })
          })
        ];

        geometry.forEachSegment(function(start, end) {
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            // arrows
            styles.push(new ol.style.Style({
                geometry: new ol.geom.Point(end),
                image: new ol.style.Icon({
                    src: 'https://openlayers.org/en/v4.6.4/examples/data/arrow.png',
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation
                })
            }));
        });

        return styles;
    };

    var lineLayer = new ol.layer.Vector({
        source: lineSource,
        style: styleFunction
    });


    var vector = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: 'http://192.168.1.201:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=shanghai:location_3857&outputFormat=application/json&srsname=EPSG:3857'
        }),
        style: function (feature, resolution) {
            return new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    color: [113, 140, 0],
                    crossOrigin: 'anonymous',
                    src: 'https://openlayers.org/en/v4.6.4/examples/data/dot.png'
                }))
            });
        }
    });
   

    //本地未切片影像地图
        var localBeforeTileImgLayer = new ol.layer.Tile({
            visible: true,
            source: new ol.source.TileWMS({
                url: 'http://192.168.1.201:8080/geoserver/shanghai/wms',
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    tiled: true,
                    STYLES: '',
                    LAYERS: 'shanghai:shanghai',
                    tilesOrigin: 13152732.353133954 + "," + 2834155.8006814974
                }
            })
        });
    //本地切片影像图
        var localImgLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'http://192.168.1.201/gis/data/{z}/{x}/{y}.png'
            })

        }
    );
    //本地矢量地图
        var localVecLayer = new ol.layer.Tile({
            visible: true,
            source: new ol.source.TileWMS({
                url: 'http://192.168.1.201:8080/geoserver/shanghai/wms',
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    tiled: true,
                    STYLES: '',
                    LAYERS: 'shanghai:openlayers15',
                    tilesOrigin: 13152732.353133954 + "," + 2834155.8006814974
                }
            })
        });
   

    //初始化天地图影像地图
    var tiandituImgLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'
        })
    });
    //初始化天地图影像注记
    var tiandituCiaLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}'
        })
    });
    //初始化天地图矢量地图
    var tiandituVecLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}'
        })
    });
    //初始化天地图矢量注记
    var tiandituCvaLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
        })
    });
    //初始化openstreetmap矢量图层
    var osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    //数据源
    var vectSource = new ol.source.Vector({
    });
    //高亮层数据源
    var highlightSource = new ol.source.Vector({
    });

    //矢量要素（区）的样式
    var vectStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            color: '#0099ff',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#0099ff'
            })
        })
    });
    //矢量图层
    var vectLayer = new ol.layer.Vector({
        source: vectSource,
        style: vectStyle,
        opacity: 0.5
    });
    //高亮图层的样式
    var highlightStyle = new ol.style.Style({

        stroke: new ol.style.Stroke({
            color: 'red',
            width: 4
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#0099ff'
            })
        })
    });
    //高亮图层
    var highlightLayer = new ol.layer.Vector({
        source: highlightSource,
        style: highlightStyle,
        opacity: 0.8
    });
   

    //初始化地图对象
   // var map;
    this.getMap = function () {
        return map;
    }
 
    //初始化地图
    this.initMap = function () {
        this.map = map;
        map = new ol.Map({
            target: 'map',//地图容器div的ID
            //地图容器中加载的图层
            layers: [
                //加载瓦片图层数据
              osmLayer
            ],
            //地图视图设置
            view: new ol.View({
                center: [11535264, 3849980], //地图初始中心点
                zoom: 4 ,//地图初始显示级别
                minZoom: 18,
                maxZoom: 20
            }),
            controls: ol.control.defaults({
                attribution: false,
                rotate: false,
                zoom: false
            }),

        });

      //  tiandituImgLayer.setVisible(false);
     //   tiandituCiaLayer.setVisible(false);
     //   localVecLayer.setVisible(false);
      //  localImgLayer.setVisible(false);
        //添加绘图层
        map.addLayer(vectLayer);
        //添加高亮图层
        map.addLayer(highlightLayer);
      
      
    };

    this.unOsmLayer = function(){
        osmLayer.setVisible(false);
    }
    this.onOsmLayer = function () {
        osmLayer.setVisible(true);
    }

    this.righClick = function () {
      
        $(map.getViewport()).on("contextmenu", function (e) {
            e.preventDefault();
            //      var coordinate = map.getEventCoordinate(e);
            //     menu_overlay.setPosition(coordinate);
        //    alert("ccc");
            //  map.cleanPolygon();

            vectSource.clear();
        });
    }

    this.initDistrict = function () {
        map = new ol.Map({
            target: 'map',//地图容器div的ID
            //地图容器中加载的图层
            layers: [
                //加载瓦片图层数据
            osmLayer, tiandituImgLayer
            ],
            //地图视图设置
            view: new ol.View({
                center: [11535264, 3849980], //地图初始中心点
                zoom: 4,//地图初始显示级别
                minZoom: 4,
                maxZoom: 18
            }),
            controls: ol.control.defaults({
                attribution: false,
                rotate: false,
                zoom: false
            }),

        });
        osmLayer.setVisible(false);
        tiandituImgLayer.setVisible(false);
        map.addLayer(vectLayer);
    };


    // 放大地图
    this.zoomIn = function () {
        var view = map.getView();
        // 让地图的zoom增加1，从而实现地图放大
        view.setZoom(view.getZoom() + 1);
    };
    //缩小地图
    this.zoomOut = function () {
        var view = map.getView();
        // 让地图的zoom减小1，从而实现地图缩小
        view.setZoom(view.getZoom() - 1);
    };

    //移动到坐标点
    this.zoomToPoint = function (point) {
        var view = map.getView();
        view.setCenter(point);
   //     point.getCoordinates();
      //  var MUP = new ol.geom.Polygon(coordinates);
   //     var view = map.getView();
   //     view.fit(point, map.getSize());
        map.render();
    };

    //缩放到指定比例
    this.zoomTo = function (zoom) {
        var view = map.getView();
        view.setZoom(zoom);
    };


    //图层切换
    this.switchMap = function (n) {
        //切换到矢量图
        if (n == 1) {
            tiandituVecLayer.setVisible(true);
            tiandituCvaLayer.setVisible(true);
            tiandituImgLayer.setVisible(false);
            tiandituCiaLayer.setVisible(false);
         //   osmLayer.setVisible(false);
            localVecLayer.setVisible(false);
            localImgLayer.setVisible(false);
        }
        //切换到矢量图
        else if (n == 2) {
            tiandituVecLayer.setVisible(false);
            tiandituCvaLayer.setVisible(false);
            tiandituImgLayer.setVisible(true);
            tiandituCiaLayer.setVisible(true);
            localVecLayer.setVisible(false);
            localImgLayer.setVisible(false);
        }
        //切换到本地矢量图
        else if (n == 3) {
            tiandituVecLayer.setVisible(false);
            tiandituCvaLayer.setVisible(false);
            tiandituImgLayer.setVisible(false);
            tiandituCiaLayer.setVisible(false);
            localVecLayer.setVisible(true);
            localImgLayer.setVisible(false);
        }
        //切换到本地影像图
        else if (n == 4) {
            tiandituVecLayer.setVisible(false);
            tiandituCvaLayer.setVisible(false);
            tiandituImgLayer.setVisible(false);
            tiandituCiaLayer.setVisible(false);
            localVecLayer.setVisible(false);
            localImgLayer.setVisible(true);
        }
        //切换到无底图
        else if (n == 5) {
            tiandituVecLayer.setVisible(false);
            tiandituCvaLayer.setVisible(false);
            tiandituImgLayer.setVisible(false);
            tiandituCiaLayer.setVisible(false);
            localVecLayer.setVisible(false);
            localImgLayer.setVisible(false);
        }
    };


    this.addShanghai = function () {
        var style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.6)'
            }),
            stroke: new ol.style.Stroke({
                color: '#000',
                width: 1
            }),
            text: new ol.style.Text({
                font: '12px Calibri,sans-serif',
                fill: new ol.style.Fill({
                    color: '#000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 3
                })
            })
        });
        /*
        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(src, {     // 用readFeatures方法可以自定义坐标系
                    dataProjection: 'EPSG:4326',    // 设定JSON数据使用的坐标系
                    featureProjection: 'EPSG:3857' // 设定当前地图使用的feature的坐标系
                })
            })
        });
        */
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: '../lib/310100.geojson',
                format: new ol.format.GeoJSON(),
                dataProjection: 'EPSG:4326',    // 设定JSON数据使用的坐标系
                featureProjection: 'EPSG:3857' // 设定当前地图使用的feature的坐标系
            }),
            style: function (feature) {
                style.getText().setText(feature.get('name'));
                return style;
            }
        });

        map.addLayer(vectorLayer);
    }

    //加载geojson
    this.loadVectData = function (dataUrl) {
        //图层样式
        var labelStyle = new ol.style.Style({
            geometry: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                return geometry;
            },
            text: new ol.style.Text({
                font: '9px Calibri,sans-serif',
                overflow: 'line',
                fill: new ol.style.Fill({
                    color: '#000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 3
                })
            })
        });
        var color = new Array();
        color.push('rgba(173, 239, 115, 1)');
        color.push('rgba(64, 204, 183, 1)');
        color.push('rgba(218, 65, 85, 1)');
        color.push('rgba(194, 95, 209, 1)');
        color.push('rgba(88, 157, 230, 1)');
        color.push('rgba(230, 153, 65, 1)');
        color.push('rgba(67, 227, 99, 1)');
        color.push('rgba(154, 135, 239, 1)');
        color.push('rgba(105, 124, 230, 1)');
        color.push('rgba(174, 214, 15, 1)');
        color.push('rgba(213, 123, 101, 1)');
        color.push('rgba(17, 189, 227 1)');
        color.push('rgba(202, 78, 136, 1)');
        color.push('rgba(216, 130, 199, 1)');
        color.push('rgba(136, 44, 217, 1)');
        color.push('rgba(84, 228, 159, 1)');
        var countryStyle = new Array();
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[0]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[1]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[2]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[3]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[4]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[5]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[6]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[7]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[8]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[9]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[10]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[11]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[12]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[13]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[14]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));
        countryStyle.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color[15]
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        }));

        var style = [[countryStyle[0], labelStyle], [countryStyle[1], labelStyle], [countryStyle[2], labelStyle], [countryStyle[3], labelStyle], [countryStyle[4], labelStyle], [countryStyle[5], labelStyle], [countryStyle[6], labelStyle], [countryStyle[7], labelStyle], [countryStyle[8], labelStyle], [countryStyle[9], labelStyle], [countryStyle[10], labelStyle], [countryStyle[11], labelStyle], [countryStyle[12], labelStyle], [countryStyle[13], labelStyle], [countryStyle[14], labelStyle], [countryStyle[15], labelStyle]];
     //   var style1 = [countryStyle1, labelStyle];
        var district = ['崇明区', '虹口区', '嘉定区', '闵行区', '宝山区', '长宁区', '奉贤区', '金山区', '松江区', '普陀区', '青浦区', '静安区',  '徐汇区', '杨浦区','黄浦区', '浦东新区'];
      
      
    
        var vectorSource = new ol.source.Vector({
            url: dataUrl,
            format: new ol.format.GeoJSON()
        });
                /**
        * 创建区要素样式函数
        * @param {ol.Feature} feature 区要素
        
        var createPolygonStyleFunction = function (feature) {
            var fillColor = document.getElementById('polygons-fill-color').value;
            var strokeColor = document.getElementById('polygons-stroke-color').value;
            var strokeWidth = document.getElementById('polygons-stroke-width').value;

            return function (feature, resolution) {
                var style = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: strokeColor,
                        width: strokeWidth
                    }),
                    fill: new ol.style.Fill({
                        color: fillColor
                    }),
                    text: createTextStyle(feature, myDom.polygons)
                });
                return [style];
            };
        };
        */
        //鼠标改为手势
        map.on('pointermove', function (e) {
            var pixel = map.getEventPixel(e.originalEvent);
            var hit = map.hasFeatureAtPixel(pixel);
            if (hit) {
                map.getTargetElement().style.cursor = 'pointer';
            }
            else {
                map.getTargetElement().style.cursor = '';
            }
        });
        
        //vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([5e6, 7e6], 1e6))); //添加单个几何要素
        var vectorLayer = new ol.layer.Vector({
            source: vectorSource, //矢量数据源
            dataProjection: 'EPSG:4326',    // 设定JSON数据使用的坐标系
            featureProjection: 'EPSG:3857', // 设定当前地图使用的feature的坐标系   
            style: function (feature) {
                var name = feature.get('name');
                labelStyle.getText().setText(name);
                for (var i = 0; i < district.length ; i++) {
                    if (name == district[i]) {
                        return style[i];
                    }
                 
                }
                   
  
            },
            declutter: true
       });
       var view = map.getView();
       map.addLayer(vectorLayer); //将矢量图层加载到地图中         
    }

    //添加图层
    this.addLayer = function (layerName) {
        var tiled = new ol.layer.Tile({
            visible: true,
            source: new ol.source.TileWMS({
                url: 'http://192.168.1.201:8080/geoserver/shanghai/wms',
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    tiled: true,
                    STYLES: '',
                    LAYERS: 'shanghai:'+layerName,
                    tilesOrigin: 13152732.353133954 + "," + 2834155.8006814974
                }
            })
        });
        map.addLayer(tiled);
    }

    this.zoomToBounds = function(bounds){
        map.getView().fit(bounds, map.getSize());
    }


    //绘制多边形
    this.loadPolygon = function (coordinates) {
        var MUP = new ol.geom.Polygon(coordinates);
        //创建一个新的要素，并添加到数据源中
        var feature = new ol.Feature({
            geometry: MUP      
        });
        //矢量数据源
        //在地图中添加图层
        vectSource.addFeature(feature);
    }
    //绘制多边形
    this.loadWGS84Polygon = function (coordinates) {
        var MUP = new ol.geom.Polygon(coordinates);
        var newMUP = MUP.transform( 'EPSG:4326','EPSG:3857');
        //创建一个新的要素，并添加到数据源中
        var feature = new ol.Feature({
            geometry: newMUP

        });
        //矢量数据源
        //在地图中添加图层
        vectSource.addFeature(feature);
    }

    //绘制线段
    this.loadPolyline = function (coordinates) {
        var MUP = new ol.geom.LineString(coordinates);
        //创建一个新的要素，并添加到数据源中
        var feature = new ol.Feature({
            geometry: MUP,
        });
        //矢量数据源


        lineSource.addFeature(feature);
        map.addLayer(lineLayer);
        //在地图中添加图层
    //    vectSource.addFeature(feature);
    //    map.addLayer(vectLayer);
    }

    //清除绘制图层
    this.cleanHighlightPolygon = function () {
        // map.removeLayer(vectLayer);
        highlightSource.clear();
    }
    //清除绘制图层
    this.cleanPolygon = function () {
       // map.removeLayer(vectLayer);
        vectSource.clear();
        highlightSource.clear();
    }

    //清除绘制多段线
    this.cleanPolyline = function () {
        map.removeLayer(lineLayer);
    }

    //图层缩放到多段线
    this.zoomToPolyline = function (coordinates) {
        var MUP = new ol.geom.LineString(coordinates);
        var view = map.getView();
        view.fit(MUP.getExtent(), map.getSize());
    }

    //图层缩放到要素
    this.zoomToFeature = function (coordinates) {
        this.cleanHighlightPolygon();
        var MUP = new ol.geom.Polygon(coordinates);
 
     //   var MUP = new ol.geom.Polygon(coordinates);
        var newMUP = MUP.transform('EPSG:4326', 'EPSG:3857');
        var view = map.getView();
        view.fit(newMUP.getExtent(), map.getSize());

   //     var MUP = new ol.geom.Polygon(coordinates);
        //创建一个新的要素，并添加到数据源中
        var feature = new ol.Feature({
            geometry: newMUP
        });
        //矢量数据源
        //在地图中添加图层
        highlightSource.addFeature(feature);
      //  highlightLayer
    }

    //图层缩放到要素
    this.zoomToFeatures = function (coordinates) {
        this.cleanHighlightPolygon();
        var MUP = new ol.geom.MultiPolygon(coordinates);

        //   var MUP = new ol.geom.Polygon(coordinates);
        var newMUP = MUP.transform('EPSG:4326', 'EPSG:3857');
        var view = map.getView();
        view.fit(newMUP.getExtent(), map.getSize());

        //     var MUP = new ol.geom.Polygon(coordinates);
        //创建一个新的要素，并添加到数据源中
        var feature = new ol.Feature({
            geometry: newMUP
        });
        //矢量数据源
        //在地图中添加图层
        highlightSource.addFeature(feature);
        //  highlightLayer
    }

    this.startDraw = function (callback) {
        //实例化一个矢量图层Vector作为绘制层
      //  var source = new ol.source.Vector({ wrapX: false });
        var vector = new ol.layer.Vector({
            source: vectSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        map.addLayer(vector);//将绘制层添加到地图容器中

        addInteraction('Polygon');
        //根据绘制类型进行交互绘制图形处理
        function addInteraction(value) {
            //var value = typeSelect.value; //绘制类型
            if (value !== 'None') {
                if (vectSource == null) {
                    vectSource = new ol.source.Vector({ wrapX: false });
                    vector.setSource(vectSource); //添加绘制层数据源
                }
                var geometryFunction, maxPoints;

                //实例化交互绘制类对象并添加到地图容器中
                draw = new ol.interaction.Draw({
                    source: vectSource, //绘制层数据源
                    type: /** @type {ol.geom.GeometryType} */(value), //几何图形类型
                    geometryFunction: geometryFunction, //几何信息变更时调用函数
                    maxPoints: maxPoints //最大点数
                });
                map.addInteraction(draw);
                draw.on('drawend', callback, this);
            }
            else {
                vectSource = null;
                vector.setSource(vectSource);//清空绘制图形
            }
        }
    }

  

    this.stopDraw = function () {
        map.removeInteraction(draw);

    }
    //开始画点
    this.startDrawPoint = function (callback) {
        //实例化一个矢量图层Vector作为绘制层
        //  var source = new ol.source.Vector({ wrapX: false });
        var vector = new ol.layer.Vector({
            source: vectSource
        });
        map.addLayer(vector);//将绘制层添加到地图容器中

        addInteraction('Point');
        //根据绘制类型进行交互绘制图形处理
        function addInteraction(value) {
            //var value = typeSelect.value; //绘制类型
            if (value !== 'None') {
                if (vectSource == null) {
                    vectSource = new ol.source.Vector({ wrapX: false });
                    vector.setSource(vectSource); //添加绘制层数据源
                }
                var geometryFunction, maxPoints;

                //实例化交互绘制类对象并添加到地图容器中
                draw = new ol.interaction.Draw({
                    source: vectSource, //绘制层数据源
                    type: /** @type {ol.geom.GeometryType} */(value), //几何图形类型
                    geometryFunction: geometryFunction, //几何信息变更时调用函数
                    maxPoints: maxPoints //最大点数
                });
                map.addInteraction(draw);
                draw.on('drawend', callback, this);
            }
            else {
                vectSource = null;
                vector.setSource(vectSource);//清空绘制图形
            }
        }
    }

    //定义修改几何图形功能控件
    this.Modify = {
        init: function () {
            //初始化一个交互选择控件,并添加到地图容器中
            this.select = new ol.interaction.Select();
            map.addInteraction(this.select);
            //初始化一个交互编辑控件，并添加到地图容器中
            this.modify = new ol.interaction.Modify({
                features: this.select.getFeatures()//选中的要素
            });
            map.addInteraction(this.modify);
            //设置几何图形变更的处理
            this.setEvents();
        },
        setEvents: function () {
            var selectedFeatures = this.select.getFeatures(); //选中的要素
            //添加选中要素变更事件
            this.select.on('change:active', function () {
                selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
            });
        },
        setActive: function (active) {
            this.select.setActive(active);//激活选择要素控件
            this.modify.setActive(active);//激活修改要素控件
        }
    };
    //定义选中事件
    this.selectClick = null;
    this.selectFeature=function(){
        // select interaction working on "click"
  
        this.selectClick = new ol.interaction.Select({
            //  condition: ol.events.condition.click
            /*,
            style: new ol.style.Style({

                stroke: new ol.style.Stroke({
                    color: 'blue',
                    width: 0
                })
               
                fill: new ol.style.Fill({
                    color: [255, 255, 255, 0.1]
                }),
                text: new ol.style.Text({
                    font: '9px Calibri,sans-serif',
                    overflow: 'line',
                    fill: new ol.style.Fill({
                        color: '#000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            })*/
        });
    
        map.addInteraction(this.selectClick);


    }

    //判断一个多边形是否在另外一个多边形内
    this.isInside = function (polygon1,polygon2) {
        polygon1 = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
        polygon2 = turf.point([1, 2]);

        turf.booleanContains(polygon1, polygon2);
    }


   

}
//定义天地图
function TMap() {
    var map;
    var zoom = 9;
    var localsearch;
    var infoWin;
    var geocode;
    this.localsearch = localsearch;

    this.search = function (keyWord) {
        localsearch.search(keyWord,7);
    }
    this.initMap = function () {
     
        map = new T.Map("map");
        //设置显示地图的中心点和级别
        map.centerAndZoom(new T.LngLat(121.4095940165, 31.1290569275), zoom);

        var config = {
            pageCapacity: 10,	//每页显示的数量
            onSearchComplete: localSearchResult	//接收数据的回调函数
        };
        //创建搜索对象
        localsearch = new T.LocalSearch(map, config);
    //    localsearch.setSpecifyAdminCode(156310000);
        //逆地址编码
        geocode = new T.Geocoder();
    };
    function localSearchResult(result) {
        //清空地图及搜索列表
        clearAll();

        //根据返回类型解析搜索结果
        switch (parseInt(result.getResultType())) {
            case 1:
                //解析点数据结果
                pois(result.getPois());
                break;
        }
    }
    //解析点数据结果
    function pois(obj) {
        console.info(obj);
        if (obj) {
            //显示搜索列表
            var divMarker = document.createElement("div");
            //坐标数组，设置最佳比例尺时会用到
            var zoomArr = [];
            for (var i = 0; i < obj.length; i++) {
                //闭包
                (function (i) {
                    //名称
                    var name = obj[i].name;
                    //地址
                    var address = obj[i].address;
                    //坐标
                    var lnglatArr = obj[i].lonlat.split(" ");
                    var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);

                    var winHtml = "地址:" + address;

                    //创建标注对象
                    var marker = new T.Marker(lnglat);
                    //地图上添加标注点
                    map.addOverLay(marker);
                    //注册标注点的点击事件
                    marker.addEventListener("click", function (e) {
                        //    this.showPosition(marker, name, winHtml);
                        console.info(e.lnglat);
                        geocode.getLocation(e.lnglat, searchResult);
                  //      alert(e.lnglat.getLng() + "," + e.lnglat.getLat());
                    }, this);
                    zoomArr.push(lnglat);

                    //在页面上显示搜索的列表
                    var a = document.createElement("a");
                    a.href = "javascript://";
                    a.innerHTML = name;
                    a.onclick = function () {
                        showPosition(marker, name, winHtml);

                    }
                    divMarker.appendChild(document.createTextNode((i + 1) + "."));
                    divMarker.appendChild(a);
                    divMarker.appendChild(document.createElement("br"));
                })(i);
            }
            //显示地图的最佳级别
            map.setViewport(zoomArr);
            //显示搜索结果
       //     divMarker.appendChild(document.createTextNode('共' + localsearch.getCountNumber() + '条记录，分' + localsearch.getCountPage() + '页,当前第' + localsearch.getPageIndex() + '页'));
       //     document.getElementById("searchDiv").appendChild(divMarker);
            //   document.getElementById("resultDiv").style.display = "block";
        }
        else {
            alert("无结果");
        }
    }

    //显示标注信息
    function showPosition(marker, name, winHtml) {
        if (infoWin) {
            map.removeOverLay(infoWin);
            infoWin = null;
        }
        var html = "<h5>" + name + "</h5>";
        html += winHtml;
        infoWin = new T.InfoWindow(html, new T.Point([0, 0]));
        marker.openInfoWindow(infoWin);

    }

    //清空地图及搜索列表
    function clearAll() {
        map.clearOverLays();
     //   document.getElementById("searchDiv").innerHTML = "";
     //   document.getElementById("resultDiv").style.display = "none";
     //   document.getElementById("statisticsDiv").innerHTML = "";
     //   document.getElementById("statisticsDiv").style.display = "none";
    }
}


//定义点
function point(x, y) {
    this.x = x;
    this.y = y;
}









