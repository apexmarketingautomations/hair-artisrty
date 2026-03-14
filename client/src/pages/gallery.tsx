import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Play, ExternalLink, Star, ArrowRight, Image, Video, Link2 } from "lucide-react";
import type { GalleryItem } from "@shared/schema";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

type FilterType = "all" | "image" | "video" | "link";

const categories = [
  { key: "all" as FilterType, label: "All", icon: Camera },
  { key: "image" as FilterType, label: "Photos", icon: Image },
  { key: "video" as FilterType, label: "Videos", icon: Video },
  { key: "link" as FilterType, label: "Links", icon: Link2 },
];

function getEmbedUrl(url: string) {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const igMatch = url.match(/instagram\.com\/(reel|p)\/([\w-]+)/);
  if (igMatch) return `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed`;
  const ttMatch = url.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/);
  if (ttMatch) return `https://www.tiktok.com/embed/v2/${ttMatch[1]}`;
  return null;
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
}

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const { data: items, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ["/api/gallery"],
  });

  const filtered = items?.filter((item) => activeFilter === "all" || item.type === activeFilter) || [];

  return (
    <div className="min-h-screen">
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/work/work-15.jpg" alt="Gallery showcase" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 via-rose-900/10 to-amber-900/15" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p variants={fadeUp} custom={0} className="text-amber-300/90 tracking-[0.3em] uppercase text-xs mb-4 font-semibold">Our Work</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-serif text-white mb-4" data-testid="text-gallery-title">
            Gallery & <span className="italic text-amber-200/90">Content</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-stone-300 text-lg max-w-xl mx-auto">See the artistry in action — transformations, tutorials, and behind-the-scenes moments from the salon.</motion.p>
        </motion.div>
      </section>

      <section className="py-6 px-4 sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === cat.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover-elevate"
                }`}
                data-testid={`button-filter-${cat.key}`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <Camera className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-serif text-xl mb-2">No Content Yet</h3>
              <p className="text-muted-foreground text-sm">
                {activeFilter === "all"
                  ? "Gallery content will appear here once the salon adds photos, videos, and links."
                  : `No ${activeFilter}s have been added yet. Check back soon!`}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {filtered.map((item, i) => (
                  <GalleryCard key={item.id} item={item} index={i} onOpen={() => setLightboxItem(item)} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-stone-900 via-rose-950/80 to-violet-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-4">
              <Star className="w-5 h-5 text-amber-300" />
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif text-white mb-4">
              Ready for Your <span className="italic text-amber-200">Transformation?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-stone-300 mb-8 text-lg max-w-xl mx-auto">
              Inspired by what you see? Book your appointment and let our artists bring your vision to life.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <a href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="px-10 h-12 text-base" data-testid="button-book-gallery">
                  Book Your Appointment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
            data-testid="lightbox-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setLightboxItem(null)} className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm" data-testid="button-close-lightbox">
                Close
              </button>
              {lightboxItem.type === "image" ? (
                <img src={lightboxItem.url} alt={lightboxItem.title} className="w-full max-h-[80vh] object-contain rounded-lg" />
              ) : lightboxItem.type === "video" ? (
                (() => {
                  const embedUrl = getEmbedUrl(lightboxItem.url);
                  if (embedUrl) {
                    return <iframe src={embedUrl} className="w-full aspect-video rounded-lg" allowFullScreen allow="autoplay; encrypted-media" />;
                  }
                  if (isVideoUrl(lightboxItem.url)) {
                    return <video src={lightboxItem.url} controls className="w-full max-h-[80vh] rounded-lg" />;
                  }
                  return <iframe src={lightboxItem.url} className="w-full aspect-video rounded-lg" allowFullScreen />;
                })()
              ) : null}
              {lightboxItem.title && (
                <div className="mt-3 text-white">
                  <h3 className="font-serif text-lg">{lightboxItem.title}</h3>
                  {lightboxItem.description && <p className="text-white/60 text-sm mt-1">{lightboxItem.description}</p>}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryCard({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: () => void }) {
  const embedUrl = item.type === "video" ? getEmbedUrl(item.url) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-lg border border-border bg-card cursor-pointer hover-elevate ${item.featured ? "col-span-2 row-span-2" : ""}`}
      onClick={() => item.type === "link" ? window.open(item.url, "_blank") : onOpen()}
      data-testid={`card-gallery-${item.id}`}
    >
      {item.type === "image" ? (
        <div className={`${item.featured ? "aspect-square" : "aspect-square"} overflow-hidden`}>
          <img
            src={item.thumbnail || item.url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      ) : item.type === "video" ? (
        <div className="aspect-square overflow-hidden relative bg-black">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-600/30 to-rose-600/30 flex items-center justify-center">
              <Video className="w-12 h-12 text-white/40" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-square overflow-hidden relative bg-gradient-to-br from-amber-500/10 to-rose-500/10">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ExternalLink className="w-12 h-12 text-primary/30" />
            </div>
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-1">
            {item.featured && <Badge variant="secondary" className="text-[10px] py-0">Featured</Badge>}
            <Badge variant="outline" className="text-[10px] py-0 bg-white/10 border-white/20 text-white">
              {item.type === "image" ? "Photo" : item.type === "video" ? "Video" : "Link"}
            </Badge>
          </div>
          <h3 className="text-white font-medium text-sm">{item.title}</h3>
          {item.description && <p className="text-white/60 text-xs mt-0.5 line-clamp-2">{item.description}</p>}
        </div>
      </div>
    </motion.div>
  );
}
