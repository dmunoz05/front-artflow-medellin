import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Instagram, Facebook, Twitter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import React, { useEffect, useState } from "react"
import './App.css'

const initialArtworks = [
  {
    id: 1,
    title: "Medellín Dreams",
    artist: "Sofia Martinez",
    username: "sofia_art",
    description: "A vibrant representation of our city's colorful streets and warm people.",
    imageUrl: "/colorful-abstract-painting-medellin-streets.jpg",
  },
  {
    id: 2,
    title: "Mountain Sunrise",
    artist: "Carlos Restrepo",
    username: "carlos_paints",
    description: "The beautiful mountains surrounding Medellín at dawn.",
    imageUrl: "/mountain-landscape-sunrise-painting.jpg",
  },
  {
    id: 3,
    title: "Urban Rhythm",
    artist: "Ana Gomez",
    username: "ana_creative",
    description: "The energy and movement of city life captured in bold strokes.",
    imageUrl: "/urban-abstract-art-colorful.jpg",
  },
  {
    id: 4,
    title: "Flores del Valle",
    artist: "Miguel Torres",
    username: "miguel_art",
    description: "Traditional flowers from the Aburrá Valley in watercolor.",
    imageUrl: "/watercolor-flowers-tropical.jpg",
  },
  {
    id: 5,
    title: "Metro Lines",
    artist: "Laura Sanchez",
    username: "laura_paints",
    description: "An artistic interpretation of Medellín's iconic metro system.",
    imageUrl: "/geometric-metro-train-modern-art.jpg",
  },
  {
    id: 6,
    title: "Cultural Mosaic",
    artist: "David Ospina",
    username: "david_creates",
    description: "A celebration of our diverse cultural heritage.",
    imageUrl: "/cultural-mosaic-colorful-art.jpg",
  },
]

function App() {
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    artist: "",
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
      const response = await fetch("http://localhost:3000/server/v1/gallery/g/images");
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
      formDataToSend.append("artist_name", formData.artist);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("image", formData.image);

      const response = await fetch("http://localhost:3000/server/v1/gallery/p/image", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Obra subida correctamente");

        const imageUrl = URL.createObjectURL(formData.image);

        const newArtwork = {
          id: artworks.length + 1,
          title: formData.title,
          artist: formData.artist,
          username: formData.username,
          description: formData.description,
          imageUrl: imageUrl,
        };

        setArtworks([...artworks, newArtwork]);
        setFormData({ artist: "", title: "", description: "", image: null });

        document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
      } else {
        alert("❌ Error: " + (data.message || "No se pudo subir la obra"));
      }
    } catch (error) {
      console.error("Error al subir la obra:", error);
      alert("❌ Error al conectar con el servidor");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] })
    }
  }

  useEffect(() => {
    getAllGallery().then(data => {
      if (data && data.status === 200 && data.data) {
        const fetchedArtworks = data.data.map(item => ({
          id: item.id,
          title: item.title,
          artist: item.artist_name,
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
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-100">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-serif font-bold text-purple-900">Artflow Medellín</h1>
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
        <section id="home" className="relative h-[90vh] overflow-hidden flex items-center justify-center">
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
              Un espacio donde el arte joven cobra vida digitalmente.
            </p>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
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
              Descubre la creatividad y el talento de jóvenes artistas de Medellín.
            </p>

            {loading ? (
              <div>
                <div class="flex-col gap-4 w-full flex items-center justify-center">
                  <div class="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
                    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="animate-ping">
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
                    className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 animate-fade-in-up bg-white"
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
                      <p className="text-sm text-purple-600 font-medium">by {artwork.artist}</p>
                      <a href={'https://www.instagram.com/' + artwork.username} target="__blank" className="text-sm text-gray-500 mt-1 z-20 relative cursor-help ">{'@' + artwork.username}</a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Upload Section */}
        <section id="upload" className="py-20 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
          <div className="container mx-auto px-6 max-w-2xl">
            <h3 className="text-4xl font-serif font-bold text-center text-gray-900 mb-4">Comparte tu arte</h3>
            <p className="text-center text-gray-600 mb-12">
              Sube tus obras de arte y forma parte de nuestra comunidad creativa.
            </p>

            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="artist" className="text-gray-700">
                      Nombre de artista
                    </Label>
                    <Input
                      id="artist"
                      placeholder="Pon el nombre del artista"
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      required
                      className="border-gray-200 focus:border-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-700">
                      Título de la obra de arte
                    </Label>
                    <Input
                      id="title"
                      placeholder="Pon el titulo de la obra"
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
                      placeholder="Dinos sobre tu obra de arte"
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
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <Label htmlFor="image" className="cursor-pointer flex justify-center text-purple-600 hover:text-purple-700 font-medium">
                        {formData.image ? formData.image.name : "Click to upload or drag and drop"}
                      </Label>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </div>
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
              Desde niños hasta adultos, todos son bienvenidos a subir y compartir sus obras de arte. ¡Únete a nosotros para celebrar el
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
                    <p className="text-purple-600 font-medium mb-2">by {selectedArtwork.artist}</p>
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
