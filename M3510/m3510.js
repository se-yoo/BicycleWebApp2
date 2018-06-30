var map;
var displayState = false; // fasle은 마커정보부분이 안보이는 상태 true는 보이는 상태
var nowMenu = 0; // 0은 메인, 1은 편의시설, 2는 따릉이, 3은 대여, 4는 수리
var bound;
var isNowPlay = true;
var isNowMute = false;
var w = [ [ 200, 'thunderstorm with light rain', '가벼운 비를 동반한 천둥구름' ],
		[ 201, 'thunderstorm with rain', '	비를 동반한 천둥구름' ],
		[ 202, 'thunderstorm with heavy rain', '폭우를 동반한 천둥구름' ],
		[ 210, 'light thunderstorm', '약한 천둥구름' ], 
		[ 211, 'thunderstorm', '천둥구름' ],
		[ 212, 'heavy thunderstorm', '강한 천둥구름' ],
		[ 221, 'ragged thunderstorm', '불규칙적 천둥구름' ],
		[ 230, 'thunderstorm with light drizzle', '약한 연무를 동반한 천둥구름' ],
		[ 231, 'thunderstorm with drizzle', '연무를 동반한 천둥구름' ],
		[ 232, 'thunderstorm with heavy drizzle', '강한 안개비를 동반한 천둥구름' ],
		[ 300, 'light intensity drizzle', '가벼운 안개비' ],
		[ 301, 'drizzle', '안개비' ],
		[ 302, 'heavy intensity drizzle', '강한 안개비' ],
		[ 310, 'light intensity drizzle rain', '가벼운 적은비' ],
		[ 311, 'drizzle rain', '적은비' ],
		[ 312, 'heavy intensity drizzle rain', '강한 적은비' ],
		[ 313, 'shower rain and drizzle', '소나기와 안개비' ],
		[ 314, 'heavy shower rain and drizzle', '강한 소나기와 안개비' ],
		[ 321, 'shower drizzle', '소나기' ], 
		[ 500, 'light rain', '약한 비' ],
		[ 501, 'moderate rain', '중간 비' ], 
		[ 502, 'heavy intensity rain', '강한 비' ],
		[ 503, 'very heavy rain', '매우 강한 비' ], 
		[ 504, 'extreme rain', '극심한 비' ],
		[ 511, 'freezing rain', '우박' ],
		[ 520, 'light intensity shower rain', '약한 소나기 비' ],
		[ 521, 'shower rain', '소나기 비' ],
		[ 522, 'heavy intensity shower rain', '강한 소나기 비' ],
		[ 531, 'ragged shower rain', '불규칙적 소나기 비' ], 
		[ 600, 'light snow', '가벼운 눈' ],
		[ 601, 'snow', '눈' ], 
		[ 602, 'heavy snow', '강한 눈' ], 
		[ 611, 'sleet', '진눈깨비' ],
		[ 612, 'shower sleet', '소나기 진눈깨비' ],
		[ 615, 'light rain and snow', '약한 비와 눈' ], 
		[ 616, 'rain and snow', '비와 눈' ],
		[ 620, 'light shower snow', '약한 소나기 눈' ], 
		[ 621, 'shower snow', '소나기 눈' ],
		[ 622, 'heavy shower snow', '강한 소나기 눈' ],
		[ 701, 'mist', '박무' ],
		[ 711, 'smoke', '연기' ], 
		[ 721, 'haze', '연무' ],
		[ 731, 'sand, dust whirls', '모래 먼지' ], 
		[ 741, 'fog', '안개' ],
		[ 751, 'sand', '모래' ], 
		[ 761, 'dust', '먼지' ], 
		[ 762, 'volcanic ash', '화산재' ],
		[ 771, 'squalls', '돌풍' ], 
		[ 781, 'tornado', '토네이도' ],
		[ 800, 'clear sky', '구름 한 점 없는 맑은 하늘' ],
		[ 801, 'few clouds', '약간의 구름이 낀 하늘' ],
		[ 802, 'scattered clouds', '드문드문 구름이 낀 하늘' ],
		[ 803, 'broken clouds', '구름이 거의 없는 하늘' ],
		[ 804, 'overcast clouds', '구름으로 뒤덮인 흐린 하늘' ], 
		[ 900, 'tornado', '토네이도' ],
		[ 901, 'tropical storm', '태풍' ], 
		[ 902, 'hurricane', '허리케인' ],
		[ 903, 'cold', '한랭' ], 
		[ 904, 'hot', '고온' ],
		[ 905, 'windy', '바람부는' ],
		[ 906, 'hail', '우박' ], 
		[ 951, 'calm', '바람이 거의 없는' ],
		[ 952, 'light breeze', '약한 바람' ], 
		[ 953, 'gentle breeze', '부드러운 바람' ],
		[ 954, 'moderate breeze', '중간 세기 바람' ], 
		[ 955, 'fresh breeze', '신선한 바람' ],
		[ 956, 'strong breeze', '센 바람' ], 
		[ 957, 'high win', '돌풍에 가까운 센 바람' ],
		[ 958, 'gale', '돌풍' ], 
		[ 959, 'severe gale', '심각한 돌풍' ], 
		[ 960, 'storm', '폭풍' ],
		[ 961, 'violent storm', '강한 폭풍' ], 
		[ 962, 'hurricane', '허리케인' ] ];

