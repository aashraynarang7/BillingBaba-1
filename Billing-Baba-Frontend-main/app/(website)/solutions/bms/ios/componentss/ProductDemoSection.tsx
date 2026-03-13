// Example file path: src/components/ios-page/ProductDemoSection.tsx

"use client"; // Mantenemos "use client" ya que el elemento <video> puede tener interacciones del lado del cliente.

import React from "react";
// FIX: Se eliminaron useState, motion y AnimatePresence ya que no se necesita un modal.

// FIX: Ya no se necesita el icono PlayIcon, así que se ha eliminado.

// --- Data for the Component ---
const demoData = {
  title: "Product Demo",
  // El thumbnail ya no es necesario ya que el video se muestra directamente.
  videoUrl:
    "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/pos-video-tutorial.mp4",
  backgroundSrc:
    "https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
};

const ProductDemoSection: React.FC = () => {
  // FIX: Se eliminó toda la lógica de estado para el modal (isModalOpen, handleOpenModal, handleCloseModal).

  return (
    <section
      className="py-16 md:py-24 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${demoData.backgroundSrc})` }}
    >
      {/* Capa oscura para mejor legibilidad del texto */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          {demoData.title}
        </h2>

        {/* FIX: El contenedor del thumbnail ahora contiene directamente el video. */}
        <div className="mx-auto max-w-4xl rounded-2xl shadow-2xl overflow-hidden aspect-video">
          <video
            src={demoData.videoUrl}
            title="Product Demo Video"
            controls // Muestra los controles de reproducción
            autoPlay // Empieza a reproducirse automáticamente
            muted // Empieza en silencio (importante para autoplay en la mayoría de navegadores)
            loop // Se repite continuamente
            playsInline // Asegura la reproducción en línea en iOS
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default ProductDemoSection;
