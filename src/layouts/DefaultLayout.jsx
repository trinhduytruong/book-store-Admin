import NavBar from '../components/Header/NavBar'

function DefaultLayout(props) {
  return (
    <div className='default-layout' >
        <div className='header'>
          <NavBar/>
        </div>
        <div className='content' style={{paddingTop: '56px'}}>
          {props.children}
        </div>
    </div>
  )
}

export default DefaultLayout