var geocoder = new daum.maps.services.Geocoder();

window.onload = function() {
	var bgm = new Audio('');
	if (!bgm.canPlayType('audio/mp3'))
		alert('브라우저가 mp3 재생을 지원하지 않습니다.');
	else {
		var bgm_url = 'The Land Of Happiness - Nicolai Heidlas Music.mp3';
		bgm = new Audio(bgm_url);
		bgm.loop = true;
		bgm.play();
	}

	var help = document.getElementById("helpcontent");
	help.style.display = "none";
	var lang = document.getElementById("langMenu");
	lang.style.display = "none";

	getWeather();

	daum.maps.disableHD();
	var mapContainer = document.getElementById('map'), // 지도를 표시할 div
	mapOption = {
		center : new daum.maps.LatLng(37.527517, 126.926494), // 여의도 한강공원
		level : 4
	// 지도의 확대 레벨
	};

	daum.maps.load(function() {
		// v3가 모두 로드된 후, 이 콜백 함수가 실행됩니다.
		map = new daum.maps.Map(mapContainer, mapOption);
		map.addOverlayMapTypeId(daum.maps.MapTypeId.BICYCLE);
	});

	// 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성
	var zoomControl = new daum.maps.ZoomControl();
	map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

	var play = document.getElementById("play");
	play.onclick = function() {
		if (isNowPlay) {
			play.src = "play.png";
			bgm.pause();
			isNowPlay = false;
		} else {
			play.src = "pause.png";
			bgm.play();
			isNowPlay = true;
		}
	}

	var mute = document.getElementById("mute");
	mute.onclick = function() {
		if (isNowMute) {
			mute.src = "speaker.png";
			bgm.muted = false;
			isNowMute = false;
		} else {
			mute.src = "mute.png";
			bgm.muted = true;
			isNowMute = true;
		}
	}

	var button = document.getElementById("button");
	button.onclick = function() {
		if (nowMenu != 0)
			bound.setMap(null);
		lang.style.display = "none";
		handleRefresh();// 편의시설버튼을 클릭할때 마커표시
	}

	var button1 = document.getElementById("button1");
	button1.onclick = function() {
		if (nowMenu != 0)
			bound.setMap(null);
		lang.style.display = "none";
		handleRefresh1();// 따릉이버튼을 클릭할때 마커표시
	}

	var button2 = document.getElementById("button2");
	button2.onclick = function() {
		if (nowMenu != 0)
			bound.setMap(null);
		lang.style.display = "block";
		handleRefresh2();// 대여소버튼을 클릭할때 마커표시
	}

	var button3 = document.getElementById("button3");
	button3.onclick = function() {
		lang.style.display = "none";
		openpopup();// 수리시설 클릭할때 위치표시
	}

	var hpBt = document.getElementById("helpBt");
	hpBt.onclick = function() {
		if (!displayState) {
			help.style.display = "block";
			displayState = true;
		} else {
			help.style.display = "none";
			displayState = false;
		}
	}

	daum.maps.event.addListener(map, 'dragend', function() {
		switch (nowMenu) {
		case 0:
			break;
		case 1:
			handleRefresh();// 지도의 중심이 이동될때도 마커를 다시 표시
			break;
		case 2:
			handleRefresh1();
			break;
		case 3:
			handleRefresh2();
			break;
		}
	});
}

