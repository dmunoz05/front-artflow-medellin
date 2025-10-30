import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Instagram, Facebook, Twitter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast, Toaster } from "sonner";
import './App.css'

const initialArtworks = [
  {
    id: 1,
    imageUrl: "/colorful-abstract-painting-medellin-streets.jpg",
  },
  {
    id: 2,
    imageUrl: "/mountain-landscape-sunrise-painting.jpg",
  },
  {
    id: 3,
    imageUrl: "/urban-abstract-art-colorful.jpg",
  },
  {
    id: 4,
    imageUrl: "/watercolor-flowers-tropical.jpg",
  },
  {
    id: 5,
    title: "Metro Lines",
    imageUrl: "/geometric-metro-train-modern-art.jpg",
  },
  {
    id: 6,
    imageUrl: "/cultural-mosaic-colorful-art.jpg",
  },
]

function App() {
  var api = window.location.hostname == 'localhost' ? 'http://localhost:3000/server/v1' : import.meta.env.VITE_API_URL || "https://back-artflow-medellin.vercel.app/server/v1"
  const [hasUploaded, setHasUploaded] = useState(false);
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name_user: "",
    title: "",
    username: "",
    description: "",
    image: null,
  })

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork)
    setIsModalOpen(true)
  }

  const getAllGallery = async () => {
    try {
      const response = await fetch(`${api}/gallery/g/images`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name_user", formData.name_user);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("image", formData.image);

      const response = await fetch(`${api}/gallery/p/image`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Obra subida correctamente");
        localStorage.setItem("art_uploaded", "true");
        setHasUploaded(true);

        const imageUrl = URL.createObjectURL(formData.image);

        const newArtwork = {
          id: artworks.length + 1,
          title: formData.title,
          name_user: formData.name_user,
          username: formData.username,
          description: formData.description,
          imageUrl: imageUrl,
        };

        setArtworks([...artworks, newArtwork]);
        setFormData({ name_user: "", title: "", description: "", image: null });

        document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
      } else {
        toast.error("Error al subir la obra" + (data.message ? ": " + data.message : ""));
      }
    } catch (error) {
      console.error("Error al subir la obra:", error);
      toast.error("Error al subir la obra");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("❌ Solo se permiten imágenes PNG, JPG, JPEG o WEBP.");
      e.target.value = "";
      return;
    }

    // Crear previsualización
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: file,
        preview: reader.result, // guardamos la URL base64 temporal
      });
    };
    reader.readAsDataURL(file);
  };


  useEffect(() => {
    const alreadySubmitted = localStorage.getItem("art_uploaded");
    if (alreadySubmitted) {
      setHasUploaded(true);
    }
    getAllGallery().then(data => {
      if (data && data.status === 200 && data.data) {
        const fetchedArtworks = data.data.map(item => ({
          id: item.id,
          title: item.title,
          name_user: item.name_user,
          username: item.username,
          description: item.description,
          imageUrl: item.image_base64,
        }))
        setArtworks(fetchedArtworks)
        setLoading(false)
      }
    })
  }, [])

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
        {/* Header */}
        <header className="px-5 sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-100">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <a href="#home" ><h1 className="text-xl flex items-center justify-center font-serif font-bold text-purple-900">Artflow&nbsp;<img className="w-10 h-10" src="/favicon.png" /><span className="-left-1 relative" >edellín</span></h1></a>
              <div className="hidden md:flex items-center gap-8">
                <a href="#home" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  Inicio
                </a>
                <a href="#gallery" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  Galleria
                </a>
                <a href="#upload" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  Subir Arte
                </a>
                <a href="#about" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  Acerca de
                </a>
                <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  Contacto
                </a>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section id="home" className="relative py-24 md:py-32 overflow-hidden">
          {/* Fondo de cuadrícula animada */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="animate-scroll-slow flex w-[400%] h-full">
              {[...initialArtworks].map((_, repeatIndex) => (
                <div key={repeatIndex} className="grid grid-cols-6 grid-rows-3 gap-2 w-1/4 h-full">
                  {[
                    "/colorful-abstract-painting-medellin-streets.jpg",
                    "/mountain-landscape-sunrise-painting.jpg",
                    "/urban-abstract-art-colorful.jpg",
                    "/watercolor-flowers-tropical.jpg",
                    "/geometric-metro-train-modern-art.jpg",
                    "/cultural-mosaic-colorful-art.jpg",
                  ].map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-lg">
                      <img
                        src={img}
                        alt=""
                        className="object-cover w-full h-full opacity-90 hover:scale-110 transition-transform duration-[4000ms]"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Degradado para legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
          </div>

          {/* Contenido principal */}
          <div className="relative z-10 text-center text-white px-4">
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-lg">
              Galería de Arte Virtual
              <br />
              <span className="text-purple-300">de Medellín</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto">
              Un espacio donde el arte y la cultura cobra vida digitalmente.
            </p>
            <Button
              size="lg"
              className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explorar Galería
            </Button>
          </div>
        </section>


        {/* Gallery Section */}
        <section id="gallery" className="py-20 bg-white/50">
          <div className="container mx-auto px-6">
            <h3 className="text-4xl font-serif font-bold text-center text-gray-900 mb-4">Obras de arte destacadas </h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Descubre la creatividad, el arte y la cultura del talento artistico de Medellín.
            </p>

            {loading ? (
              <div>
                <div className="flex-col gap-4 w-full flex items-center justify-center">
                  <div className="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
                    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" className="animate-ping">
                      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artworks.map((artwork, index) => (
                  <Card
                    key={artwork.id}
                    className="group cursor-pointer overflow-hidden border-0 py-0 shadow-md hover:shadow-2xl transition-all duration-300 animate-fade-in-up bg-white"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleArtworkClick(artwork)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={artwork.imageUrl || "/placeholder.svg"}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">{artwork.title}</h4>
                      <p className="text-sm text-purple-600 font-medium">by {artwork.name_user}</p>
                      <a href={'https://www.instagram.com/' + artwork.username} target="__blank" className="text-sm text-gray-500 mt-1 z-20 relative cursor-help ">{'@' + artwork.username}</a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {hasUploaded ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">
              🎨 ¡Gracias por compartir!
            </h2>
            <p className="text-gray-500">
              Solo puedes subir una obra por usuario, pero puedes explorar la galería y disfrutar del arte de otros.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("art_uploaded");
                setHasUploaded(false);
              }}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Permitir nueva subida
            </button>
          </div>
        ) : (
          <section id="upload" className="py-20 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
            <div className="container mx-auto px-6 max-w-2xl">
              <h3 className="text-4xl font-serif font-bold text-center text-gray-900 mb-4">Comparte arte y cultura</h3>
              <p className="text-center text-gray-600 mb-12">
                Sube tus obras de arte de tu comuna y forma parte de nuestra red creativa.
              </p>
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name_user" className="text-gray-700">
                        Nombre
                      </Label>
                      <Input
                        id="name_user"
                        placeholder="Pon tu nombre"
                        value={formData.name_user}
                        onChange={(e) => setFormData({ ...formData, name_user: e.target.value })}
                        required
                        className="border-gray-200 focus:border-purple-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-700">
                        Título
                      </Label>
                      <Input
                        id="title"
                        placeholder="Pon un titulo a la fotografía"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="border-gray-200 focus:border-purple-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-700">
                        Usuario de instagram
                      </Label>
                      <Input
                        id="title"
                        placeholder="Pon tu usuario de instagram"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        className="border-gray-200 focus:border-purple-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-700">
                        Descripción
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Escribe información sobre tu fotografía"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        className="border-gray-200 focus:border-purple-400 min-h-24"
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="image" className="text-gray-700">
                        Imagen
                      </Label>
                      {/* Previsualización */}
                      {formData.preview ? (
                        <div className="w-full flex justify-center">
                          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 shadow-md">
                            <img
                              src={formData.preview}
                              alt="Vista previa"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, image: null, preview: null })}
                              className="absolute top-2 right-2 bg-white text-black hover:text-white rounded-full py-1 px-2 hover:bg-purple-600 transition"
                              title="Eliminar imagen"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed relative border-gray-200 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />

                          {/* Input oculto */}
                          <Input
                            id="image"
                            type="file"
                            accept="image/png, image/jpg, image/jpeg, image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                          />

                          <Label
                            htmlFor="image"
                            className="cursor-pointer flex justify-center text-purple-600 hover:text-purple-700 font-medium"
                          >
                            {formData.image ? "Cambiar imagen" : "Click para subir o arrastrar"}
                          </Label>
                          <p className="text-sm text-gray-500 mt-2">Formatos: PNG, JPG, JPEG, WEBP (máx. 10MB)</p>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                      Subir Obra
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* About Section */}
        <section id="about" className="py-20 bg-white/50">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h3 className="text-4xl font-serif font-bold text-gray-900 mb-6">Acerca de nuestra galería</h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              La Galería Virtual de Arte Juvenil de Medellín es una plataforma digital dedicada a promover la creatividad,
              la inclusión y la comunidad a través del arte local. Creemos que todo joven artista merece un espacio para compartir
              su visión con el mundo.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Desde niños hasta adultos, todos son bienvenidos a subir y compartir obras de arte y cultura de la ciudad. ¡Únete a nosotros para celebrar el
              vibrante espíritu artístico de Medellín!
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h4 className="text-2xl font-serif font-bold mb-4">Artflow Medellín</h4>
              <p className="text-gray-400">From Medellín — All rights reserved</p>
              <p className="text-gray-400 mb-6">Created for <a className="underline" href="https://my-portfolio-pink-beta-50.vercel.app" target="__blank" >Daniel Muñoz</a> </p>
              <div className="flex justify-center gap-6">
                <a href="https://www.instagram.com/dhmunoz05" target="__blank" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://www.facebook.com/dahnidev" target="__blank" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Artwork Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl">
            {selectedArtwork && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif">{selectedArtwork.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={selectedArtwork.imageUrl || "/placeholder.svg"}
                      alt={selectedArtwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-purple-600 font-medium mb-2">by {selectedArtwork.name_user}</p>
                    <p className="text-gray-600 leading-relaxed">{selectedArtwork.description}</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default App
