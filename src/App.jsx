import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Instagram, Facebook, Twitter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import './App.css'

const initialArtworks = [
  {
    id: 1,
    title: "Medellín Dreams",
    artist: "Sofia Martinez",
    description: "A vibrant representation of our city's colorful streets and warm people.",
    imageUrl: "/colorful-abstract-painting-medellin-streets.jpg",
  },
  {
    id: 2,
    title: "Mountain Sunrise",
    artist: "Carlos Restrepo",
    description: "The beautiful mountains surrounding Medellín at dawn.",
    imageUrl: "/mountain-landscape-sunrise-painting.jpg",
  },
  {
    id: 3,
    title: "Urban Rhythm",
    artist: "Ana Gomez",
    description: "The energy and movement of city life captured in bold strokes.",
    imageUrl: "/urban-abstract-art-colorful.jpg",
  },
  {
    id: 4,
    title: "Flores del Valle",
    artist: "Miguel Torres",
    description: "Traditional flowers from the Aburrá Valley in watercolor.",
    imageUrl: "/watercolor-flowers-tropical.jpg",
  },
  {
    id: 5,
    title: "Metro Lines",
    artist: "Laura Sanchez",
    description: "An artistic interpretation of Medellín's iconic metro system.",
    imageUrl: "/geometric-metro-train-modern-art.jpg",
  },
  {
    id: 6,
    title: "Cultural Mosaic",
    artist: "David Ospina",
    description: "A celebration of our diverse cultural heritage.",
    imageUrl: "/cultural-mosaic-colorful-art.jpg",
  },
]

function App() {
  const [artworks, setArtworks] = useState(initialArtworks)
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    artist: "",
    title: "",
    description: "",
    image: null,
  })

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork)
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newArtwork = {
      id: artworks.length + 1,
      title: formData.title,
      artist: formData.artist,
      description: formData.description,
      imageUrl: formData.image
        ? URL.createObjectURL(formData.image)
        : `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(formData.title)}`,
    }

    setArtworks([...artworks, newArtwork])
    setFormData({ artist: "", title: "", description: "", image: null })

    // Scroll to gallery to see the new artwork
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] })
    }
  }

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
                  Home
                </a>
                <a href="#gallery" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  Gallery
                </a>
                <a href="#upload" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  Upload Art
                </a>
                <a href="#about" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  About
                </a>
                <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section id="home" className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 animate-fade-in text-balance">
              Virtual Youth Art Gallery
              <br />
              <span className="text-purple-600">of Medellín</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up text-pretty">
              A space where young art comes to life digitally
            </p>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all animate-fade-in-up"
              onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Gallery
            </Button>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-20 bg-white/50">
          <div className="container mx-auto px-6">
            <h3 className="text-4xl font-serif font-bold text-center text-gray-900 mb-4">Featured Artworks</h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Discover the creativity and talent of young artists from Medellín
            </p>

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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section id="upload" className="py-20 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
          <div className="container mx-auto px-6 max-w-2xl">
            <h3 className="text-4xl font-serif font-bold text-center text-gray-900 mb-4">Share Your Art</h3>
            <p className="text-center text-gray-600 mb-12">
              Upload your artwork and become part of our creative community
            </p>

            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="artist" className="text-gray-700">
                      Artist Name
                    </Label>
                    <Input
                      id="artist"
                      placeholder="Your name"
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      required
                      className="border-gray-200 focus:border-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-700">
                      Artwork Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Give your artwork a name"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="border-gray-200 focus:border-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your artwork..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      className="border-gray-200 focus:border-purple-400 min-h-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-gray-700">
                      Upload Image
                    </Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <Label htmlFor="image" className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium">
                        {formData.image ? formData.image.name : "Click to upload or drag and drop"}
                      </Label>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Submit Artwork
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white/50">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h3 className="text-4xl font-serif font-bold text-gray-900 mb-6">About Our Gallery</h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              The Virtual Youth Art Gallery of Medellín is a digital platform dedicated to promoting creativity,
              inclusion, and community through local art. We believe that every young artist deserves a space to share
              their vision with the world.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              From kids to adults, everyone is welcome to upload and share their artwork. Join us in celebrating the
              vibrant artistic spirit of Medellín!
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h4 className="text-2xl font-serif font-bold mb-4">Artflow Medellín</h4>
              <p className="text-gray-400 mb-6">Art project from Medellín — All rights reserved</p>
              <div className="flex justify-center gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
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
