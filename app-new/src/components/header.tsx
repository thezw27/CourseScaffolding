import Image from 'next/image';
import rpi200 from '../assets/RPI200.png';

const Header = () => {

  return (
    <header className="flex justify-between rpi-background w-screen" style={{ height: '10vh' }}>
      <div className="flex ml-7 justify-between w-1/4">
        <a href="https://ecse.rpi.edu" style={{ height: '50%' }} className="self-center"><img src={rpi200.src} style={{ height: '100%' }} alt="Rensselaer 200" /></a>
      </div>
      <div className="flex mr-7 justify-between w-1/6">
        <a href="/" className="self-center text-center btn-header btn-primary">Home</a>
        <a href="/admin" className="self-center text-center btn-header btn-primary">Admin Portal</a>
      </div>
    </header>
  )
}

export default Header;