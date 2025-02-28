import Link from 'next/link'; 
import { useState } from 'react'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Define um estado isOpen para controlar a visibilidade do menu

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Função para alternar o estado isOpen entre true e false
  };

  return (
    <nav className="flex justify-between p-4 items-center"> 
      <div className="w-full flex items-center justify-between"> 
        <div className="text-xl font-bold"> 
          <Link href="/">Meu Blog</Link> 
        </div>
        
        {/* Ícone de hambúrguer */}
        <div className="text-3xl cursor-pointer md:hidden" onClick={toggleMenu}> 
          &#9776; 
        </div>
      </div>
      
      {/* Lista de links do menu */}
      <ul className={`mt-4 md:flex md:items-center md:space-x-6 ${isOpen ? 'block' : 'hidden'}`}> 
        <li className="text-lg"> 
          <Link href="/">Home</Link> 
        </li>
        <li className="text-lg"> 
          <Link href="/about">Sobre</Link> 
        </li>
        <li className="text-lg"> 
          <Link href="/contact">Contato</Link> 
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 