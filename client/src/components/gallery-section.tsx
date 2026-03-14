import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  "/images/work/work-03.jpg",
  "/images/work/work-07.jpg",
  "/images/work/work-08.jpg",
  "/images/work/work-11.jpg",
  "/images/work/work-12.jpg",
  "/images/work/work-13.jpg",
  "/images/work/work-14.jpg",
  "/images/work/work-15.jpg",
  "/images/work/work-16.jpg",
  "/images/work/work-17.jpg",
  "/images/work/work-18.jpg",
  "/images/work/work-19.jpg",
  "/images/work/work-20.jpg",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" } }),
};

const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null));
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  return (
    <section className="py-24 px-4" data-testid="section-gallery">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} custom={0} className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">
            Gallery
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif mb-4" data-testid="text-gallery-heading">
            Our <span className="italic">Work</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto text-base">
            Real results from our talented team. Every style tells a story.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {galleryImages.map((src, i) => (
            <motion.button
              key={src}
              variants={fadeUp}
              custom={i}
              type="button"
              aria-label={`View gallery image ${i + 1}`}
              className="group relative aspect-square overflow-hidden rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              onClick={() => openLightbox(i)}
              data-testid={`gallery-image-${i}`}
            >
              <img
                src={src}
                alt={`Hair Artistry work ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 group-focus:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 tracking-wide">
                  View
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery image ${lightboxIndex + 1} of ${galleryImages.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
            data-testid="lightbox-overlay"
          >
            <button
              onClick={closeLightbox}
              aria-label="Close lightbox"
              className="absolute top-4 right-4 text-white/70 hover:text-white z-50 p-2"
              data-testid="button-lightbox-close"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 p-2"
              data-testid="button-lightbox-prev"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 p-2"
              data-testid="button-lightbox-next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={galleryImages[lightboxIndex]}
              alt={`Hair Artistry work ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-md"
              onClick={(e) => e.stopPropagation()}
              data-testid="lightbox-image"
            />

            <div className="absolute bottom-4 text-white/50 text-sm" data-testid="text-lightbox-counter">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
