import React from 'react';
// import '@/App.css'
import lessStyles from './app.less';
import asset1 from './assets/asset1.jpg';

const App = () => {
  console.log('NODE_ENV', process.env.NODE_ENV)
  return(
    <div className={lessStyles['contetn']}>
      <div className={lessStyles['lessBox']}>1111</div>
    <img src={asset1}></img>
    </div>
  )
}
export default App;   