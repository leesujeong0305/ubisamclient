//설치 목록

처음에는 node_modules 설치
npm install

npm install axios socket.io-client react-router-dom


npm install react-bootstrap bootstrap
Stylesheets
중요 - 최상단의 루트파일인 src/index.js 또는 App.js 파일에 다음 스타일을 추가해줍니다.
import 'bootstrap/dist/css/bootstrap.min.css';
만약 추가하지 않는다면 부트스트랩의 스타일은 적용되지 않습니다.


아이콘 설치
npm install react-icons --save


부트스트랩 UI 예쁘게
bootstrap.min.css 파일 src 밑에 추가 (어디서 다운받은지 모름)
import './bootstrap.min.css'; //index.js에 추가

//24.02.19 캘린더 추가
npm install react-calendar moment

//24.02.19 Chart 추가
npm i react-minimal-pie-chart

//24.03.05 redux 추가
redux 최신은 toolkit 시용함
npm install react-redux redux
npm i redux @reduxjs/toolkit react-redux

//24.03.07 calendar 추가
npm install --save @fullcalendar/react @fullcalendar/daygrid

//24.03.11 cookie 추가
npm install js-cookie

//24.03.14 bootstrap 추가
npm install bootstrap@5.3.3

//24.03.15 엑셀
npm install xlsx file-saver 

//24.03.25
npm install react-datepicker
npm install date-fns // 한글 폰트

//24.04.03 프로젝트 배포
npm run build
- 진행하게 되면 bulid 폴더 생성됨
- bulid 폴더를 서버로 이동


서버쪽에서는 이 부분을 app.listen... 위에 추가

// 정적 파일 제공을 위한 경로 설정
app.use(express.static(path.join(__dirname, 'build')));

// 모든 요청을 index.html로 리다이렉트
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/', function(req, res) {
  res.send('hello world');
});


//////////////////////////////////
단축 rfce //js 기본 작성해줌