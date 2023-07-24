import background from '../../images/background.png'

function Home() {

    return(
        <div >
            <h1 style={{color: '#fff', display: 'flex'
                , justifyContent: 'center', marginTop: '10%'
                , background: '#ffffff44', padding: '16px 0'}}
            >
                Welcome to Brightbook!
            </h1>
            <img alt="background" src={background} style={{maxHeight: '95vh', width: '100%', position: 'fixed', zIndex: -9999, bottom: 0, left: 0}}/>
        </div>
    )
}

export default Home