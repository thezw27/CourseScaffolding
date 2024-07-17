import Image from 'next/image';
import rpi200 from '../assets/RPI200.png';

const Header = () => {
  return (
    <header className="flex justify-between rpi-background mb-5" style={{ height: '10vh', width: "100vw", position: "absolute" }}>
      <a href="/" className="self-center ml-7" style={{ height: '50%' }}><img src={rpi200.src} className="self-center ml-7" style={{ height: '100%' }} alt="Rensselaer 200" /></a>
      <a href="/admin" className="self-center btn-header btn-primary">Admin Portal</a>
    </header>
  )
}

export default Header;