function handleRefresh() {
	nowMenu = 1;

	// 편의시설 1808개 있음
	for (var i = 1; i <= 1808; i = i + 904) {
		var j = i + 903;

		var url = "http://openAPI.seoul.go.kr:8088/5a71546a53796f6f39334764524e4f/json/GeoInfoBikeConvenientFacilitiesWGS/"
				+ i + "/" + j;
		$.getJSON(url, updateBicycleAme);
	}
	addBound(700);// 지도에 원을 표시
}

function handleRefresh1() {
	nowMenu = 2;

	var url = "seoul_bicycle.json";
	$.getJSON(url, updateDDarung);
	addBound(700);// 지도에 원을 표시
}

function handleRefresh2() {
	nowMenu = 3;

	// 148개 있음
	var url = "http://openapi.seoul.go.kr:8088/5a71546a53796f6f39334764524e4f/json/SebcBicycleRetal"
			+ $("input[name=lang]:checked").val() + "/1/148";
	$.getJSON(url, updateBicycle);
	addBound(1000);// 지도에 원을 표시
}

function openpopup() {
	nowMenu = 4;

	searchAddrFromCoords(map.getCenter(), displayCenterInfo);

}
// 편의시설
function updateBicycleAme(bicycleAmes) {
	var arr = bicycleAmes.GeoInfoBikeConvenientFacilitiesWGS.row;
	var addr = "";
	var center = map.getCenter(); // 중심
	var position = {
		latitude : center.getLat(),
		longitude : center.getLng()
	};

	for (var i = 0; i < arr.length; i++) {
		var bicycleAme = arr[i];
		var imageSrc = bicycleAme.CLASS + ".png", imageSize = new daum.maps.Size(
				45, 69), // 마커의 크기(daummap에서 size 검색,
		// 크기정보를 가지고 있는 사이즈 객체 생성)
		imageOption = {
			offset : new daum.maps.Point(14, 28)
		};// point 검색, 화면
		// 좌표 정보를 담고 있는
		// 포인터 객체 생성
		// point생성, 좌표를
		// 0,0으로 해도 됨
		var loc = {// open API의 값들 위도와 경도
			latitude : bicycleAme.LAT,
			longitude : bicycleAme.LNG
		};// 각 편의 시설좌표
		var km = computeDistance(position, loc);

		if (addr != bicycleAme.ADDRESS && km <= 0.7) { // 주소가 있고 반경 700m 이내
			addr = bicycleAme.ADDRESS;// 중복되는 데이터 제외
			addMarker(imageSrc, imageSize, imageOption, bicycleAme.LAT,
					bicycleAme.LNG, bicycleAme.CLASS, bicycleAme.ADDRESS);
		}
	}
}
// 따릉이
function updateDDarung(ddarungs) {
	var arr = ddarungs;
	var addr = "";
	var center = map.getCenter(); // 중심
	var position = {
		latitude : center.getLat(),
		longitude : center.getLng()
	};

	for (var i = 0; i < arr.length; i++) {
		var ddarung = arr[i];
		var imageSrc = "marker.png", imageSize = new daum.maps.Size(45, 69), // 마커의
																				// 크기(daummap에서
																				// size
																				// 검색,
		// 크기정보를 가지고 있는 사이즈 객체 생성)
		imageOption = {
			offset : new daum.maps.Point(14, 28)
		};// point 검색, 화면
		// 좌표 정보를 담고 있는
		// 포인터 객체 생성
		// point생성, 좌표를
		// 0,0으로 해도 됨
		var loc = {// open API의 값들 위도와 경도
			latitude : ddarung.latitude,
			longitude : ddarung.longitude
		};// 각 편의 시설좌표
		var km = computeDistance(position, loc);

		if (km <= 0.7) { // 주소가 있고 반경 700m 이내
			addMarker(imageSrc, imageSize, imageOption, ddarung.latitude,
					ddarung.longitude, ddarung.content_nm, ddarung.new_addr,
					ddarung.cradle_count);
		}
	}
}
// 자전거대여소
function updateBicycle(bicycles) {
	var arr;
	switch ($("input[name=lang]:checked").val()) {
	case "Kor":
		arr = bicycles.SebcBicycleRetalKor.row;
		break;
	case "Eng":
		arr = bicycles.SebcBicycleRetalEng.row;
		break;
	case "Cng":
		arr = bicycles.SebcBicycleRetalCng.row;
		break;
	}
	var addr = "";
	var center = map.getCenter(); // 중심 가져오기
	var position = {
		latitude : center.getLat(),
		longitude : center.getLng()
	};

	for (var i = 0; i < arr.length; i++) {
		var bicycle = arr[i];
		var imageSrc = "marker1.png", imageSize = new daum.maps.Size(45, 69), // 마커의
																				// 크기(daummap에서
																				// size
																				// 검색,
		// 크기정보를 가지고 있는 사이즈 객체 생성)
		imageOption = {
			offset : new daum.maps.Point(14, 28)
		};// point 검색, 화면 좌표
		// 정보를 담고 있는 포인터 객체
		// 생성
		// point생성, 좌표를
		// 0,0으로 해도 됨
		var loc = {// open API의 값들 위도와 경도
			latitude : bicycle.LATITUDE,
			longitude : bicycle.LONGITUDE
		};
		var km = computeDistance(position, loc);

		if (km <= 1) { // 반경 1km이내
			if ($("input[name=lang]:checked").val() == "Kor"
					&& addr != bicycle.NAME_KOR) {
				addr = bicycle.NAME_KOR;// 중복되는 데이터 제외
				addMarker(imageSrc, imageSize, imageOption, bicycle.LATITUDE,
						bicycle.LONGITUDE, bicycle.NAME_KOR, bicycle.H_KOR_CITY
								+ " " + bicycle.ADD_KOR);
			} else if ($("input[name=lang]:checked").val() == "Eng"
					&& addr != bicycle.NAME_ENG) {
				addr = bicycle.NAME_ENG;// 중복되는 데이터 제외
				addMarker(imageSrc, imageSize, imageOption, bicycle.LATITUDE,
						bicycle.LONGITUDE, bicycle.NAME_ENG, bicycle.H_ENG_CITY
								+ " " + bicycle.H_ENG_GU + " "
								+ bicycle.H_ENG_DONG);
			} else if ($("input[name=lang]:checked").val() == "Cng"
					&& addr != bicycle.NAME_CNG) {
				addr = bicycle.NAME_CNG;// 중복되는 데이터 제외
				addMarker(imageSrc, imageSize, imageOption, bicycle.LATITUDE,
						bicycle.LONGITUDE, bicycle.NAME_CNG, bicycle.H_CNG_CITY
								+ " " + bicycle.H_CNG_GU + " "
								+ bicycle.H_CNG_DONG);
			}
		}
	}
}

