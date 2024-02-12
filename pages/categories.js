import Layout from "@/components/layout";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState("");
  const [showError, setShowError] = useState(false)
  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
   
    if(!name){
      setShowError(true);
      return
    }

    const parentName = parent ? categories.find(category => category._id === parent).name : "";
    const data = {
        name,
        parent,
        parentName
    };
   


    
    
    if (editedCategory) {
      await axios.put("/api/categories", { ...data, _id: editedCategory._id });
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParent("");
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParent(category.parent?._id);
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "¿Estás seguro?",
        text: `¿Quieres eliminar ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, eliminar",
        confirmButtonColor: "#d55",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
    }

    function handleError(){
      setShowError(!showError)
    }

  return (
    <Layout>
      <Dialog open={showError} handler={handleError}>
        <DialogHeader>Error</DialogHeader>
        <DialogBody>
           Te faltan campos o hubo un error.
        </DialogBody>
        <DialogFooter>
            <Button variant="text" color="red" onClick={handleError} className="mr-1"><span>Ok</span></Button>
        </DialogFooter>
      </Dialog>

      <h1>Categorias</h1>
      <label>
        {editedCategory
          ? `Editar categoría: ${editedCategory.name}`
          : "Crear categoría nueva"}
      </label>
      <form onSubmit={saveCategory} className="">
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Nombre de la categoría"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select onChange={(ev) => setParent(ev.target.value)} value={parent}>
            <option value="">Nueva marca</option>
            {categories.length > 0 &&
              categories.map((category) => (category.parent ? '' :
              <option key={category._id} value={category._id}>Marca: {category.name}</option>
              ))}
          </select>
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              className="btn-default"
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParent("");
                
              }}
            >
              Cancelar
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Guardar
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Nombre de la marca o tipo de producto</td>
              <td>Marca (en caso de ser tipo de producto)</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{!category.parent ? 'MARCA:' : ''} {category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-primary mr-1"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
