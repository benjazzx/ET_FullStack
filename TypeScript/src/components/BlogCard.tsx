
interface Props {
  titulo: string;
  descripcion: string;
  imagen: string;
}

const BlogCard = ({ titulo, descripcion, imagen }: Props) => (
  <div className="col-md-4 mb-4">
    <div className="card h-100 shadow-sm">
      <img src={imagen} className="card-img-top" alt={titulo} />
      <div className="card-body">
        <h5>{titulo}</h5>
        <p>{descripcion}</p>
      </div>
    </div>
  </div>
);

export default BlogCard;