function addBound(rad) {
	// 지도에 표시할 원을 생성합니다
	bound = new daum.maps.Circle({
		center : map.getCenter(),
		radius : rad, // 원의 반지름
		strokeWeight : 5, // 선의 두께
		strokeColor : '#b88ee3',
		strokeOpacity : 0.7,
		strokeStyle : 'solid',
		fillColor : '#fc8f91',
		fillOpacity : 0.3,
		zIndex : 1
	});

	// 지도에 원을 표시
	bound.setMap(map);

	daum.maps.event.addListener(map, 'dragstart', function() {// 지도가 이동될때도 원이
		// 다시 그려짐
		bound.setMap(null);
	});

}
function addMarker2(imageSrc, imageSize, imageOption, latitude, longitude,
		name, address, cnt) {
	// 이미지 마커 맵에 추가
	var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize,
			imageOption), markerPosition = new daum.maps.LatLng(latitude,
			longitude);
	var marker = new daum.maps.Marker({
		position : markerPosition,
		image : markerImage,
		zIndex : 7
	});

	marker.setMap(map);

	daum.maps.event.addListener(map, 'dragstart', function() {
		marker.setMap(null);
	});

	var content = "<div style='width:100%; height:100%; padding:5px; font-size:0.8em; font-family:맑은고딕;"
			+ "color:#fc8f91;'><span style='color:#b88ee3'>대여소명: </span>"
			+ name
			+ '<br>'
			+ "<span style='color:#b88ee3'>주소: </span>"
			+ address
			+ "<br><span style='color:#b88ee3'>거치대수: </span>"
			+ cnt
			+ "<br></div>";

	// 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성
	var iwContent = content, iwPosition = markerPosition;

	// 인포윈도우를 생성
	var infowindow = new daum.maps.InfoWindow({
		position : iwPosition,
		content : iwContent,
		zIndex : 10
	});

	// 마커에 클릭이벤트를 등록
	daum.maps.event.addListener(marker, 'mouseover', function() {
		// 마커 위에 인포윈도우를 표시
		infowindow.open(map, marker);
	});
	daum.maps.event.addListener(marker, 'mouseout', function() {
		infowindow.close();
	});
}
function addMarker(imageSrc, imageSize, imageOption, latitude, longitude, name,
		address) {
	// 이미지 마커 맵에 추가
	var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize,
			imageOption), markerPosition = new daum.maps.LatLng(latitude,
			longitude);
	var marker = new daum.maps.Marker({
		position : markerPosition,
		image : markerImage,
		clickable : true,
		zIndex : 7
	});

	marker.setMap(map);

	daum.maps.event.addListener(map, 'dragstart', function() {
		marker.setMap(null);
	});

	var content = "<div style='width:100%; height:100%; padding:5px; font-size:0.8em; font-family:맑은고딕;"
			+ "color:#fc8f91;'><span style='color:#b88ee3'>NAME: </span>"
			+ name
			+ '<br>'
			+ "<span style='color:#b88ee3'>ADDRESS: </span>"
			+ address + "<br></div>";

	// 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성
	var iwContent = content, iwPosition = markerPosition, iwRemoveable = true;

	// 인포윈도우를 생성
	var infowindow = new daum.maps.InfoWindow({
		position : iwPosition,
		content : iwContent,
		removable : iwRemoveable,
		zIndex : 10
	});

	daum.maps.event.addListener(marker, 'click', function() {
		// 마커 위에 인포윈도우를 표시합니다
		infowindow.open(map, marker);
	});
}

