import axios from "axios";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { PickerOverlay } from "filestack-react";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";

export default function ProductForm({
  _id,
  code: currentCode,
  title: currentTitle,
  description: currentDescription,
  price: currentPrice,
  images: existingImages,
  category: existingCategory,
  quantity: currentQuantity,
  unit: currentUnit,
}) {
  const [code, setCode] = useState( currentCode || "")

  const [title, setTitle] = useState(currentTitle || "");

  const [description, setDescription] = useState(currentDescription || "");

  const [price, setPrice] = useState(currentPrice || "");

  const [goProducts, setGoProducts] = useState("");

  const [images, setImages] = useState(existingImages || []);

  const [isUploading, setIsUploading] = useState(false);

  const [categories, setCategories] = useState(existingCategory || []);

  const [category, setCategory] = useState(existingCategory || "");

  const [showPicker, setShowPicker] = useState(false);

  const [quantity, setQuantity] = useState(currentQuantity || "");

  const [unit, setUnit] = useState(currentUnit || "")

  const [showError, setShowError] = useState(false)

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(e) {
    e.preventDefault();

    if(!code || !title || !description || !price || !images || !category || !quantity || !unit){
      setShowError(true)
      return;
    }

    const lowerCaseTitle = title.toLowerCase()
    const lowerCaseDescription = description.toLowerCase()
    const upperCaseCode = code.toUpperCase()
    const data = {
      code: upperCaseCode,
      title: lowerCaseTitle,
      description: lowerCaseDescription,
      price,
      images,
      category,
      quantity,
      unit
    };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }

    setGoProducts(true);
  }

  if (goProducts) {
    router.push("/products");
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function handleError(){
    setShowError(!showError)
  }

  return (
    <div>
      <Dialog open={showError} handler={handleError}>
        <DialogHeader>Error</DialogHeader>
        <DialogBody>
           Te faltan campos o hubo un error.
        </DialogBody>
        <DialogFooter>
            <Button variant="text" color="red" onClick={handleError} className="mr-1"><span>Ok</span></Button>
        </DialogFooter>
      </Dialog>


      {showPicker && (<PickerOverlay apikey={process.env.NEXT_PUBLIC_FILESTACK_API_KEY}
      pickerOptions={{
        accept: ["image/*"],
        maxFiles: 1,
        fromSources: ["local_file_system"],
        onClose:()=> setShowPicker(false),
        onUploadDone: (res) => {
          setImages([res.filesUploaded[0].url, ...images])
          
        }
      }}
      />)}
    <form onSubmit={saveProduct}>
    <label>Código del producto</label>
      <input
        type="text"
        placeholder="Código"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />


      <label>Nombre del producto</label>
      <input
        type="text"
        placeholder="Nombre del producto"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Tipo de producto</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Elige un tipo de producto</option>
        {categories.length > 0 &&
          categories.map((category) => (
            category.parent ? <option key={category._id} value={category._id}>{category.name} ({category.parent.name})</option> :
              ''
          ))}
      </select>

      <label>Imagénes</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className=" h-24">
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 p-1 flex items-center rounded-lg">
            <Spinner />
          </div>
        )}

        <button onClick={(e)=> {
          e.preventDefault()
          setShowPicker(true)}}
          className="w-24 h-24 cursor-pointer text-center text-gray-600 flex flex-col items-center justify-center text-sm rounded-md bg-gray-200"
          >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
            Subir Imagen</button>
      </div>

      <label>Descripcion</label>
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Precio (en USD)</label>
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
      />

      <label>Cantidad</label>
      <input
        type="number"
        placeholder="Cantidad"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
      />
      <label>Unidad</label>
      <input
        type="text"
        placeholder="mts, unidad, rollo..."
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
    </div>
  );
}
