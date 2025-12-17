import { useState } from "react";
import blogImage from "../assets/img/ChatGPT Image 4 nov 2025, 23_03_08.png";
import Modal from 'bootstrap/js/dist/modal';

interface BlogPost {
  id: number;
  titulo: string;
  resumen: string;
  textoCompleto: string;
  precio: number;
  imagen: string;
}

const Blog = () => {
  const posts: BlogPost[] = [
    {
      id: 1,
      titulo: "Nuevas Tendencias Tecnológicas",
      resumen: "Descubre las últimas novedades del mundo tech.",
      textoCompleto:
        "Explora cómo la inteligencia artificial, el internet de las cosas y el desarrollo sostenible están transformando nuestra vida cotidiana.",
      precio: 25990,
      imagen: blogImage,
    },
    {
      id: 2,
      titulo: "Top Gadgets del 2025",
      resumen: "Los dispositivos más populares y potentes del año.",
      textoCompleto:
        "Desde smartphones plegables hasta drones personales, estos son los gadgets que están marcando tendencia en 2025.",
      precio: 159990,
      imagen: blogImage,
    },
    {
      id: 3,
      titulo: "Guía de Compra - Equipo Gamer",
      resumen: "Cómo elegir los mejores periféricos para tu setup.",
      textoCompleto:
        "Te explicamos qué buscar en un teclado mecánico, mouse RGB y monitores de alto rendimiento para jugar como un profesional.",
      precio: 89990,
      imagen: blogImage,
    },
  ];

  const [postSeleccionado, setPostSeleccionado] = useState<BlogPost | null>(null);

  const abrirModal = (post: BlogPost) => {
    setPostSeleccionado(post);
    const modalEl = document.getElementById("postModal");
    if (modalEl) {
      const modal = new Modal(modalEl as any);
      modal.show();
    }
  };

  return (
    <>
      <main className="container my-5">
        <h1 className="text-center fw-bold mb-5">Nuestro Blog de Tecnología</h1>

        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-md-4 mb-4">
              <div
                className="card h-100 shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() => abrirModal(post)}
              >
                <img
                  src={post.imagen}
                  alt={post.titulo}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{post.titulo}</h5>
                  <p className="card-text text-muted">{post.resumen}</p>
                  <button className="btn btn-primary w-100">
                    Leer más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div
        className="modal fade"
        id="postModal"
        tabIndex={-1}
        aria-labelledby="modalPostTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalPostTitle">
                {postSeleccionado?.titulo || "Título del Post"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <img
                src={postSeleccionado?.imagen}
                className="img-fluid rounded mb-3"
                alt="Imagen del post"
              />
              <p>{postSeleccionado?.textoCompleto}</p>
              <hr />
              <div className="text-end">
                <h4 className="fw-bold text-primary">
                  Precio del producto:{" "}
                  <span id="modalPostPrice">
                    ${postSeleccionado?.precio.toLocaleString("es-CL")}
                  </span>
                </h4>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <a href="/productos" className="btn btn-success">
                Ver en la tienda
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (puede ir global en App.tsx también) */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">© 2025 ForoTech - Todos los derechos reservados</p>
      </footer>
    </>
  );
};

export default Blog;