function computeDistance(startCoords, destCoords) {

	var startLatRads = degreesToRadians(startCoords.latitude);
	var startLongRads = degreesToRadians(startCoords.longitude);
	var destLatRads = degreesToRadians(destCoords.latitude);
	var destLongRads = degreesToRadians(destCoords.longitude);

	var Radius = 6371;
	var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads)
			+ Math.cos(startLatRads) * Math.cos(destLatRads)
			* Math.cos(startLongRads - destLongRads))
			* Radius;

	return distance;

}

function degreesToRadians(degrees) {
	var radians = (degrees * Math.PI) / 180;
	return radians;
}

function searchAddrFromCoords(coords, callback) {
	// 좌표로 행정동 주소 정보를 요청
	geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

// 지도 중심좌표에 대한 주소정보를 표출하는 함수
function displayCenterInfo(result, status) {
	if (status === daum.maps.services.Status.OK) {
		for (var i = 0; i < result.length; i++) {
			// 행정동의 region_type 값은 'H' 이므로
			if (result[i].region_type === 'H') {
				var Popup = window.open("repairInfo.html?address="
						+ result[i].address_name);
				break;
			}
		}
	}
}

function getWeather() {
	var apiURI = "https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=9a5683ba9acd3a0b295889505d4a9d97";
	$.getJSON(apiURI, updateWeather);
}

function updateWeather(seoul) {
	var weather = seoul.weather[0];
	document.getElementById("weatherImg").innerHTML = "<img src='http://openweathermap.org/img/w/"
			+ weather.icon + ".png'>";
	
	for(var i=0;i<w.length;i++){
		if(weather.id==w[i][0]){
			result=w[i][2];
			break;
		}
	}
	
	document.getElementById("weatherTxt").innerHTML = "현재 서울의 날씨는 <span>"+result
			+ "</span><br>현재 서울의 온도는 <span>" + Math.floor(seoul.main.temp - 273.15)+"</span>";
}