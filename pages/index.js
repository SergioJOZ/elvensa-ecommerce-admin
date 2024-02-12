import Layout from "@/components/layout";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function Home() {
  const [bsVarData, setBsVarData] = useState()
  const [changeBsVar, setChangeBsVar] = useState(false)
  const [bsVariable, setBsVariable] = useState()
  const [changeError, setChangeError] = useState(false)
  useEffect(() => {
    axios.get('/api/bsvar').then(response => {
      setBsVarData(response.data[0])
      
    })
  }, [])

  useEffect(() => {
    axios.get('/api/bsvar').then(response => {
      setBsVarData(response.data[0])
      
    })
  }, [bsVarData])

  async function updateBsVar(e){
    e.preventDefault()
    
    const invalidChar = ","

    if(!bsVariable || bsVariable.toString().includes(invalidChar)){
      setChangeBsVar(false)
      setChangeError(true)
      return;
    }
    const data = {
      bsVariable
    }

    
    
    await axios.patch("/api/bsvar?id=" + bsVarData._id, {data});
    setChangeBsVar(false);
    
  }

  function handleOpenChange(){
    setChangeError(!changeError)
  }

  return (
    <Layout>
      <div className="text-blue-900 flex justify-center items-center flex-col">
      <Image src="/images/logoFondoAzul.jpg" alt="Elvensa" width={500} height={500}/>
      <span className="text-lg font-extrabold">Panel de Administración del Sistema Web de Ventas</span>
      
       {/*Modal de error de cambio de tasa */}
       <Dialog open={changeError} handler={handleOpenChange}>
        <DialogHeader>Error</DialogHeader>
        <DialogBody>
           Introduciste una tasa invalida
        </DialogBody>
        <DialogFooter>
            <Button variant="text" color="red" onClick={handleOpenChange} className="mr-1"><span>Ok</span></Button>
        </DialogFooter>
      </Dialog>

      {!bsVarData || changeBsVar ? <form className="flex gap-20" onSubmit={updateBsVar}>
        <span className="font-bold">Ingresa la tasa de hoy:</span>
        <input type="number" placeholder="Tasa de cambio" onKeyDown={(evt) => ["e", "E", "+", "-", ","].includes(evt.key) && evt.preventDefault()} value={bsVariable} onChange={(e) => setBsVariable(e.target.value) }></input>
        <span>Bs</span>
        <Button size="sm" variant="filled" color="blue" type="submit">Confirmar</Button>
        </form> :
        <form className="flex gap-20">
        <span className="font-bold">La tasa de cambio de hoy es: {bsVarData.bsVariable} Bs por 1$</span>
      <Button size="sm" variant="filled" color="blue" onClick={() => setChangeBsVar(true)}>Cambiar tasa</Button>
      </form>
      }
      
      </div>
    </Layout>
  );
}
