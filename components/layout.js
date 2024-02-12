import Nav from "@/components/nav";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import bcrypt from "bcryptjs"
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";

export default function Layout({children}) {
  const { data: session } = useSession();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('')
  const [isChangePass, setIsChangePass] = useState(false)
  const [newPass, setNewPass] = useState()
  const [openErrorLogin, setOpenErrorLogin] = useState(false)
  const [openErrorPassword, setOpenErrorPassword] = useState(false)
  const [securityAns, setSecurityAns] = useState()
  const secretAns = "Ford Bronco 1980"

  async function login(e){
    e.preventDefault();
    
    try{
     const res =  await signIn("credentials", {
      user,
      password,
      redirect: false,
     })

     console.log(res)

     if(res.error){
      setOpenErrorLogin(true)
      return;
     }
    }catch(error){}

  }

  async function changePassword(e){
    e.preventDefault();
    
    if(secretAns === securityAns){
      const encryptPass = await bcrypt.hash(newPass, 12)

      await axios.patch("/api/users?user=admin", {
        encryptPass
      })

      setIsChangePass(false)
    }
    setOpenErrorPassword(true)
  }
  
  function handleOpenErrorLogin(){
    setOpenErrorLogin(!openErrorLogin)
}
  
  function handleOpenErrorPassword(){
  setOpenErrorPassword(!openErrorPassword)
}


    

  if (!session) {
    return (
      <div className="bg-blue-900 w-scrren h-screen flex flex-col justify-center items-center">
        <Image src="/images/logoLetrasFondoBlanco.png" alt="Elvensa" width={400} height={300}/>
        <h1 className="text-white">Panel de control</h1>
        <div className="text-center w-100">
          {!isChangePass ?
          <form onSubmit={(e) => login(e)}>
          <input value={user} onChange={(e) => setUser(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Nombre de usuario"/>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Contraseña"/>
          <div className="flex flex-col gap-2">
          <button type="submit" className="bg-white p-2 px-4 rounded-lg text-black">Iniciar sesión</button>
          <button className="text-white" onClick={() => setIsChangePass(true)}>Olvido de contraseña</button>
            {/*Modal de error de login */}
        <Dialog open={openErrorLogin} handler={handleOpenErrorLogin}>
        <DialogHeader>Error</DialogHeader>
        <DialogBody>
            Usuario o contraseña incorrecta
        </DialogBody>
        <DialogFooter>
            <Button variant="text" color="red" onClick={handleOpenErrorLogin} className="mr-1"><span>Ok</span></Button>
        </DialogFooter>
      </Dialog>


          </div>
        </form>
          :
          <form onSubmit={(e) => changePassword(e)}>
            <span className="text-white">Modelo del primer vehículo</span>
            <input type="text" value={securityAns} onChange={(e) => setSecurityAns(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Respuesta de la pregunta secreta"></input>
            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Nueva contraseña"></input>
            <button type="submit" className="bg-white p-2 px-4 rounded-lg text-black">Cambiar contraseña</button>
            {/*Modal de error de cambio de password */}
        <Dialog open={openErrorPassword} handler={handleOpenErrorPassword}>
        <DialogHeader>Error</DialogHeader>
        <DialogBody>
            Respuesta incorrecta
        </DialogBody>
        <DialogFooter>
            <Button variant="text" color="red" onClick={handleOpenErrorPassword} className="mr-1"><span>Ok</span></Button>
        </DialogFooter>
      </Dialog>

          </form>
          }
          
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 text-black rounded-lg p-4">
        {children}
      </div>
    </div>
  );
}
