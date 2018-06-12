
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
                    //  this.showPosition(marker, name, winHtml);
                    geocode.getLocation(e.lnglat, searchResult);

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
        divMarker.appendChild(document.createTextNode('共' + localsearch.getCountNumber() + '条记录，分' + localsearch.getCountPage() + '页,当前第' + localsearch.getPageIndex() + '页'));
        document.getElementById("searchDiv").appendChild(divMarker);
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
    document.getElementById("searchDiv").innerHTML = "";
    document.getElementById("resultDiv").style.display = "none";
    document.getElementById("statisticsDiv").innerHTML = "";
    document.getElementById("statisticsDiv").style.display = "none";
}