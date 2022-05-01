const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const database = require("./db.js");
var email = "";
const memos = [];

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());

app.get('/api/memos', (req, res) => {
  database.query('SELECT email from user', (err, results) => {
    if (err) throw error;   
    res.send(results); 
  });
});

app.post('/api/memos', (req, res)=>{
    memos.push(req.body.content);
    res.send(memos);
});

app.put('/api/memos/:idx', (req, res)=>{
  memos[req.params.idx] = req.body.content;
  res.send(memos); 
});

// 회원가입 및 로그인
app.post('/api/login', (req, res)=>{
  const q1 = 'SELECT nickname from user where email ="'+req.body.kakao_account.email+'"';
  const q2 = 'INSERT INTO user(email,gender,nickname) VALUES("'+req.body.kakao_account.email+'","'+req.body.kakao_account.gender+'","'+req.body.kakao_account.profile.nickname+'")';
  const q3 = 'INSERT INTO logined(email) VALUES("'+req.body.kakao_account.email+'")';
  email = req.body.kakao_account.email;

  database.query(q1, (err, results) => {
    if (err) throw error;

    // 회원가입
    if (results.length == 0){
      database.query(q2, (err2, results2) => {
        if (err2) throw error;
      });
    }
    database.query(q3, (err, results) => {
      if (err) throw error;
      res.send("성공");
    });
  });
});

// 로그아웃
app.get('/api/logout', (req, res)=>{
  const q = 'DELETE FROM logined WHERE email="'+email+'"';
  database.query(q, (err, results)=>{
    if (err) throw error;
    res.send("성공");
  });
});

// 로그인된 이메일 정보 보내기
app.get('/api/logined', (req, res)=>{
  const q = 'SELECT * FROM logined';
  database.query(q, (err, results)=>{
    if (err) throw error;
    res.send(results);
  });
});

// 프로젝트 생성
app.post('/api/createProject', (req, res)=>{
  const q1 = 'SELECT p_name FROM project WHERE p_name="'+req.body.content+'"';
  const q2 = 'INSERT INTO project(email,p_name) VALUES("'+email+'","'+ req.body.content + '")';

  database.query(q1, (err, results)=>{
    if (err) throw error;
    if (results.length == 0){
      database.query(q2, (err2, results)=>{
        if (err2) throw error;
        res.send("성공");
      });
    }
    else{
      res.send("실패");
    }
  });
});

// 프로젝트 리스트 불러오기
app.get('/api/listProject', (req, res) => {
  database.query('SELECT p_name from project', (err, results) => {
    if (err) throw error;   
    res.send(results); 
  });
});

// 디테일 리스트 불러오기
app.post('/api/listDetail', (req, res) => {
  const q = 'SELECT title,date from detail WHERE p_name="'+req.body.p_name+'"';
  database.query(q, (err, results) => {
    if (err) throw error;   
    res.send(results); 
  });
});

// 할일 추가하기
app.post('/api/insertDetail', (req,res) => {
  const q = 'INSERT INTO detail(p_name,title,date) VALUES("'+req.body.data[0]+'","'+req.body.data[1]+'","'+req.body.data[2]+'")';
  database.query(q, (err, results) => {
    if (err) throw error;
    res.send("성공");
  });
});

app.listen(port, () => { 
  console.log(`Example app listening on port ${port}`);
});